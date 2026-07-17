import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const overall = await prisma.budget.findFirst({
    where: { userId, categoryId: null, month, year },
  });

  const categoryBudgets = await prisma.budget.findMany({
    where: { userId, categoryId: { not: null }, month, year },
    include: { category: true },
  });

  return NextResponse.json({ overall, categoryBudgets });
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, category } = await req.json();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let categoryId: string | null = null;
  if (category) {
    const categoryRecord = await prisma.category.upsert({
      where: { userId_name: { userId, name: category } },
      update: {},
      create: { userId, name: category },
    });
    categoryId = categoryRecord.id;
  }

  const existing = await prisma.budget.findFirst({
    where: { userId, categoryId, month, year },
  });

  let budget;
  if (existing) {
    budget = await prisma.budget.update({
      where: { id: existing.id },
      data: { amount: parseFloat(amount) },
    });
  } else {
    budget = await prisma.budget.create({
      data: { amount: parseFloat(amount), month, year, userId, categoryId },
    });
  }

  return NextResponse.json(budget);
}
