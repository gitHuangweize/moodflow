import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { analyzeMood } from "@/lib/ai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Current Session:", JSON.stringify(session, null, 2));

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "请先登录再投递星光" },
        { status: 401 }
      );
    }

    // 预留邮箱验证拦截逻辑
    if (!(session.user as any).emailVerified) {
      // 暂时仅打日志，后续可改为返回 403 错误
      console.log(`User ${(session.user as any).id} attempted to post without email verification.`);
      /*
      return NextResponse.json(
        { error: "请先验证邮箱后再投递星光" },
        { status: 403 }
      );
      */
    }

    const body = await request.json();
    const { content, isPrivate, category, imageKey, moodTag: userMoodTag } = body;

    if (!content) {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    // 如果用户没有选择情绪标签，则后端自动执行情绪识别
    const moodTag = userMoodTag || await analyzeMood(content);

    const post = await prisma.post.create({
      data: {
        content,
        moodTag,
        isPrivate: isPrivate ?? false,
        category,
        imageUrl: imageKey,
        authorId: (session.user as any).id,
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
