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

  const header = "Date,Description,Category,Amount\n";
  const rows = expenses
    .map((e) => {
      const date = new Date(e.date).toLocaleDateString();
      const desc = `"${e.description.replace(/"/g, '""')}"`;
      const cat = e.category?.name || "Uncategorized";
      return `${date},${desc},${cat},${e.amount}`;
    })
    .join("\n");

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="expenses.csv"`,
    },
  });
}
