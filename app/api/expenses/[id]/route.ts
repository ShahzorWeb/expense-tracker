import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.expense.deleteMany({
    where: { id: params.id, userId },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount, description, category } = await req.json();

  if (!amount || !description) {
    return NextResponse.json(
      { error: "Amount and description are required" },
      { status: 400 }
    );
  }

  // Make sure this expense actually belongs to the logged-in user
  const existing = await prisma.expense.findFirst({
    where: { id: params.id, userId },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let categoryRecord = null;
  if (category) {
    categoryRecord = await prisma.category.upsert({
      where: { userId_name: { userId, name: category } },
      update: {},
      create: { userId, name: category },
    });
  }

  const updated = await prisma.expense.update({
    where: { id: params.id },
    data: {
      amount: parseFloat(amount),
      description,
      categoryId: categoryRecord?.id ?? null,
    },
    include: { category: true },
  });

  return NextResponse.json(updated);
}
