import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { Blob, GridOverlay } from "@/components/illustrations";
import { listPosts, type BlogPost } from "@/services/blog.service";

export default function Blog() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog.posts"],
    queryFn: listPosts,
  });

  const posts = data ?? [];
  const hero = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <section className="relative overflow-hidden bg-cream pt-16 pb-10 sm:pt-24 sm:pb-12">
        <div className="absolute inset-0 bg-grad-hero" />
        <Blob className="right-[-15%] top-[-15%] h-[450px] w-[450px]" color="from-accent/30 to-accent/0" />
        <GridOverlay />
        <div className="container-page relative max-w-3xl">
          <Eyebrow>Stories from the field</Eyebrow>
          <h1 className="mt-5 text-h1 font-extrabold leading-[1] tracking-tight text-balance sm:text-display sm:tracking-tighter">
            How recycling actually works across Africa.
          </h1>
          <p className="mt-5 text-base text-textgray sm:text-lg">
            Operator notes, pricing memos, collector spotlights, and the occasional engineering deep-dive. Written by the people building Recovang.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-page">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-20 text-textgray">
              <Loader2 size={18} className="animate-spin" /> Loading stories…
            </div>
          )}

          {isError && !posts.length && (
            <div className="rounded-2xl border border-error/20 bg-error-50 p-6 text-center text-sm text-error">
              We couldn't load the blog right now. Please refresh in a moment.
            </div>
          )}

          {hero && <HeroCard post={hero} />}

          {rest.length > 0 && (
            <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function HeroCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog#${post.slug}`}
      className="card group block overflow-hidden lg:grid lg:grid-cols-12"
    >
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${post.accent ?? "from-primary to-primary-700"} lg:col-span-7 lg:aspect-auto`}>
        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/40 via-transparent to-transparent" />
        <div className="absolute bottom-5 left-5">
          <span className="badge-charcoal">{post.category}</span>
        </div>
      </div>
      <div className="p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <div className="flex items-center gap-3 text-xs text-textgray">
          <Clock size={12} /> {post.date} · {post.readMinutes} min read
        </div>
        <h2 className="mt-3 text-h3 leading-tight text-balance group-hover:text-primary sm:text-h2">
          {post.title}
        </h2>
        <p className="mt-3 line-clamp-3 text-textgray text-pretty sm:mt-4 sm:line-clamp-none">
          {post.excerpt}
        </p>
        <span className="mt-5 inline-flex items-center gap-1 font-bold text-primary sm:mt-6">
          Read story <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog#${post.slug}`}
      className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${post.accent ?? "from-primary to-primary-700"}`}>
        {post.cover && (
          <img
            src={post.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/30 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="badge bg-white/95 text-charcoal">{post.category}</span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 text-xs text-textgray">
          <Clock size={11} /> {post.date} · {post.readMinutes} min read
        </div>
        <h3 className="mt-2 text-h4 leading-snug text-balance group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm text-textgray">{post.excerpt}</p>
      </div>
    </Link>
  );
}
