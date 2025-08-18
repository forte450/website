import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prisma";

export async function GET() {
  const posts = await prismaClient.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, content } = body ?? {};

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const post = await prismaClient.post.create({
    data: { title: title.trim(), content: typeof content === "string" ? content : null },
  });
  return NextResponse.json(post, { status: 201 });
}

