import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// export const runtime = "nodejs"; // 🚨 REQUIRED
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return NextResponse.json({ posts: [] });
  }
  try {
    const { searchParams } = new URL(request.url);

    const currentPostId = searchParams.get("currentPostId");
    const category = searchParams.get("category");
    const tagsParam = searchParams.get("tags"); // comma-separated

    if (!currentPostId || !category) {
      return NextResponse.json({ posts: [] });
    }

    const tags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];

    await dbConnect();

    const posts = await Post.find({
      _id: { $ne: currentPostId },
      $or: [{ category }, ...(tags.length ? [{ tags: { $in: tags } }] : [])],
    })
      .select("title slug featureImage category updatedAt")
      .sort({ updatedAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Related posts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
