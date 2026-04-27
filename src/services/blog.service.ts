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

const FOLAKE_BODY = `
Folake Adeola wakes up at 5:40am. By 6:30 she's pushing a green cart down Adeniran Ogunsanya, hands gloved, eyes scanning the gutter. Most mornings she's home by nine with eighteen kilos of mixed PET — plastic bottles tossed by night-club kids, water sachets, a few HDPE cleaning containers.

Six months ago, none of this had a price. Today, every kilo lands in her Recovang wallet at ₦200 — paid the moment our agent at the Surulere hub photographs and weighs the drop.

## The numbers
- 1,184 kg of PET dropped between October and April
- ₦236,800 paid in waste recovery
- A further ₦3,200 in streak bonuses for showing up six days a week, four months running
- Three of her four kids' second-term school fees, paid out of the wallet directly to Bursar accounts at Comprehensive High School Aguda

## What she does differently
Folake doesn't just pick. She organises. She has a WhatsApp group of seventeen mothers across Aguda and Itire who sort their household plastics into the cream-coloured bags she gives them, and she walks the route every Saturday morning to collect.

We pay her commission on every kilo her network drops — which is how a single mother on a recycling cart turned a side-hustle into something the local council now calls "the most efficient waste-pickup unit in LCDA-12".

## What the local council learned
Two things, says LCDA chairman Hon. Adeoye Adeniyi:

> "Pay the people doing the work. Stop hiring agents to chase the same people. Folake's network has done more for our street-cleanliness ranking than the entire LAWMA contract for this ward — and it costs us nothing because Recovang funds her directly through the brand EPR pool."

Folake's plan for term three: rent a small lock-up on Bode Thomas where her network can drop on weekdays. We're piloting it with her. If it works, we'll roll the same model out across Surulere and Yaba in Q3.

> "I used to be embarrassed to push the cart. Now my children are proud. They sort the bottles before I leave the house."
`;

const PRICING_BODY = `
PET prices have moved. As of Monday, we're paying **₦200 per kilogram** of clean PET plastic at every hub in Lagos State — up from ₦170 in Q1 and ₦150 at the start of the year.

We don't move prices to make headlines. We move them when the recyclate market moves, and the recyclate market just took a sharp turn.

## What changed in Q1
- Indorama Eleme expanded its food-grade flake line by 38%
- A new Coca-Cola Nigeria bottling line in Sagamu requires 100% rPET (recycled PET) for its 50cl SKU
- Two Chinese pre-form converters opened buying offices in Apapa, paying spot in USD

The result: the wholesale clearing price for clean PET bales (≥98% purity, ≤2% moisture) hit ₦352/kg last week. We pass margin back to collectors with a clear formula: 60% to the collector, 25% to the agent and hub, 15% to logistics and overhead.

## The full Q2 memo
| Material | Q1 rate | Q2 rate | Change |
| --- | --- | --- | --- |
| PET (clear) | ₦170 | ₦200 | +18% |
| PET (coloured) | ₦120 | ₦140 | +17% |
| HDPE | ₦180 | ₦190 | +6% |
| Aluminium cans | ₦580 | ₦600 | +3% |
| Mixed paper | ₦55 | ₦60 | +9% |
| Cardboard | ₦70 | ₦80 | +14% |
| Glass (clear) | ₦28 | ₦30 | +7% |
| E-waste (per kg) | ₦1,150 | ₦1,200 | +4% |

Rates apply across Lagos, Ogun, Abuja, and Port Harcourt hubs effective Monday morning. We re-publish every quarter and you can read the methodology on our pricing page.
`;

const ENGINEERING_BODY = `
Most fintech rails in Africa quietly assume 4G LTE. POS terminals, KYC video calls, even "instant transfer" UIs — they all break the moment you drop below 1 Mbps.

Recovang has to work in a Surulere walk-up at 6:45am, on a Tecno Spark with a Glo SIM that's flapping between 2G and 3G, while a ₦4,800 transfer needs to land in a collector's GTBank account before they walk away from the hub. Here's how we built it.

## The four constraints
1. Drops happen in basements, alleys, and metal-roofed sheds — places where signal is awful even by Lagos standards
2. The agent's phone is the source of truth — not a server
3. A failed payment can't bounce a collector — they need certainty before they leave
4. We can't lose a kobo, even if the phone dies between weighing and paying

## What we shipped
We built a local-first transaction queue using SQLite + a write-ahead log. Every weigh-in is committed to disk, hashed, and signed locally before any network call. The signature uses the agent's hardware-backed key from the Android Keystore.

When connectivity comes back — even for 800ms — we fire a batch of pending drops, get back a server ack with the corresponding payment reference, and only then mark the drop as "settled" in the agent UI.

The collector sees a yellow "Verifying — pay in seconds" chip until the payment is confirmed. Average time-to-confirm in the field: **2.4 seconds on 4G, 11 seconds on 3G, 38 seconds on 2G EDGE.**

## Why it matters
This isn't an engineering vanity project. The 38-second 2G case is the difference between Folake getting paid before she leaves and Folake walking home wondering if she'll see the money. Trust at the hub is the entire business.

We're open-sourcing the queue layer in May. Watch this space.
`;

