# AI Expense Tracker

A Next.js app that tracks expenses, sets budgets, and uses AI to auto-categorize
spending and generate monthly insights.

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth.js (Auth.js)
- Anthropic Claude API (categorization + insights)
- Recharts (charts)

## Getting Started

```bash
npm install
cp .env.example .env   # fill in your DATABASE_URL, AUTH_SECRET, ANTHROPIC_API_KEY
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Roadmap

- [x] Project setup — Next.js + Tailwind + Prisma schema + landing page
- [ ] shadcn/ui + dashboard layout
- [ ] Auth (signup/login) with NextAuth
- [ ] Protected dashboard route
- [ ] Add expense form
- [ ] Expense list/table
- [ ] Edit/delete expense
- [ ] Categories CRUD
- [ ] Filters (date/category)
- [ ] Monthly summary + pie chart
- [ ] Budgets per category
- [ ] Budget vs actual comparison
- [ ] Over-budget alerts
- [ ] AI auto-categorization (Claude API)
- [ ] AI monthly insights
- [ ] CSV/PDF export
- [ ] Dark mode
- [ ] Mobile responsive pass
- [ ] Loading/error states
- [ ] Deploy on Vercel

## License
MIT
