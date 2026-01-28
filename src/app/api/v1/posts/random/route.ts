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

    const response = NextResponse.json(randomPost);
    
    // 设置缓存控制：s-maxage=1 (边缘缓存1秒), stale-while-revalidate=9 (1-10秒内后台异步刷新)
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=1, stale-while-revalidate=9'
    );

    return response;
  } catch (error) {
    console.error("Failed to fetch random post:", error);
    return NextResponse.json(
      { error: "获取随机随笔失败" },
      { status: 500 }
    );
  }
}
