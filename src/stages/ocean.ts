import axios from "axios";

export interface Company {
    name:string;
    domain:string
}

 



export async function findLookalikes(domain: string): Promise<Company[]>{
    const apiKey = process.env.OCEAN_API_KEY
        if(!apiKey){
            throw new Error('OCEAN_API_KEY is not set in .env')           
        }
       try{

        const response = await axios.post(
            "https://api.ocean.io/v3/search/companies",
            {
              size: 10,
              companiesFilters: {
                lookalikeDomains: [domain]
              }
            },
            {
              headers: {
                "x-api-token": apiKey,
                "Content-Type": "application/json"
              }
            }
          )  
          const companies: Company[] = response.data.companies.map((item: any) => ({
            name: item.company.name,
            domain: item.company.domain,
          }));
          
          return companies;
        }catch(error:any){
          console.log(`Ocean.io error:`, error.response?.data || error.message);     
          return [];
        }
         
          
}