const COKE_BODY = `
On April 9, Coca-Cola Nigeria and Recovang signed the largest extended producer responsibility (EPR) deal in Nigerian history: ₦1.4 billion over three years, against a recovery target of 41,200 tonnes of post-consumer PET.

## What CCN gets
- Real-time, photographed, weight-verified evidence of every kilo recovered against their EPR obligation under the National Environmental Standards Regulation Agency (NESREA) framework
- A public dashboard, audited monthly by Deloitte, showing recovery progress against target
- Rights to use the Recovang "verified recovered" mark on packaging in markets where consumers care

## What collectors get
- ₦200/kg paid at the hub, instantly, for the duration of the contract — the rate is contractually pegged to the brand EPR pool, not to spot recyclate prices
- Streak bonuses funded directly by CCN: ₦500 for any week where you drop on five or more days
- A guaranteed buy-back at every Recovang hub for any branded bottle bearing the Coca-Cola, Schweppes, Eva, or Sprite mark — even if no other brand is paying that day

## What it means for the market
This is the first time in Nigerian history that an FMCG brand has committed to a per-kilo recovery price publicly, contractually, and at scale. We expect Nestlé Nigeria, Indomie, and Dangote Group to follow within the year — they've all been in conversation since Q4 2025.

The ledger goes live next Monday. Every kilo recovered against the CCN obligation will appear on the public ledger within sixty seconds of the agent verifying the drop.
`;

const HUB_BODY = `
We spent Tuesday with Bola, the agent at our Surulere hub on Adelabu Street. He arrived at 6:31am, opened the roll-up door, plugged in the rugged scale, and started the day.

Here's what 47 photographs and one twelve-hour day taught us about why the agent is the most important person in the entire supply chain.

## The shape of a day
- **6:30am – 8:00am**: peak rush. 71 collectors arrive in the first ninety minutes, mostly with overnight pickings from the strip clubs on Adeniran Ogunsanya
- **8:00am – 11:30am**: school traffic. Mothers and kids drop on the way to morning runs
- **11:30am – 2:00pm**: lull. Bola updates the hub spreadsheet, repairs the scale's USB-C cable with electrical tape, eats jollof
- **2:00pm – 5:30pm**: artisan rush. Tailors, vulcanisers and barbers drop their week's worth
- **5:30pm – 7:15pm**: the second peak. Bus conductors, Bolt drivers, anyone whose shift ends at six

## The numbers
- 184 collectors served
- 642 kg recovered (471 PET, 92 aluminium, 79 cardboard)
- ₦88,400 paid out in cash + airtime + ePins
- 0 disputes, 0 reweighs, 0 complaints to support

## Why the agent role is the best job in the supply chain
Bola earns ₦4 commission on every kilogram verified. On a 642 kg day, that's ₦2,568 — for one ten-hour shift, in a hub he runs himself, with the dignity of a small-business owner.

He also gets a flat ₦35,000 monthly base + a hub-rent allowance + a ₦12,000 phone allowance. A good agent in Lagos clears ₦180,000 a month. Two of our Lagos agents have already opened second hubs — and three of our Abuja agents have hired their own staff.

If you want to run a hub, we're opening fifty new locations in Q3. Apply on the Find a hub page or talk to our agent ops team directly.
`;

const POLICY_BODY = `
Last week, Lagos State Waste Management Authority (LAWMA) and Recovang signed a Memorandum of Understanding that quietly reshapes how the country's largest city handles post-consumer waste.

We sat down with the LAWMA Managing Director, Engr. Muyiwa Gbadegesin, to walk through what the framework actually says, what changes for Lagosians on Monday morning, and why public-private partnership in this sector is hard.

## The framework
LAWMA agrees to:
- License Recovang as an authorised secondary collector across all twenty Local Government Areas
- Provide vehicle access to dumpsites and transfer stations for our verified pickup partners
- Co-fund the construction of fifteen new "drop hubs" in underserved areas (Ikorodu, Epe, Badagry)
- Recognise Recovang weight tickets as evidence under the State EPR regulation

Recovang agrees to:
- Publish all weight, payment, and routing data for any kilo recovered under the LAWMA license to a public ledger within 24 hours
- Pay collectors at or above the State minimum recovery rate at all times
- Provide LAWMA with a real-time dashboard of city-wide recovery, broken out by ward and material
- Co-fund the training of 400 LAWMA-certified hub agents over three years

## What changes for Lagosians on Monday
Practically? Three things:
1. The LAWMA recovery sticker on a hub means it's legitimate — no more disputes with police about whether collecting is legal
2. Brand EPR money flows through Recovang into the hubs LAWMA helps build, instead of into private waste hauliers' pockets
3. Lagos gets a real-time dashboard of how much of its own waste is being recovered, by whom, where, for how much. That's never existed before.

> "Public-private partnerships fail in this sector because the public side doesn't trust the private side to actually pay. We trust Recovang because every transaction is on a public ledger, signed by the agent, photographed, weighed and timestamped. Trust is the whole game."
> — Engr. Muyiwa Gbadegesin, MD LAWMA

The framework is live. The ledger is public. We'll have Q2 numbers up by mid-July.
`;

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
    author: { name: "Recovang editorial", role: "Stories team" },
    body: FOLAKE_BODY,
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
    author: { name: "Olumide Adesanya", role: "Head of Commodities" },
    body: PRICING_BODY,
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
    author: { name: "Chinedu Okafor", role: "Staff Engineer" },
    body: ENGINEERING_BODY,
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
    author: { name: "Ngozi Eze", role: "Head of Partnerships" },
    body: COKE_BODY,
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
    author: { name: "Recovang editorial", role: "Stories team" },
    body: HUB_BODY,
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
    author: { name: "Recovang editorial", role: "Stories team" },
    body: POLICY_BODY,
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
