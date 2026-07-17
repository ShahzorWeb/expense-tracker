import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { description } = await req.json();
  if (!description) {
    return NextResponse.json({ category: "" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY as string,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 20,
        messages: [
          {
            role: "user",
            content: `Given this expense description: "${description}", reply with ONLY one short category word (e.g. Food, Transport, Shopping, Bills, Entertainment, Health, Education, Travel, Groceries, Other). No explanation, just the single word.`,
          },
        ],
      }),
    });

    const data = await res.json();
    const category = data.content?.[0]?.text?.trim() || "Other";
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ category: "Other" });
  }
}
