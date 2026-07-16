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
  const budget = await prisma.budget.findFirst({
    where: {
      userId,
      categoryId: null,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
  });

  return NextResponse.json(budget);
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();
  const now = new Date();

  const existing = await prisma.budget.findFirst({
    where: {
      userId,
      categoryId: null,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
  });

  let budget;
  if (existing) {
    budget = await prisma.budget.update({
      where: { id: existing.id },
      data: { amount: parseFloat(amount) },
    });
  } else {
    budget = await prisma.budget.create({
      data: {
        amount: parseFloat(amount),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        userId,
      },
    });
  }

  return NextResponse.json(budget);
}
