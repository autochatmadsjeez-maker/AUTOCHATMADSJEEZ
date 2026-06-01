// Branded transactional emails for Ativiti MadsJeez
const BRAND = {
  name: 'Ativiti MadsJeez',
  primary: '#7c3aed',
  accent: '#06b6d4',
  bg: '#07070d',
  card: '#0f0f1d',
  text: '#e9e9f5',
  muted: '#a5a5bf',
  whatsapp: 'https://wa.me/5491121816064',
  support: 'automakemadsjeez@madsjeez.com',
  landing: 'https://landing-production-cc56.up.railway.app'
};

const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const layout = (title, preheader, bodyHtml) => `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escape(title)}</title>
<style>
  @media (max-width:600px){ .container{width:100%!important} .px{padding-left:20px!important;padding-right:20px!important} h1{font-size:24px!important} }
  a{color:#a78bfa}
  .btn:hover{filter:brightness(1.08)}
</style>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.text};-webkit-font-smoothing:antialiased">
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escape(preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BRAND.bg}">
  <tr><td align="center" style="padding:32px 16px">
    <table role="presentation" class="container" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:${BRAND.card};border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden">
      <tr><td style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});padding:24px 32px" class="px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td valign="middle">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding-right:12px"><img src="${BRAND.landing}/brand/logo-icon.svg" width="40" height="40" alt="" style="display:block;border-radius:10px;background:rgba(255,255,255,.15)"></td>
              <td style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-.02em">Ativiti MadsJeez</td>
            </tr></table>
          </td>
          <td align="right" style="color:rgba(255,255,255,.85);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase">Pago confirmado</td>
        </tr></table>
      </td></tr>
      <tr><td class="px" style="padding:36px 32px 8px">${bodyHtml}</td></tr>
      <tr><td class="px" style="padding:24px 32px 32px;border-top:1px solid rgba(255,255,255,.08)">
        <p style="margin:0 0 8px;font-size:13px;color:${BRAND.muted};line-height:1.6">¿Necesitás ayuda? Escribinos por <a href="${BRAND.whatsapp}" style="color:#a78bfa;text-decoration:none">WhatsApp</a> o <a href="mailto:${BRAND.support}" style="color:#a78bfa;text-decoration:none">${BRAND.support}</a>.</p>
        <p style="margin:0;font-size:11px;color:#6e6e8a;line-height:1.6">© ${new Date().getFullYear()} MadsJeez · Argentina 🇦🇷 · Automatización con IA para PyMEs<br>Este email es transaccional, no podés desuscribirte de notificaciones de pago.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

export function buildCustomerEmail({ orderId, plan, amount, customerName, customerEmail, payerEmail, appUrl }) {
  const greet = customerName ? `Hola ${escape(customerName.split(' ')[0])},` : 'Hola,';
  const body = `
  <h1 style="margin:0 0 12px;font-size:30px;line-height:1.15;font-weight:800;letter-spacing:-.02em;color:#fff">¡Tu pago se acreditó! 🎉</h1>
  <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:${BRAND.muted}">${greet} gracias por sumarte a <strong style="color:${BRAND.text}">Ativiti MadsJeez</strong>. Te confirmamos los detalles de tu pago.</p>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(6,182,212,.08));border:1px solid rgba(124,58,237,.25);border-radius:12px;margin-bottom:28px">
    <tr><td style="padding:20px 24px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px">
        <tr><td style="color:${BRAND.muted};padding:6px 0;width:42%">Plan / servicio</td><td style="color:${BRAND.text};font-weight:700;padding:6px 0">${escape(plan)}</td></tr>
        <tr><td style="color:${BRAND.muted};padding:6px 0">Monto</td><td style="color:${BRAND.text};font-weight:700;padding:6px 0">USD ${escape(amount)}</td></tr>
        <tr><td style="color:${BRAND.muted};padding:6px 0">Order ID</td><td style="color:${BRAND.text};font-weight:600;padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px">${escape(orderId)}</td></tr>
        ${payerEmail ? `<tr><td style="color:${BRAND.muted};padding:6px 0">Cuenta PayPal</td><td style="color:${BRAND.text};padding:6px 0">${escape(payerEmail)}</td></tr>` : ''}
        <tr><td style="color:${BRAND.muted};padding:6px 0">Email de contacto</td><td style="color:${BRAND.text};padding:6px 0">${escape(customerEmail)}</td></tr>
      </table>
    </td></tr>
  </table>

  <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#fff">Próximos pasos</h2>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:28px">
    <tr><td style="padding:10px 0;font-size:15px;line-height:1.6;color:${BRAND.text}"><strong style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});-webkit-background-clip:text;background-clip:text;color:transparent">1.</strong> &nbsp; Te activamos la cuenta en las próximas <strong>2 horas hábiles</strong>.</td></tr>
    <tr><td style="padding:10px 0;font-size:15px;line-height:1.6;color:${BRAND.text}"><strong style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});-webkit-background-clip:text;background-clip:text;color:transparent">2.</strong> &nbsp; Te escribimos por WhatsApp para agendar el <strong>onboarding 1-a-1</strong> (1 hora).</td></tr>
    <tr><td style="padding:10px 0;font-size:15px;line-height:1.6;color:${BRAND.text}"><strong style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});-webkit-background-clip:text;background-clip:text;color:transparent">3.</strong> &nbsp; Armamos juntos los <strong>primeros 3 flows</strong> con tus apps reales.</td></tr>
    <tr><td style="padding:10px 0;font-size:15px;line-height:1.6;color:${BRAND.text}"><strong style="background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});-webkit-background-clip:text;background-clip:text;color:transparent">4.</strong> &nbsp; Recibís tu <strong>factura A o B</strong> por email en 48 hs hábiles.</td></tr>
  </table>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:24px"><tr><td align="center">
    <a href="${escape(appUrl)}" class="btn" style="display:inline-block;background:linear-gradient(135deg,${BRAND.primary},${BRAND.accent});color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;box-shadow:0 10px 30px -10px rgba(124,58,237,.6)">Ingresar a la plataforma →</a>
  </td></tr></table>

  <p style="margin:0 0 8px;font-size:14px;color:${BRAND.muted};line-height:1.6;text-align:center">¿Querés acelerar el onboarding? Escribinos ya por <a href="${BRAND.whatsapp}" style="color:#a78bfa">WhatsApp</a>.</p>
  `;
  return layout('Pago confirmado — Ativiti MadsJeez', `Recibimos tu pago de USD ${amount} por ${plan}. Order ${orderId}.`, body);
}

export function buildAdminEmail({ orderId, plan, amount, customerName, customerEmail, payerEmail }) {
  const body = `
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#fff">💰 Nuevo pago recibido</h1>
  <p style="margin:0 0 20px;color:${BRAND.muted};font-size:15px">Activá la cuenta en activepieces y mandale onboarding por WhatsApp.</p>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.2);border-radius:10px">
    <tr><td style="padding:18px 22px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="font-size:14px">
        <tr><td style="color:${BRAND.muted};padding:5px 0;width:38%">Plan</td><td style="color:${BRAND.text};font-weight:700;padding:5px 0">${escape(plan)}</td></tr>
        <tr><td style="color:${BRAND.muted};padding:5px 0">Monto</td><td style="color:${BRAND.text};font-weight:700;padding:5px 0">USD ${escape(amount)}</td></tr>
        <tr><td style="color:${BRAND.muted};padding:5px 0">Cliente</td><td style="color:${BRAND.text};padding:5px 0">${escape(customerName) || '—'}</td></tr>
        <tr><td style="color:${BRAND.muted};padding:5px 0">Email contacto</td><td style="color:${BRAND.text};padding:5px 0"><a href="mailto:${escape(customerEmail)}" style="color:#a78bfa">${escape(customerEmail)}</a></td></tr>
        ${payerEmail ? `<tr><td style="color:${BRAND.muted};padding:5px 0">Email PayPal</td><td style="color:${BRAND.text};padding:5px 0">${escape(payerEmail)}</td></tr>` : ''}
        <tr><td style="color:${BRAND.muted};padding:5px 0">Order ID</td><td style="color:${BRAND.text};font-family:ui-monospace,Menlo,monospace;font-size:13px;padding:5px 0">${escape(orderId)}</td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin:20px 0 0;font-size:13px;color:${BRAND.muted}">Email automático del sistema · Ativiti MadsJeez</p>
  `;
  return layout('Nuevo pago — Ativiti MadsJeez', `${plan} · USD ${amount} · ${customerEmail}`, body);
}
