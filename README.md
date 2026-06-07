# 🚀 Outreach Pipeline

An automated cold-outreach pipeline that goes from a single company domain to sending personalized emails — with zero human intervention in between.

## How it works

```
company.domain → Ocean.io → Prospeo → Brevo → emails sent ✅
```

You type one seed domain. The system does everything after that on its own.

---

## The 4 Stages

| Stage | Tool | Input | Output |
|-------|------|-------|--------|
| 1 | **Ocean.io** | seed domain | lookalike company domains |
| 2 | **Prospeo** | company domains | decision makers (C-suite/VP) |
| 3 | **Prospeo Enrich** | person IDs | verified work emails |
| 4 | **Brevo** | emails + names | personalized emails sent |

---

## Project Structure

```
src/
├── index.ts              ← entry point, orchestrates all stages
├── stages/
│   ├── ocean.ts          ← Stage 1: find lookalike companies
│   ├── prospeo.ts        ← Stage 2 & 3: find decision makers + emails
│   └── brevo.ts          ← Stage 4: send personalized emails
```

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/JokkimDoras/outreach-pipeline.git
cd outreach-pipeline
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your `.env` file

```bash
cp .env.example .env
```

Fill in your API keys:

```
OCEAN_API_KEY=your_ocean_api_key
PROSPEO_API_KEY=your_prospeo_api_key
BREVO_API_KEY=your_brevo_api_key
SENDER_NAME=Your Name
SENDER_EMAIL=you@yourdomain.com
```

### 4. Run the pipeline

```bash
npm start
```

---

## Example Run

```bash
$ npm start

━━━━━━━━━━━━━━━━━━━━━━
Starting pipeline...
Enter seed domain: AnyCopany.com

Starting pipeline for: AnyCompany.com
Found 10 companies
Found 28 decision makers
Got email for random guy: guy@company.com
Got emails for 1 contacts

⚠️  About to send emails to:
  → random guy <guy@company.com> (lookalike Company)

Send 1 emails? (y/n): y
✅ Sent to Random Guy <guy@company.com>

Done! Sent: 1, Failed: 0
✅ Pipeline complete!
```

---

## API Keys — Where to get them

| Service | Link | Free Tier |
|---------|------|-----------|
| Ocean.io | ocean.io | 14-day trial |
| Prospeo | app.prospeo.io | 50 requests/day |
| Brevo | app.brevo.com | 300 emails/day |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OCEAN_API_KEY` | Ocean.io API key |
| `PROSPEO_API_KEY` | Prospeo API key |
| `BREVO_API_KEY` | Brevo API key |
| `SENDER_NAME` | Your name (shown in outreach email) |
| `SENDER_EMAIL` | Your verified sender email |

---

## Safety Checkpoint

Before any emails are sent, the pipeline shows a summary of all contacts and asks for confirmation:

```
⚠️  About to send emails to:
  → John Doe <john@company.com> (Company Name)

Send 1 emails? (y/n):
```

Type `y` to send or `n` to abort — no emails fire without your approval.

---

## Tech Stack

- **Runtime** — Node.js
- **Language** — TypeScript
- **HTTP** — Axios
- **Email** — Brevo SDK
- **CLI** — Node readline + Chalk
