import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expenses = await prisma.expense.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(expenses);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, description, category, date } = await req.json();

  if (!amount || !description) {
    return NextResponse.json(
      { error: "Amount and description are required" },
      { status: 400 }
    );
  }

  let categoryRecord = null;
  if (category) {
    categoryRecord = await prisma.category.upsert({
      where: { userId_name: { userId, name: category } },
      update: {},
      create: { userId, name: category },
    });
  }

  const expense = await prisma.expense.create({
    data: {
      amount: parseFloat(amount),
      description,
      date: date ? new Date(date) : new Date(),
      userId,
      categoryId: categoryRecord?.id,
    },
    include: { category: true },
  });

  return NextResponse.json(expense);
}
