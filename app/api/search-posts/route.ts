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
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ posts: [] });
    }

    await dbConnect();

    const posts = await Post.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .select("title slug category updatedAt featureImage metaDescription")
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
