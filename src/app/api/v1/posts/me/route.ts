import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "请先登录" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId
      },
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
