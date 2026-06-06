import * as readline from "readline";
import dotenv from "dotenv";
import { findLookalikes } from "./stages/ocean";
import { findDecisionMakers } from "./stages/prospeo";

dotenv.config();



async function getDomine():Promise<string>{
    const rl = readline.createInterface({
        input:process.stdin,
        output:process.stdout,
    });

    return new Promise((resolve) => {
        rl.question("Enter seed domain:",(answer) => {
            rl.close();
            resolve(answer.trim());
        })
    })
}

async function main() {
    const domain = await getDomine();
    console.log(`Starting pipeline for: ${domain}`);

    //Find the lookalike compoanies

    const companies = await findLookalikes(domain);
    console.log(`Found ${companies.length} companies`);

    // Find decision makers

    const decisionMakers = await findDecisionMakers(companies);
    console.log(`Found ${decisionMakers.length} decision makers`);

    //resolve mails
    // const contacts = await resolveEmails(decisionMakers);
    // console.log(`Resolved ${contacts} emails`)

    // //sends mails
    // await sendEmails(contacts,domain);

    // console.log("Pipeline complete")


}

main()