# Suggested Technology Stack

## Stack Philosophy
- **Speed**: Ship fast with AI-assisted development
- **Cost**: Minimize infra spend at early stage
- **Scale**: Architecture that grows without rewrites
- **Solo-friendly**: Minimal ops overhead, managed services preferred

---

## Recommended Stack

### Frontend
| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15+ (App Router)** | RSC for performance, best ecosystem, Vercel deployment |
| UI Library | **React 19** | Industry standard, massive component ecosystem |
| Styling | **Tailwind CSS 4** | Fast development, consistent design, AI-friendly |
| Components | **Shadcn/UI** | Beautiful, accessible, customizable components |
| State Management | **Zustand** | Lightweight, minimal boilerplate vs Redux |
| Forms | **React Hook Form + Zod** | Type-safe validation |
| DnD (Kanban) | **dnd-kit** | Modern, accessible drag-and-drop |
| Charts/Reports | **Recharts** or **Tremor** | Simple, composable chart components |
| Real-time | **Supabase Realtime** | Built-in WebSocket subscriptions |

### Backend
| Layer | Choice | Why |
|---|---|---|
| Runtime | **Node.js (via Next.js API routes / Server Actions)** | Unified codebase, no separate backend |
| API Layer | **tRPC** or **Next.js Server Actions** | End-to-end type safety |
| ORM | **Drizzle ORM** | Type-safe, fast, lightweight, SQL-like syntax |
| Validation | **Zod** | Shared schema between frontend and backend |
| Background Jobs | **Trigger.dev** or **Inngest** | Serverless background tasks, scheduled jobs |
| File Processing | **Sharp** (images) + **S3 SDK** | Image optimization, file handling |

### Database & Storage
| Layer | Choice | Why |
|---|---|---|
| Primary DB | **PostgreSQL (via Supabase)** | Reliable, feature-rich, managed, free tier |
| Caching | **Upstash Redis** | Serverless Redis, pay-per-request |
| File Storage | **Cloudflare R2** or **AWS S3** | R2 has no egress fees — huge cost saver |
| Search | **Typesense** or **Meilisearch** | Fast, typo-tolerant, cheaper than Algolia |

### Authentication
| Layer | Choice | Why |
|---|---|---|
| Auth | **Supabase Auth** or **Clerk** | Built-in OAuth, email, magic links |
| Permissions | **Custom RBAC** | Simple role system: Admin, Member, Guest |

### Billing & Metering
| Layer | Choice | Why |
|---|---|---|
| Payments | **Stripe** | Industry standard, usage billing support |
| Metering | **Stripe Meters** or **Lago (open-source)** | Event-based usage tracking |
| Usage Tracking | **Custom event pipeline** | Emit events → aggregate → bill |

### Infrastructure & Deployment
| Layer | Choice | Why |
|---|---|---|
| Hosting | **Vercel** | Zero-config Next.js deployment, edge functions |
| CDN | **Vercel Edge** + **Cloudflare** | Global CDN built-in |
| DNS | **Cloudflare** | Free, fast, DDoS protection |
| Email | **Resend** | Developer-friendly, React email templates |
| Push Notifications | **Web Push API** | No cost, browser-native |
| Monitoring | **Sentry** (errors) + **BetterStack** (uptime) | Free tiers available |
| Analytics | **PostHog** or **Plausible** | Privacy-friendly, self-hostable |
| CI/CD | **GitHub Actions** | Free for public repos, cheap for private |

### AI (Post-MVP)
| Layer | Choice | Why |
|---|---|---|
| LLM API | **Anthropic Claude API** | Best quality for task-related AI |
| Fallback LLM | **OpenAI GPT-4o-mini** | Cheaper for simple tasks |
| Embeddings | **Voyage AI** or **OpenAI** | For semantic search |
| Self-hosted | **Ollama + Llama 3** | Reduce API costs for basic AI tasks |

---

## Architecture Diagram (Simplified)

```
┌─────────────────────────────────────────────┐
│                 USERS                        │
│         (Browser / Mobile Web)               │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│              VERCEL EDGE                     │
│      (CDN + Edge Functions + SSR)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           NEXT.JS APP                        │
│  ┌─────────────┐  ┌──────────────────────┐  │
│  │ Server       │  │ Client Components    │  │
│  │ Components   │  │ (Interactive UI)     │  │
│  │ + Actions    │  │                      │  │
│  └──────┬──────┘  └──────────────────────┘  │
│         │                                    │
│  ┌──────▼──────┐  ┌──────────────────────┐  │
│  │ tRPC /      │  │ Stripe Billing       │  │
│  │ API Routes  │  │ + Usage Metering     │  │
│  └──────┬──────┘  └──────────────────────┘  │
└─────────┼───────────────────────────────────┘
          │
    ┌─────▼─────────────────────────────────┐
    │         DATA LAYER                     │
    │  ┌──────────┐  ┌─────────┐            │
    │  │ Supabase │  │ Upstash │            │
    │  │ Postgres │  │ Redis   │            │
    │  └──────────┘  └─────────┘            │
    │  ┌──────────┐  ┌─────────┐            │
    │  │ R2 / S3  │  │ Typesense│           │
    │  │ (Files)  │  │ (Search) │           │
    │  └──────────┘  └─────────┘            │
    └───────────────────────────────────────┘
```

---

## Monthly Cost at Each Stage

| Stage | Infrastructure | Tools/Services | Total |
|---|---|---|---|
| **Development** | $0 (free tiers) | $85 (Claude + Cursor + domain) | **$85/mo** |
| **MVP (100 users)** | $50-100 | $85 | **$135-185/mo** |
| **Growth (1K users)** | $300-600 | $150 | **$450-750/mo** |
| **Scale (10K users)** | $2,000-5,000 | $300 | **$2,300-5,300/mo** |
| **Enterprise (100K)** | $15,000-40,000 | $500 | **$15,500-40,500/mo** |

---

## Why NOT These Alternatives

| Alternative | Rejected Because |
|---|---|
| Django/Python backend | Separate backend = more complexity for solo dev |
| MongoDB | Relational data (tasks, projects, users) fits SQL better |
| Firebase | Vendor lock-in, expensive at scale, limited querying |
| AWS Amplify | Overly complex for solo dev, slow iteration |
| Angular/Vue | React has the best AI-assisted dev tooling (Cursor, v0) |
| Prisma ORM | Slower queries than Drizzle, heavier runtime |
| Self-hosted everything | Ops overhead kills solo founders — use managed services |
