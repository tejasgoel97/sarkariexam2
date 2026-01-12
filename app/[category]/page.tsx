export const runtime = "edge"; // 1. REQUIRED for Cloudflare

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 2. Configuration: Colors and Titles
const categoryConfig: Record<
  string,
  {
    color: string;
    bg: string;
    border: string;
    icon: string;
    label: string;
    seoTitle: string;
  }
> = {
  result: {
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    icon: "🏆",
    label: "Sarkari Results",
    seoTitle: "Latest Sarkari Results 2026",
  },
  "admit-card": {
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "🎫",
    label: "Admit Cards",
    seoTitle: "Download Admit Card & Hall Tickets",
  },
  "latest-jobs": {
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "💼",
    label: "Latest Jobs",
    seoTitle: "New Government Jobs 2026 (Sarkari Naukri)",
  },
  "answer-key": {
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "🔑",
    label: "Answer Keys",
    seoTitle: "Official Answer Keys & Solutions",
  },
  syllabus: {
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: "📚",
    label: "Syllabus",
    seoTitle: "Exam Syllabus & Pattern 2026",
  },
  admission: {
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    icon: "🎓",
    label: "Admission",
    seoTitle: "College Admission Forms 2026",
  },
};

// 3. Dynamic Metadata Generator (Crucial for SEO)
export async function generateMetadata({
  params,
}: {
  // FIX: params is now a Promise
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  // FIX: Await params before using them
  const resolvedParams = await params;
  const config = categoryConfig[resolvedParams.category];

  if (!config) return { title: "Category Not Found" };

  return {
    title: `${config.seoTitle} | Sarkari Dekho`,
    description: `Check all ${config.label} updates here. We provide the fastest updates for ${config.label} for UPSC, SSC, Banking, and State Exams.`,
  };
}

// 4. Main Page Component
export default async function CategoryPage({
  params,
}: {
  // FIX: params is now a Promise
  params: Promise<{ category: string }>;
}) {
  // FIX: Await params here too
  const resolvedParams = await params;
  const category = resolvedParams.category;

  // Validation
  const config = categoryConfig[category];
  if (!config) {
    notFound();
  }

  // Fetch Data (Limit 50 for archive page)
  let posts: any[] = [];

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/category-posts?category=${category}`,
    {
      // OPTIONAL: Switch to ISR for better performance
      // next: { revalidate: 60 }
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch category posts:", category);
    // return notFound(); // Uncomment if you want strict 404s
  }

  const data = await res.json();
  posts = data.posts || [];

  // Helper: New Badge Logic (7 Days)
  const isNew = (date: Date) => {
    const diffDays = Math.ceil(
      Math.abs(new Date().getTime() - new Date(date).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-8 font-sans bg-gray-50 min-h-screen">
      {/* 1. Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
        <Link
          href="/"
          className="hover:text-blue-600 transition underline decoration-gray-300 underline-offset-4"
        >
          Home
        </Link>
        <span className="text-gray-400">/</span>
        <span className="capitalize font-bold text-gray-800">
          {config.label}
        </span>
      </nav>

      {/* 2. Header Banner */}
      <div
        className={`p-6 rounded-xl border ${config.bg} ${config.border} mb-6 flex flex-col md:flex-row items-center justify-between shadow-sm`}
      >
        <div className="text-center md:text-left">
          <h1
            className={`text-3xl md:text-4xl font-black ${config.color} flex items-center justify-center md:justify-start gap-3 uppercase tracking-tight`}
          >
            <span>{config.icon}</span> {config.label}
          </h1>
          <p className="text-gray-600 mt-2 text-sm font-medium">
            Showing latest {posts.length} updates for {config.label} in India.
          </p>
        </div>

        {/* Quick Filter */}
        <div className="mt-4 md:mt-0">
          <span
            className={`hidden md:inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white ${config.color} shadow-sm border ${config.border}`}
          >
            Live Updates
          </span>
        </div>
      </div>

      {/* 3. Join Group Strip */}
      <div className="bg-blue-900 text-white p-3 rounded-lg mb-8 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 text-sm font-bold">
          <span className="animate-pulse text-yellow-300">🔔</span>
          <span>Get {config.label} on WhatsApp</span>
        </div>
        <Link
          href="#"
          className="bg-yellow-400 text-blue-900 text-xs font-black px-4 py-2 rounded uppercase hover:bg-white transition"
        >
          Join Now
        </Link>
      </div>

      {/* 4. Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <Link
            key={post._id}
            href={`/post/${post.slug}`}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col h-full"
          >
            {/* Image Area */}
            <div className="h-44 w-full bg-gray-100 relative overflow-hidden border-b border-gray-100">
              {post.featureImage ? (
                <Image
                  src={post.featureImage}
                  alt={post.title}
                  fill
                  unoptimized
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center ${config.bg}`}
                >
                  <span className="text-5xl opacity-40 grayscale">
                    {config.icon}
                  </span>
                </div>
              )}

              {/* Badges */}
              <span
                className={`absolute top-0 left-0 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg shadow-sm uppercase ${config.color.replace(
                  "text",
                  "bg"
                )}`}
              >
                {config.label}
              </span>

              {isNew(post.updatedAt) && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow animate-pulse">
                  NEW
                </span>
              )}
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-700 transition line-clamp-3">
                {post.title}
              </h2>

              <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                {post.metaDescription ||
                  "Click to read full notification details, dates, and eligibility criteria."}
              </p>

              <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">
                  📅 {new Date(post.updatedAt).toLocaleDateString("hi-IN")}
                </span>
                <span
                  className={`font-bold ${config.color} group-hover:underline`}
                >
                  View Details &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 5. Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4 grayscale opacity-30">
            {config.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-800">No Updates Yet</h3>
          <p className="text-gray-500 mb-6">
            We are working on adding new {config.label.toLowerCase()}.
          </p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
        </div>
      )}

      {/* 6. SEO Text */}
      <div className="mt-12 text-center text-xs text-gray-400 max-w-2xl mx-auto hidden md:block">
        <p>Sarkari Dekho - {config.label} - Archives</p>
        <p className="mt-2">
          Browse all historical and active updates for {config.seoTitle}. Data
          is sourced from official government websites.
        </p>
      </div>
    </div>
  );
}
