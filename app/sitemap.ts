// app/sitemap.ts
import { MetadataRoute } from "next";
export const runtime = "edge";
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static routes
  const staticRoutes = [
    "",
    "/result",
    "/admit-card",
    "/latest-jobs",
    "/answer-key",
    "/syllabus",
    "/admission",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch dynamic routes from Lambda (NOT MongoDB)
  const res = await fetch(`${process.env.API_BASE_URL}/api/sitemap-posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return staticRoutes;
  }

  const { posts } = await res.json();

  const dynamicRoutes = posts.map((post: any) => ({
    url: `${baseUrl}/post/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
