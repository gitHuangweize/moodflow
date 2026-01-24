import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, moodTag, isPrivate, category, imageKey } = body;

    if (!content) {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        content,
        moodTag,
        isPrivate: isPrivate ?? false,
        category,
        imageUrl: imageKey, // 映射 imageKey 到 imageUrl
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "发布失败" },
      { status: 500 }
    );
  }
}
