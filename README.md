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

## Roadmap (Day-by-Day Build Log)

- [x] Day 1: Project setup — Next.js + Tailwind + Prisma schema + landing page
- [ ] Day 2: shadcn/ui + dashboard layout
- [ ] Day 3: Auth (signup/login) with NextAuth
- [ ] Day 4: Protected dashboard route
- [ ] Day 5: Add expense form
- [ ] Day 6: Expense list/table
- [ ] Day 7: Edit/delete expense
- [ ] Day 8: Categories CRUD
- [ ] Day 9: Filters (date/category)
- [ ] Day 10: Monthly summary + pie chart
- [ ] Day 11: Budgets per category
- [ ] Day 12: Budget vs actual comparison
- [ ] Day 13: Over-budget alerts
- [ ] Day 14: AI auto-categorization (Claude API)
- [ ] Day 15: AI monthly insights
- [ ] Day 16: CSV/PDF export
- [ ] Day 17: Dark mode
- [ ] Day 18: Mobile responsive pass
- [ ] Day 19: Loading/error states
- [ ] Day 20: Deploy on Vercel

## License
MIT
