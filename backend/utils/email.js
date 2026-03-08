import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.EMAIL_ADMIN || 'admin@turrs.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const getBaseTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #050505;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 4px;
      color: #ffffff;
      margin: 0;
    }
    .subtitle {
      color: #74ACDF;
      font-size: 14px;
      margin-top: 5px;
    }
    .card {
      background-color: #0A0A0C;
      border: 1px solid #1a1a1a;
      border-radius: 12px;
      padding: 30px;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #74ACDF 0%, #C9A84C 100%);
      color: #000000;
      text-decoration: none;
      font-weight: bold;
      border-radius: 6px;
      margin-top: 20px;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      font-size: 12px;
      color: #888888;
    }
    .footer a {
      color: #888888;
      text-decoration: underline;
    }
    .text-secondary {
      color: #888888;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 10px 0;
      border-bottom: 1px solid #1a1a1a;
      text-align: left;
    }
    th {
      color: #888888;
      font-weight: normal;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">TURRS</h1>
      <div class="subtitle">${title}</div>
    </div>
    <div class="card">
      ${content}
    </div>
    <div class="footer">
      <p>Este email fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
      <p><a href="${FRONTEND_URL}">Visitar TURRS</a></p>
    </div>
  </div>
</body>
</html>
`;

export const sendOrderConfirmation = async (order, user) => {
  try {
    const firstName = user.firstName || user.name?.split(' ')[0] || 'Cliente';
    const shortId = order._id.toString().substring(0, 8);
    const dateFormatted = new Date(order.createdAt).toLocaleDateString('es-AR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const itemsHTML = order.products.map(item => `
      <tr>
        <td style="width: 50px;">
          ${item.productId.images?.[0] ? `<img src="${FRONTEND_URL}${item.productId.images[0]}" width="40" height="40" style="border-radius:4px; object-fit:cover;">` : ''}
        </td>
        <td>
          <div style="font-weight: bold;">${item.productId.name}</div>
          <div style="color: #888888; font-size: 12px;">Talle: ${item.size} | Cantidad: ${item.quantity}</div>
        </td>
        <td style="text-align: right; font-weight: bold;">$${item.price.toLocaleString('es-AR')}</td>
      </tr>
    `).join('');

    const content = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
        <h2 style="margin: 0; color: #ffffff;">¡Gracias por tu compra, ${firstName}!</h2>
        <p style="color: #888888; margin-top: 5px;">Pedido #${shortId} | ${dateFormatted}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            <th colspan="2">Producto</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding-top: 20px; color: #888888;">Envío</td>
            <td style="text-align: right; padding-top: 20px; font-weight: bold;">Gratis</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 10px; font-size: 18px; font-weight: bold;">Total</td>
            <td style="text-align: right; padding-top: 10px; font-size: 18px; font-weight: bold; color: #C9A84C;">$${order.total.toLocaleString('es-AR')}</td>
          </tr>
        </tfoot>
      </table>

      ${order.shippingAddress?.street ? `
      <div style="margin-top: 30px; background: #111111; padding: 15px; border-radius: 8px;">
        <h3 style="margin-top: 0; font-size: 14px; color: #888888;">Dirección de entrega</h3>
        <p style="margin: 0; font-size: 14px;">
          ${order.shippingAddress.street} ${order.shippingAddress.streetNumber || ''}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.province || order.shippingAddress.state}<br>
          CP: ${order.shippingAddress.postalCode || order.shippingAddress.zipCode}
        </p>
      </div>` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <p>Te avisaremos cuando tu pedido sea despachado.</p>
        <a href="${FRONTEND_URL}/mis-pedidos" class="btn">Ver estado del pedido</a>
      </div>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `✅ Pedido confirmado — TURRS #${shortId}`,
      html: getBaseTemplate('Tu pedido está confirmado', content)
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendOrderConfirmation):', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const content = `
      <h2 style="margin-top:0;">Restablecer contraseña</h2>
      <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en TURRS.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="btn">Restablecer contraseña</a>
      </div>
      
      <p class="text-secondary" style="font-size: 13px;">Este enlace expira en 1 hora.</p>
      <p class="text-secondary" style="font-size: 13px;">Si no solicitaste esto, ignorá este email. Tu contraseña no fue cambiada.</p>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: '🔐 Restablecer contraseña — TURRS',
      html: getBaseTemplate('Recuperación de cuenta', content)
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendPasswordResetEmail):', error);
    return { success: false, error: error.message };
  }
};

