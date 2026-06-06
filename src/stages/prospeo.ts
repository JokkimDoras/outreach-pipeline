import axios from "axios";
import { Company } from "./ocean";

export interface DecisionMaker {
  name: string;
  title: string;
  email: string;
  company: string;
  domain: string;
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
        name: `${person.first_name} ${person.last_name}`,
        title: person.job_title,
        email: person.email,
        company: company.name,
        domain: company.domain,
      }));
      allDecisionMakers.push(...mapped)
  }catch(error:any){
    const errCode = error.response?.data?.error_code
    console.log(`Skipping ${company.domain}: ${errCode}`)

  }}

  

  return allDecisionMakers
}