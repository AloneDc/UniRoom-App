import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const ResendService = {
  async sendSupportEmail({
    name,
    email,
    subject,
    message,
  }: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const html = `
      <h2>Nuevo mensaje de soporte UniRoom</h2>
      <p><strong>De:</strong> ${name} (${email})</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p>${message}</p>
    `;

    const { error } = await resend.emails.send({
      from: "UniRoom <onboarding@resend.dev>",
      to: "soporte@uniroom.com",
      subject: `Soporte: ${subject}`,
      html,
    });

    if (error) throw new Error(error.message);
    return true;
  },
};
