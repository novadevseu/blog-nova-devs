// app/api/send-newsletter/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    // Se espera recibir { recipients, post } en el body
    const { recipients, post } = await request.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "No newsletter recipients provided." },
        { status: 404 }
      );
    }

    const subject = `New Post: ${post.title}`;
    const htmlContent = `
      <h1>${post.title}</h1>
      <img src="${post.thumbnailUrl}" alt="${post.title}" style="max-width:100%;" />
      <p>${post.shortDescription}</p>
      <p><strong>By:</strong> ${post.author}</p>
      <p><strong>Published on:</strong> ${new Date(post.timestamp).toLocaleDateString()}</p>
      <p>Check out our new post on the blog!</p>
    `;

    // Se pasa el array de emails directamente
    const to = recipients.map((r: { email: string }) => r.email);
    const emailResponse = await resend.emails.send({
      from: "novadevseu@gmail.com",
      to,
      subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, emailResponse });
  } catch (error: any) {
    console.error("Error in send-newsletter endpoint:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
