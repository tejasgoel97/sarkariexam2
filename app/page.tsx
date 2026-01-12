import Link from "next/link";
import Image from "next/image";
export const runtime = "edge";

// 2. Data Fetcher
async function getCategoryPosts(category: string, limit = 10) {
  const params = new URLSearchParams({
    category,
    limit: String(limit),
  });

  const res = await fetch(
    `${process.env.API_BASE_URL}/api/category-posts/home?${params.toString()}`,
    { cache: "no-store" } // we’ll handle caching via Cloudflare
  );

  if (!res.ok) {
    return [];
  }

  const { posts } = await res.json();
  return posts ?? [];
}

// --- COMPONENTS ---

// A. The "Sarkari Box" Column (Text Only - High Density)
const SarkariColumn = ({
  title,
  posts,
  link,
}: {
  title: string;
  posts: any[];
  link: string;
}) => (
  <div className="border-2 border-blue-900 rounded-lg overflow-hidden flex flex-col h-full bg-white shadow-sm">
    <div className="bg-blue-900 text-white font-bold text-center py-2 text-lg uppercase  tracking-wide">
      {title}
    </div>
    <div className="flex-grow p-0">
      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li key={post._id} className="group hover:bg-blue-50 transition">
            <Link
              href={`/post/${post.slug}`}
              className="block px-3 py-3 text-sm font-semibold text-blue-700 leading-snug"
            >
              <span className="text-red-600 mr-2 text-xs">●</span>
              <span className="group-hover:underline decoration-blue-700 underline-offset-2">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
    <div className="p-2 bg-gray-50 border-t border-gray-200">
      <Link
        href={link}
        className="block w-full text-center bg-white border border-gray-300 text-gray-700 font-bold py-1.5 rounded text-xs uppercase hover:bg-gray-100 transition shadow-sm"
      >
        View More {title}
      </Link>
    </div>
  </div>
);

