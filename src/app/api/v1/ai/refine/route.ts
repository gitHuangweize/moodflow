import { NextResponse } from "next/server";
import { refineText } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "内容不能为空" },
        { status: 400 }
      );
    }

    const refinedContent = await refineText(content);

    return NextResponse.json({ refinedContent });
  } catch (error) {
    console.error("AI refinement failed:", error);
    return NextResponse.json(
      { error: "润色失败" },
      { status: 500 }
    );
  }
}
