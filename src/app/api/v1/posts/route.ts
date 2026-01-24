import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { analyzeMood } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, isPrivate, category, imageKey } = body;

    if (!content) {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    // 后端自动执行情绪识别
    const moodTag = await analyzeMood(content);

    const post = await prisma.post.create({
      data: {
        content,
        moodTag,
        isPrivate: isPrivate ?? false,
        category,
        imageUrl: imageKey,
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