export const sendEmailVerification = async (user, verifyToken) => {
  try {
    const firstName = user.firstName || user.name?.split(' ')[0] || '';
    const verifyUrl = `${FRONTEND_URL}/verify-email?token=${verifyToken}`;
    const content = `
      <h2 style="margin-top:0;">Verificá tu email</h2>
      <p>Hola ${firstName}, te damos la bienvenida a TURRS.</p>
      <p>Para activar tu cuenta y poder realizar compras, por favor verificá tu dirección de correo electrónico.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" class="btn">Verificar mi correo</a>
      </div>
      
      <p class="text-secondary" style="font-size: 13px;">Este enlace expira en 24 horas.</p>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: '✉️ Verificá tu correo electrónico — TURRS',
      html: getBaseTemplate('Verificación de cuenta', content)
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendEmailVerification):', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (user) => {
  try {
    const firstName = user.firstName || user.name?.split(' ')[0] || 'Cliente';
    const content = `
      <h2 style="margin-top:0;">¡Bienvenido a TURRS, ${firstName}!</h2>
      <p>Tu cuenta fue completada exitosamente. Ya sos parte de la comunidad.</p>
      
      <div style="margin: 30px 0; background: #111111; padding: 20px; border-radius: 8px;">
        <h3 style="margin-top:0; font-size:16px;">Beneficios de tu cuenta:</h3>
        <ul style="list-style-type: none; padding: 0; margin: 0; line-height: 2;">
          <li>🛒 <b>Checkout veloz</b>: Tus compras de forma rápida usando tu perfil</li>
          <li>📦 <b>Seguimiento</b>: Seguí tus pedidos en tiempo real</li>
          <li>⭐ <b>Favoritos</b>: Guardá tus productos de interés (próximamente)</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/tienda" class="btn">Explorar la tienda →</a>
      </div>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `🎽 Bienvenido a TURRS, ${firstName}`,
      html: getBaseTemplate('Cuenta creada exitosamente', content)
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendWelcomeEmail):', error);
    return { success: false, error: error.message };
  }
};

export const sendNewsletterConfirmation = async (email) => {
  try {
    const content = `
      <h2 style="margin-top:0;">¡Ya estás en la lista!</h2>
      <p>Ya sos parte de la comunidad TURRS.</p>
      <p>Vas a recibir novedades, lanzamientos exclusivos y ofertas especiales directamente en esta bandeja de entrada.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${FRONTEND_URL}/tienda" class="btn">Ver la tienda →</a>
      </div>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: '✉️ Te suscribiste a TURRS',
      html: getBaseTemplate('Suscripción confirmada', content)
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendNewsletterConfirmation):', error);
    return { success: false, error: error.message };
  }
};

export const sendContactAutoReply = async (name, email, subject) => {
  try {
    const content = `
      <h2 style="margin-top:0;">Hola ${name},</h2>
      <p>Recibimos tu consulta con el asunto: <b>"${subject}"</b>.</p>
      <p>Nuestro equipo está revisando tu mensaje y te responderemos a la brevedad, generalmente en menos de 24 horas hábiles.</p>
      
      <div style="margin-top:30px; border-top: 1px solid #1a1a1a; padding-top:20px;">
        <p class="text-secondary" style="font-size: 13px;">Horario de atención: Lunes a Viernes 9-18hs</p>
      </div>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Recibimos tu mensaje — TURRS',
      html: getBaseTemplate('Aviso de recepción de consulta', content)
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendContactAutoReply):', error);
    return { success: false, error: error.message };
  }
};

export const sendAdminNewOrderAlert = async (order) => {
  try {
    const shortId = order._id.toString().substring(0, 8);
    const dateFormatted = new Date(order.createdAt).toLocaleString('es-AR');

    let productsText = "";
    order.products.forEach(p => {
      productsText += `- ${p.quantity}x (Talle ${p.size}) ${p.productId.name || p.productId}\n`;
    });

    const bodyText = `
NUEVA VENTA EN TURRS

ID: ${order._id}
Fecha: ${dateFormatted}
Total: $${order.total.toLocaleString('es-AR')}
Método: ${order.paymentMethod}

CLIENTE
Email: ${order.userId.email || order.userId}

PRODUCTOS
${productsText}

DIRECCIÓN
Calle: ${order.shippingAddress?.street} ${order.shippingAddress?.streetNumber}
Ciudad: ${order.shippingAddress?.city}, ${order.shippingAddress?.province}
CP: ${order.shippingAddress?.postalCode}

Ver en admin: ${FRONTEND_URL}/admin-dashboard
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `🛍 Nueva venta — $${order.total.toLocaleString('es-AR')} — TURRS Admin`,
      text: bodyText // Plain text for admin alerts
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendAdminNewOrderAlert):', error);
    return { success: false, error: error.message };
  }
};

export const sendAdminNewContactAlert = async (name, email, subject, message) => {
  try {
    const bodyText = `
NUEVO MENSAJE DE CONTACTO

De: ${name} <${email}>
Asunto: ${subject}
Recibido: ${new Date().toLocaleString('es-AR')}

MENSAJE:
${message}
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: `📩 Nuevo mensaje de contacto — ${subject}`,
      text: bodyText
    });

    return { success: true, id: result.id };
  } catch (error) {
    console.error('Email Error (sendAdminNewContactAlert):', error);
    return { success: false, error: error.message };
  }
};
