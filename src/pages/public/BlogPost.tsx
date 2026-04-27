import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Clock, Loader2, Share2, Twitter } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { getPost, listPosts, type BlogPost as BlogPostType } from "@/services/blog.service";

export default function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog.post", slug],
    queryFn: () => getPost(slug),
    enabled: !!slug,
  });

  const { data: all } = useQuery({ queryKey: ["blog.posts"], queryFn: listPosts });
  const related = (all ?? []).filter((p) => p.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <section className="bg-cream py-32 text-center text-textgray">
        <Loader2 className="mx-auto animate-spin" size={20} />
        <p className="mt-3 text-sm">Loading story…</p>
      </section>
    );
  }

  if (isError || !post) {
    return (
      <section className="bg-cream py-24">
        <div className="container-page max-w-xl text-center">
          <h1 className="text-h2 font-extrabold">We couldn't find that story.</h1>
          <p className="mt-3 text-textgray">It may have been moved or unpublished. Try the blog index.</p>
          <Link to="/blog" className="btn-primary mt-6 inline-flex">
            <ArrowLeft size={14} /> Back to the blog
          </Link>
        </div>
      </section>
    );
  }

  const initials = (post.author?.name ?? "Recovang")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");

  return (
    <>
      <article className="bg-white">
        {/* Header strip */}
        <header className="relative overflow-hidden bg-cream pt-12 pb-10 sm:pt-20 sm:pb-14">
          <div className="container-page max-w-3xl">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-sm font-bold text-textgray hover:text-primary"
            >
              <ArrowLeft size={14} /> Back to the blog
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
              <span className="badge-mint">{post.category}</span>
              <span className="text-textgray">
                <Clock size={11} className="-mt-0.5 mr-1 inline" />
                {post.date} · {post.readMinutes} min read
              </span>
            </div>
            <h1 className="mt-4 text-h1 font-extrabold leading-[1.05] text-balance sm:text-display sm:tracking-tight">
              {post.title}
            </h1>
            <p className="mt-5 text-base text-textgray sm:text-lg text-pretty">{post.excerpt}</p>
            <div className="mt-7 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-grad-primary font-display text-sm font-extrabold text-white">
                {initials}
              </div>
              <div>
                <div className="text-sm font-bold">{post.author?.name ?? "Recovang editorial"}</div>
                <div className="text-xs text-textgray">{post.author?.role ?? "Stories team"}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {post.cover && (
          <div className="bg-cream pb-10 sm:pb-14">
            <div className="container-page max-w-5xl">
              <div className="overflow-hidden rounded-3xl shadow-card">
                <img
                  src={post.cover}
                  alt=""
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Body + share rail */}
        <div className="container-page grid max-w-5xl gap-12 py-10 sm:py-16 lg:grid-cols-12">
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-28 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-textgray">Share</div>
              <ShareLink href={twitterUrl(post)} icon={<Twitter size={14} />} label="Twitter" />
              <ShareLink href="#" icon={<Share2 size={14} />} label="Copy link" onClick={() => copyLink()} />
            </div>
          </aside>
          <div className="lg:col-span-10">
            <Prose body={post.body ?? post.excerpt} />
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-bordergray bg-cream p-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Start earning today</div>
                <div className="mt-1 text-h4 font-extrabold">Drop your first kilo this week.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to="/auth/register" className="btn-primary">Create my account <ArrowRight size={14} /></Link>
                <Link to="/find-hub" className="btn-outline">Find a hub</Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream py-16">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <Eyebrow>Keep reading</Eyebrow>
                <h2 className="mt-2 text-h2 font-extrabold">More from the field</h2>
              </div>
              <Link to="/blog" className="hidden text-sm font-bold text-primary hover:underline sm:inline">
                All stories <ArrowRight size={14} className="-mt-0.5 inline" />
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-card"
                >
                  <div className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.accent ?? "from-primary to-primary-700"}`}>
                    {p.cover && (
                      <img
                        src={p.cover}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-[1.03]"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{p.category}</div>
                    <h3 className="mt-2 text-h4 leading-snug text-balance group-hover:text-primary">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-textgray">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function twitterUrl(post: BlogPostType) {
  const text = encodeURIComponent(`${post.title} — via Recovang`);
  const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");
  return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
}

function copyLink() {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }
}

function ShareLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 rounded-full border border-bordergray bg-white px-3 py-1.5 text-xs font-bold text-charcoal/80 hover:border-primary hover:text-primary"
    >
      {icon}
      {label}
    </a>
  );
}

/** Tiny markdown renderer (h2, blockquote, lists, paragraphs, bold). Not a full md parser — enough for our editorial format. */
function Prose({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\n+/);
  return (
    <div className="prose-recovang">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="mt-12 text-h3 font-extrabold leading-tight text-charcoal first:mt-0">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="my-8 rounded-2xl border-l-4 border-primary bg-mint/40 p-5 text-lg font-medium italic leading-snug text-charcoal text-balance"
            >
              {renderInline(trimmed.replace(/^>\s?/gm, "").trim())}
            </blockquote>
          );
        }
        if (/^(-|\*) /m.test(trimmed) && trimmed.split("\n").every((l) => /^(-|\*) /.test(l))) {
          const items = trimmed.split("\n").map((l) => l.replace(/^(-|\*) /, ""));
          return (
            <ul key={i} className="my-5 list-disc space-y-2 pl-6 text-base leading-relaxed text-charcoal/85">
              {items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        }
        if (trimmed.startsWith("|")) {
          const rows = trimmed.split("\n").filter((r) => r.trim().startsWith("|") && !/^\|\s*-+/.test(r));
          if (rows.length >= 2) {
            const [head, ...body] = rows.map((r) =>
              r.split("|").slice(1, -1).map((c) => c.trim())
            );
            return (
              <div key={i} className="my-8 overflow-x-auto rounded-2xl border border-bordergray">
                <table className="w-full text-sm">
                  <thead className="bg-cream text-left">
                    <tr>
                      {head.map((h, j) => (
                        <th key={j} className="px-4 py-3 font-bold text-charcoal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {body.map((row, ri) => (
                      <tr key={ri} className="border-t border-bordergray">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 text-charcoal/80">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }
        return (
          <p key={i} className="my-5 text-base leading-relaxed text-charcoal/85 sm:text-lg">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-extrabold text-charcoal">{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}
