import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 获取总记录数
    const count = await prisma.post.count({
      where: { isPrivate: false },
    });

    if (count === 0) {
      return NextResponse.json(null);
    }

    // 随机跳过若干条记录
    const skip = Math.floor(Math.random() * count);
    const randomPost = await prisma.post.findFirst({
      where: { isPrivate: false },
      skip: skip,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(randomPost);
  } catch (error) {
    console.error("Failed to fetch random post:", error);
    return NextResponse.json(
      { error: "获取随机随笔失败" },
      { status: 500 }
    );
  }
}
