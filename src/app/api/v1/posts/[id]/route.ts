import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 实际项目中这里应该验证该帖子是否属于当前登录用户
    console.log(`Attempting to delete post with ID: ${id}`);
    
    const deletedPost = await prisma.post.delete({
      where: { id },
    });

    console.log("Delete successful:", deletedPost);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DETAILED DELETE ERROR:", error);
    return NextResponse.json(
      { error: "删除心得失败" },
      { status: 500 }
    );
  }
}
