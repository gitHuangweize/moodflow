import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    console.log(`Toggling like for post: ${postId}`);

    // 这里由于还没做 Auth，暂时模拟一个匿名点赞逻辑
    // 在实际项目中，通常会记录哪个用户点赞了哪篇文章
    // 这里我们先简单地创建一个 Like 记录
    const like = await prisma.like.create({
      data: {
        postId: postId,
        // userId 已经设为可选，这里暂时不传
      },
    });

    // 获取更新后的点赞数
    const count = await prisma.like.count({
      where: { postId: postId },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Failed to like post:", error);
    return NextResponse.json(
      { error: "点赞失败" },
      { status: 500 }
    );
  }
}
