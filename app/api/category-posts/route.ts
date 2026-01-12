// app/api/category-posts/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

export const runtime = "nodejs"; // REQUIRED
export const dynamic = "force-dynamic"; // <--- Add this line

export async function GET(request: Request) {
  console.log("Category Posts API called /////////////////////////////////");
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return NextResponse.json({ posts: [] });
  }
  console.log("Request URL:", request.url);
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ posts: [] });
    }

    await dbConnect();

    const posts = await Post.find({ category })
      .select("title slug featureImage metaDescription updatedAt category")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json({ posts: [] });
  }
}
