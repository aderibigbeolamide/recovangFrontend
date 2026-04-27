import api from "./api";

const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true") !== "false";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  category: string;
  date: string;
  readMinutes: number;
  cover?: string;
  author?: { name: string; role?: string; avatar?: string };
  accent?: string;
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "surulere-mother-school-fees",
    category: "Impact",
    title: "How a Surulere mother turned ₦240,000 of plastic waste into school fees",
    excerpt:
      "Folake Adeola dropped 1,184kg of PET plastic over six months at her local hub. Here's the breakdown — and what the local council learned from her route.",
    date: "Apr 24, 2026",
    readMinutes: 6,
    accent: "from-primary to-primary-700",
    cover: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=70",
    author: { name: "Recovang editorial" },
  },
  {
    id: "2",
    slug: "pet-pricing-q2-memo",
    category: "Pricing",
    title: "Why we just raised PET plastic to ₦200/kg in Lagos — and what's next",
    excerpt:
      "Recyclate demand from local factories tripled in Q1. We pass it on. The full Q2 pricing memo, including HDPE, paper and aluminium adjustments.",
    date: "Apr 22, 2026",
    readMinutes: 4,
    accent: "from-accent to-accent-600",
    cover: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "3",
    slug: "payments-on-04-mbps",
    category: "Engineering",
    title: "Building a payments engine that works on 0.4 Mbps GSM",
    excerpt:
      "Most fintech rails assume 4G. We engineered Recovang for the real Lagos network — including the offline-first sync layer that lets a Tecno Spark queue 200 drops without losing a kobo.",
    date: "Apr 18, 2026",
    readMinutes: 9,
    accent: "from-charcoal to-charcoal-700",
    cover: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "4",
    slug: "coca-cola-epr-partnership",
    category: "Partnership",
    title: "Coca-Cola Nigeria signs ₦1.4B EPR partnership with Recovang",
    excerpt:
      "The largest extended producer responsibility deal in Nigerian history. Why CCN chose us, what gets recovered, and the public ledger every drop will land in.",
    date: "Apr 15, 2026",
    readMinutes: 5,
    accent: "from-success to-primary",
    cover: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "5",
    slug: "anatomy-of-a-hub",
    category: "Operations",
    title: "Anatomy of a Recovang hub: a day in 47 photos",
    excerpt:
      "We followed Bola in Surulere from 6:30am to 7:15pm. 184 collectors, 642kg recovered, ₦88,400 paid out — and three reasons the agent role is the best job in the supply chain.",
    date: "Apr 11, 2026",
    readMinutes: 7,
    accent: "from-info to-primary",
    cover: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "6",
    slug: "lagos-state-mou",
    category: "Policy",
    title: "Why Lagos State signed an MOU with Recovang — the inside story",
    excerpt:
      "LAWMA's commissioner explains the framework, the metrics, and what 'public-private waste recovery' really means for Lagosians.",
    date: "Apr 4, 2026",
    readMinutes: 8,
    accent: "from-warning to-accent",
    cover: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&w=1200&q=70",
  },
];

const wait = <T,>(v: T, ms = 250) => new Promise<T>((r) => setTimeout(() => r(v), ms));

export async function listPosts(): Promise<BlogPost[]> {
  if (USE_MOCK) return wait(MOCK_POSTS);
  try {
    const { data } = await api.get("/blog");
    return Array.isArray(data) ? data : data.posts ?? data.data ?? [];
  } catch {
    return MOCK_POSTS;
  }
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  if (USE_MOCK) return wait(MOCK_POSTS.find((p) => p.slug === slug || p.id === slug));
  try {
    const { data } = await api.get(`/blog/${slug}`);
    return data.post ?? data;
  } catch {
    return MOCK_POSTS.find((p) => p.slug === slug || p.id === slug);
  }
}