// B. Visual News Card (With Images)
const VisualCard = ({ post }: { post: any }) => (
  <Link
    href={`/post/${post.slug}`}
    className="group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition flex flex-col h-full"
  >
    <div className="relative h-40 w-full bg-gray-100">
      {post.featureImage ? (
        <Image
          src={post.featureImage}
          alt={post.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">
          <span className="text-4xl">📰</span>
        </div>
      )}
      <span className="absolute bottom-0 left-0 bg-blue-900 text-white text-[10px] px-2 py-1 font-bold uppercase">
        {post.category}
      </span>
    </div>
    <div className="p-3">
      <h3 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-red-600 line-clamp-2">
        {post.title}
      </h3>
      <span className="text-[10px] text-gray-500 mt-2 block">
        {new Date(post.updatedAt).toLocaleDateString("en-IN")}
      </span>
    </div>
  </Link>
);

// C. Quick Links Grid
const QuickLinksHero = ({ jobs }: { jobs: any[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
    {jobs.slice(0, 4).map((job, index) => {
      const colors = [
        "bg-red-600 hover:bg-red-700",
        "bg-blue-600 hover:bg-blue-700",
        "bg-green-600 hover:bg-green-700",
        "bg-purple-600 hover:bg-purple-700",
      ];
      return (
        <Link
          key={job._id}
          href={`/post/${job.slug}`}
          className={`${colors[index]} text-white text-center p-2 rounded shadow-md font-bold text-xs md:text-sm flex items-center justify-center min-h-[60px] leading-tight transition hover:-translate-y-1`}
        >
          {job.title}
        </Link>
      );
    })}
    <Link
      href="/result"
      className="bg-gray-800 text-white text-center p-3 rounded font-bold text-sm flex items-center justify-center hover:bg-black"
    >
      Sarkari Result
    </Link>
    <Link
      href="/admit-card"
      className="bg-gray-800 text-white text-center p-3 rounded font-bold text-sm flex items-center justify-center hover:bg-black"
    >
      Admit Card
    </Link>
    <Link
      href="/latest-jobs"
      className="bg-gray-800 text-white text-center p-3 rounded font-bold text-sm flex items-center justify-center hover:bg-black"
    >
      Latest Jobs
    </Link>
    <Link
      href="/answer-key"
      className="bg-gray-800 text-white text-center p-3 rounded font-bold text-sm flex items-center justify-center hover:bg-black"
    >
      Answer Key
    </Link>
  </div>
);

// D. THE SEO MAGNET BLOCK (Content for Google Bots)
const SeoContentBlock = () => (
  <div className="mt-16 bg-white border-t-4 border-blue-900 p-6 md:p-10 text-gray-700">
    <h1 className="text-2xl md:text-3xl font-black text-blue-900 mb-6 border-b pb-4">
      Sarkari Result 2026: No. 1 Portal for Sarkari Naukri, Admit Card & Results
    </h1>

    <div className="prose max-w-none text-sm md:text-base leading-relaxed space-y-6">
      <p>
        <strong>Welcome to Sarkari Dekho (Official)</strong> — India’s most
        trusted education portal for
        <strong> Sarkari Result</strong>, <strong>Sarkari Naukri 2026</strong>,
        and Government Job updates. Whether you are a 10th pass student or a
        Graduate, we provide the fastest updates on
        <em>
          UPSC, SSC, Railway (RRB), Banking (IBPS/SBI), Army, Navy, and State
          Police exams
        </em>
        .
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <div>
          <h3 className="text-lg font-bold text-red-600 mb-3">
            🔥 Trending Exams in 2026
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <strong>SSC CGL & CHSL 2026:</strong> Check notification, exam
              date, and admit card status.
            </li>
            <li>
              <strong>Railway RRB NTPC & Group D:</strong> Upcoming vacancy news
              and application forms.
            </li>
            <li>
              <strong>UP Police & Bihar Police:</strong> Constable and SI
              recruitment latest updates.
            </li>
            <li>
              <strong>Teaching Jobs:</strong> CTET, UPTET, Super TET, and BPSC
              Teacher Phase 4 news.
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-red-600 mb-3">
            📋 What We Provide?
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>
              <strong>Sarkari Result:</strong> Fast and direct links to download
              results.
            </li>
            <li>
              <strong>Admit Card:</strong> Hall tickets for all major
              competitive exams.
            </li>
            <li>
              <strong>Latest Jobs:</strong> Daily alerts for 10th, 12th, and
              Graduate pass jobs.
            </li>
            <li>
              <strong>Answer Keys:</strong> Download official answer keys and
              raise objections.
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-xl font-bold text-blue-900 mt-6">
        How to Check Sarkari Result 2026?
      </h2>
      <p>
        Checking your result is easy on Sarkari Dekho. Simply visit our{" "}
        <strong>"Result"</strong> section, click on your exam name (e.g.,{" "}
        <em>Bihar Board 10th Result</em> or <em>SSC GD Result</em>), and use the
        direct official link provided. We also provide PDF lists (Merit Lists)
        for exams where individual scorecards are not released immediately.
      </p>

      <h2 className="text-xl font-bold text-blue-900 mt-6">
        Upcoming Government Jobs in January 2026
      </h2>
      <p>
        The year 2026 brings massive opportunities. Major recruitments expected
        this month include
        <strong> Indian Post GDS</strong>, <strong>Railway ALP</strong>, and{" "}
        <strong>Bank PO/Clerk</strong>. Keep visiting this page daily for the
        latest <em>Rozgar Samachar</em> and Employment News.
      </p>

      <div className="bg-gray-50 p-4 rounded border border-gray-200 mt-6">
        <p className="font-bold text-center text-gray-500 text-xs">
          Disclaimer: Sarkari Dekho is an information portal and is not
          affiliated with the central or any state government. Please verify
          details from official websites.
        </p>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default async function Home() {
  const [results, jobs, admitCards, answerKeys, syllabus, admission] =
    await Promise.all([
      getCategoryPosts("result", 15), // Increased limit for text columns
      getCategoryPosts("latest-jobs", 15),
      getCategoryPosts("admit-card", 15),
      getCategoryPosts("answer-key", 5),
      getCategoryPosts("syllabus", 5),
      getCategoryPosts("admission", 5),
    ]);

  // Combined posts for "Visual Section" (Just grab top 4 from jobs & results)
  const visualPosts = [...jobs.slice(0, 4), ...results.slice(0, 4)];

  const marqueeText = [
    jobs[0] ? `New: ${jobs[0].title}` : "",
    results[0] ? `Result: ${results[0].title}` : "",
    admitCards[0] ? `Admit Card: ${admitCards[0].title}` : "",
  ]
    .filter(Boolean)
    .join("  ++++  ");

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 font-sans bg-gray-50 min-h-screen">
      {/* 1. Marquee */}
      <div className="bg-black text-white p-2 mb-4 rounded flex items-center overflow-hidden border-b-4 border-red-600">
        <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shrink-0 mr-3 animate-pulse">
          UPDATE
        </span>
        <div className="whitespace-nowrap overflow-hidden w-full">
          <div className="animate-marquee inline-block text-sm font-bold text-yellow-300">
            {marqueeText}
          </div>
        </div>
      </div>

      {/* 2. Quick Links */}
      <h2 className="text-center text-xl md:text-2xl font-black text-blue-900 mb-4 uppercase underline decoration-red-600 underline-offset-4">
        Sarkari Dekho: India's No. 1 Job Portal
      </h2>
      <QuickLinksHero jobs={jobs} />

      {/* 3. CORE TEXT COLUMNS (The Traffic Driver) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <SarkariColumn title="Result" posts={results} link="/result" />
        <SarkariColumn
          title="Admit Card"
          posts={admitCards}
          link="/admit-card"
        />
        <SarkariColumn title="Latest Jobs" posts={jobs} link="/latest-jobs" />
      </div>

      {/* 4. VISUAL NEWS SECTION (New Feature) */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4 border-b-4 border-purple-600 pb-2">
          <h2 className="text-xl font-bold text-gray-800 uppercase">
            Top Visual Updates
          </h2>
          <Link
            href="/latest-jobs"
            className="text-sm font-bold text-purple-700 hover:underline"
          >
            View All Gallery
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visualPosts.map((post) => (
            <VisualCard key={post._id.toString()} post={post} />
          ))}
        </div>
      </div>

      {/* 5. UTILITY COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="font-bold border-b-2 border-gray-800 pb-2 mb-2 uppercase text-sm">
            Answer Key
          </h3>
          <ul className="space-y-2">
            {answerKeys.map((p: any) => (
              <li key={p._id.toString()}>
                <Link
                  href={`/post/${p.slug}`}
                  className="text-sm text-blue-700 hover:text-red-600 block truncate"
                >
                  » {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="font-bold border-b-2 border-gray-800 pb-2 mb-2 uppercase text-sm">
            Syllabus
          </h3>
          <ul className="space-y-2">
            {syllabus.map((p: any) => (
              <li key={p._id.toString()}>
                <Link
                  href={`/post/${p.slug}`}
                  className="text-sm text-blue-700 hover:text-red-600 block truncate"
                >
                  » {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-gray-300 rounded p-4">
          <h3 className="font-bold border-b-2 border-gray-800 pb-2 mb-2 uppercase text-sm">
            Admission
          </h3>
          <ul className="space-y-2">
            {admission.map((p: any) => (
              <li key={p._id.toString()}>
                <Link
                  href={`/post/${p.slug}`}
                  className="text-sm text-blue-700 hover:text-red-600 block truncate"
                >
                  » {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 6. SEO CONTENT BLOCK */}
      <SeoContentBlock />
    </div>
  );
}
