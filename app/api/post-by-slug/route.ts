import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export const runtime = "nodejs"; // REQUIRED
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return NextResponse.json({ posts: [] });
  }
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ posts: [] });
    }

    await dbConnect();

    const post = await Post.findOne({ slug }).lean();

    if (!post) {
      return NextResponse.json({ post: null }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Post API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
