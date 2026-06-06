export interface Company {
    name:string;
    domain:string
}

 


const apiKey = process.env.OCEAN_API_KEY

export async function findLookalikes(domain: string): Promise<Company[]>{
        if(!apiKey){
            throw new Error('OCEAN_API_KEY is not set in .env')           
        }
        const mockCompanies: Company[] = [
            { name: "Stripe", domain: "stripe.com" },
            { name: "Razorpay", domain: "razorpay.com" },
            { name: "PayU", domain: "payu.in" },
          ];
          
          return mockCompanies;

}