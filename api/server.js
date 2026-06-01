import express from 'express';
import { Resend } from 'resend';
import { buildCustomerEmail, buildAdminEmail } from './emails.js';

const PORT = process.env.PORT || 3000;
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM = process.env.MAIL_FROM || 'Ativiti MadsJeez <onboarding@resend.dev>';
const REPLY_TO = process.env.MAIL_REPLY_TO || 'automakemadsjeez@madsjeez.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'automakemadsjeez@madsjeez.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || '';
const PAYPAL_API = process.env.PAYPAL_API || 'https://api-m.paypal.com'; // sandbox: https://api-m.sandbox.paypal.com
const APP_URL = process.env.APP_URL || 'https://activepieces-production-5e31.up.railway.app';
const LANDING_URL = process.env.LANDING_URL || 'https://landing-production-cc56.up.railway.app';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || `${LANDING_URL},https://ativiti.madsjeez.com`).split(',').map(s => s.trim());

const resend = new Resend(RESEND_API_KEY);
const app = express();
app.use(express.json({ limit: '64kb' }));

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/healthz', (_req, res) => res.type('text').send('ok'));

// Optional: verify PayPal order server-to-server before sending email
async function verifyPaypalOrder(orderId) {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) return { skipped: true };
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    });
    const tokenJson = await tokenRes.json();
    const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` }
    });
    const order = await orderRes.json();
    return { ok: order.status === 'COMPLETED' || order.status === 'APPROVED', order };
  } catch (e) {
    console.error('PayPal verify failed:', e);
    return { ok: false, error: e.message };
  }
}

app.post('/api/payment-confirmed', async (req, res) => {
  try {
    const { orderId, plan, amount, customerEmail, customerName = '', payerEmail = '' } = req.body || {};
    if (!orderId || !plan || !amount || !customerEmail) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const verify = await verifyPaypalOrder(orderId);
    if (verify.ok === false) {
      console.warn('Order not verified', orderId, verify);
      // Still send but flag it
    }

    const meta = { orderId, plan, amount: String(amount), customerEmail, customerName, payerEmail, appUrl: APP_URL };

    const sendCustomer = resend.emails.send({
      from: FROM,
      to: customerEmail,
      replyTo: REPLY_TO,
      subject: `¡Pago confirmado! Bienvenido a Ativiti MadsJeez (${plan})`,
      html: buildCustomerEmail(meta),
      headers: { 'X-Entity-Ref-ID': orderId }
    });

    const sendAdmin = resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      replyTo: customerEmail,
      subject: `💰 Nuevo pago: ${plan} · USD ${amount} · ${customerEmail}`,
      html: buildAdminEmail(meta),
      headers: { 'X-Entity-Ref-ID': orderId }
    });

    const [c, a] = await Promise.allSettled([sendCustomer, sendAdmin]);
    const errors = [c, a].filter(r => r.status === 'rejected').map(r => r.reason?.message || String(r.reason));
    if (errors.length) console.error('Email errors:', errors);

    res.json({ ok: true, customerEmailId: c.value?.data?.id, adminEmailId: a.value?.data?.id, errors });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'internal' });
  }
});

app.listen(PORT, () => console.log(`API on :${PORT}`));
