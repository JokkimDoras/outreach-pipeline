import * as readline from "readline";
import dotenv from "dotenv";
import { findLookalikes } from "./stages/ocean";
import { findDecisionMakers, enrichEmails } from "./stages/prospeo";
import { sendEmails } from "./stages/brevo";
import chalk from "chalk";

dotenv.config();

console.log(chalk.cyan("━━━━━━━━━━━━━━━━━━━━━━"));
console.log(chalk.green("Starting pipeline..."));

async function getDomine(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question("Enter seed domain:", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

async function main() {

  const domain = await getDomine();
  console.log(`Starting pipeline for: ${domain}`);
         
  
  const companies = await findLookalikes(domain);  
  console.log(`Found ${companies.length} companies`);


  const decisionMakers = await findDecisionMakers(companies.slice(0, 2));
  console.log(`Found ${decisionMakers.length} decision makers`);

  
  const contacts = await enrichEmails(decisionMakers.slice(0, 1));
  console.log(`Got emails for ${contacts.length} contacts`);


   // Safety checkpoint
  if(contacts.length === 0){
    console.log(chalk.red("No Email Found")) 
    return;
  } 
  
   // Safety checkpoint
   console.log(chalk.yellow("\n⚠️  About to send emails to:"));

  const ok = await confirm(chalk.bold(`\nSend ${contacts.length} emails? (y/n): `));

  if (!ok) {
    console.log("Aborted! No emails sent.");
    return;
  }

  await sendEmails(contacts, domain);
  console.log(chalk.green("\n✅ Pipeline complete!"));
}

main();