import axios from "axios";
import { Company } from "./ocean";

export interface DecisionMaker {
  name: string;
  title: string;
  email: string;
  company: string;
  domain: string;
  person_id:string;
}

export async function enrichEmails(decisionMakers: DecisionMaker[]): Promise<DecisionMaker[]> {
  const apiKey = process.env.PROSPEO_API_KEY;
  
  if (!apiKey) throw new Error("PROSPEO_API_KEY is not set in .env");

  const enriched: DecisionMaker[] = [];

  for (const person of decisionMakers) {
    try {
      const response = await axios.post(
        "https://api.prospeo.io/enrich-person",
        {
          only_verified_email: true,
          data: { person_id: person.person_id }
        },
        { headers: { "X-KEY": apiKey } }
      );

      const email = response.data.person?.email?.email;
      if (email) {
        enriched.push({ ...person, email });
        console.log(`Got email for ${person.name}: ${email}`);
      }
    } catch (error: any) {
      const errCode = error.response?.data?.error_code;
      console.log(`No email for ${person.name}: ${errCode}`);
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  return enriched;
}

export async function findDecisionMakers(companies: Company[]): Promise<DecisionMaker[]> {
  const apiKey = process.env.PROSPEO_API_KEY;

  if (!apiKey) {
    throw new Error("PROSPEO_API_KEY is not set in .env");
  }

  const allDecisionMakers: DecisionMaker[] = [];

  for (const company of companies) {
    try {
      const response = await axios.post(
      "https://api.prospeo.io/search-person",
      {
        page: 1,
        filters: {
          company: {
            websites: {
              include: [company.domain]
            }
          },
          person_seniority: {
            include: ["C-Suite", "Vice President", "Director", "Founder/Owner"]
          }
        }
      },
      {
        headers: {
          "X-KEY": apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    const people = response.data.results;

    const mapped = people.map((person: any) => ({
      name: `${person.person.first_name} ${person.person.last_name}`,
      title: person.person.current_job_title,
      email: '',
      person_id: person.person.person_id,
      company: company.name,
      domain: company.domain,
    }));
      allDecisionMakers.push(...mapped)
  }catch(error:any){
    console.log(`Skipping ${company.domain}:`, error.response?.data);

  }}

  

  return allDecisionMakers
}