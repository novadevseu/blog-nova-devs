import { NextResponse } from "next/server";
import { Resend } from "resend";

// Asegúrate de tener definida la variable de entorno RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  console.log("==> [API] Se ha llamado al endpoint de newsletter.");
  try {
    const { recipients, post } = await request.json();
    console.log("[API] Body recibido:", { recipients, post });

    if (!recipients || recipients.length === 0) {
      console.error("[API] No se han proporcionado destinatarios.");
      return NextResponse.json(
        { success: false, error: "No newsletter recipients provided." },
        { status: 404 }
      );
    }

    const subject = `New Post: ${post.title}`;
    //Cambiar a URL Reales cuando haya dominio
    const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #2C3E50; text-align: center;">📢 ${post.title}</h2>
    
    <img src="${post.thumbnailUrl}" alt="${post.title}" style="width: 100%; border-radius: 10px; margin-bottom: 20px;" />

    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      ${post.shortDescription}
    </p>

    <p style="color: #777; font-size: 14px;">
      <strong>By:</strong> ${post.author}<br/>
      <strong>Published on:</strong> ${new Date(post.timestamp).toLocaleDateString()}
    </p>

    <div style="text-align: center; margin-top: 20px;">
      <a href="https://yourblog.com/posts/${post.id}" 
         style="background: #3498DB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
         Read Full Post 📖
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

    <p style="text-align: center; font-size: 14px; color: #888;">
      You are receiving this email because you subscribed to our newsletter. 
      If you no longer wish to receive updates, you can <a href="https://yourblog.com/unsubscribe" style="color: #E74C3C;">unsubscribe here</a>.
    </p>
  </div>
`;

    console.log("[API] Asunto y contenido HTML preparados.");

    // Extraer los emails de los destinatarios
    const to = recipients.map((r: { email: string }) => r.email);
    console.log("[API] Destinatarios extraídos:", to);

    const emailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to,
      subject,
      html: htmlContent,
    });
    console.log("[API] Email enviado correctamente. Respuesta:", emailResponse);

    return NextResponse.json({ success: true, emailResponse });
  } catch (error: any) {
    console.error("[API] Error en el endpoint send-newsletter:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
