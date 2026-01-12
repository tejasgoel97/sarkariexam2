import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export const runtime = "nodejs"; // REQUIRED
export const dynamic = "force-dynamic"; // REQUIRED

export async function GET(request: Request): Promise<Response> {
  // 🚨 NEVER return raw data from route.ts
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limitParam = searchParams.get("limit");

    if (!category) {
      return NextResponse.json({ posts: [] });
    }

    const limit = limitParam ? Number(limitParam) : 10;

    await dbConnect();

    const posts = await Post.find({ category })
      .select("title slug category updatedAt featureImage")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Category posts API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
