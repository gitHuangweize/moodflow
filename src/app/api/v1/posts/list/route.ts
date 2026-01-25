import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");

    const where: any = {
      isPrivate: false,
    };

    // 调试打印
    console.log("Fetching global post list with where:", JSON.stringify(where, null, 2));

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { error: "获取随笔列表失败" },
      { status: 500 }
    );
  }
}
