import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 实际项目中这里应该从 Session 中获取用户 ID
    // 目前为了演示，获取所有心得，假设它们都属于当前用户
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch my posts:", error);
    return NextResponse.json(
      { error: "获取心得列表失败" },
      { status: 500 }
    );
  }
}
