import axios from "axios";
import { DecisionMaker } from "./prospeo";

function buildEmail(contact: DecisionMaker, seedDomain: string): string {
  const firstName = contact.name.split(" ")[0];
  
  return `Hi ${firstName},

I came across ${contact.company} while researching companies similar to ${seedDomain}.

I'd love to explore if there's a fit between what we offer and what your team needs. Would you be open to a quick 15-minute call this week?

Best regards,
${process.env.SENDER_NAME}`;
}



export async function sendEmails(contacts: DecisionMaker[], seedDomain: string): Promise<void> {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;
    const senderName = process.env.SENDER_NAME;
  
    if (!apiKey) throw new Error("BREVO_API_KEY is not set in .env");
    if (!senderEmail) throw new Error("SENDER_EMAIL is not set in .env");
  
    let sent = 0;
    let failed = 0;
  
    for (const contact of contacts) {
      try {
        await axios.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            sender: { name: senderName, email: senderEmail },
            to: [{ email: contact.email, name: contact.name }],
            subject: `Quick question for you, ${contact.name.split(" ")[0]}`,
            textContent: buildEmail(contact, seedDomain),
          },
          { headers: { "api-key": apiKey } }
        );
        console.log(`✅ Sent to ${contact.name} <${contact.email}>`);
        sent++;
      }catch (error: any) {
        console.log(`❌ Failed:`, error.response?.data || error.message);
        failed++;
      }
    }
  
    console.log(`\nDone! Sent: ${sent}, Failed: ${failed}`);
  }