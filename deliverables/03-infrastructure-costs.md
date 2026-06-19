# Infrastructure Cost Estimates by Scale

## Cost Breakdown by User Scale

### 100 Users (MVP / Early Stage)

| Component | Monthly Cost | Notes |
|---|---|---|
| App Server (Vercel/Lambda) | $20–50 | Serverless, pay-per-invocation |
| Database (Supabase/Neon) | $25–75 | Managed Postgres, free tier covers early |
| Redis Cache | $0–30 | Can use Upstash free tier initially |
| Object Storage (S3/R2) | $5–20 | ~10GB typical early usage |
| CDN (CloudFlare) | $0–20 | Free tier sufficient |
| Auth (Clerk/Supabase) | $0–25 | Free tier covers 100 users |
| Email (Resend/SES) | $0–10 | Low volume |
| Search (Typesense) | $0–25 | Self-hosted or Typesense Cloud |
| Monitoring (Sentry/BetterStack) | $0–30 | Free tiers available |
| Domain + SSL | $15 | Annual, amortized |
| **Total** | **$65–$300/mo** | |
| **Cost per user** | **$0.65–$3.00** | |

### 1,000 Users (Growth Stage)

| Component | Monthly Cost | Notes |
|---|---|---|
| App Server (Vercel Pro/ECS) | $100–400 | Need Pro tier or small container cluster |
| Database (Supabase Pro/RDS) | $75–300 | Pro tier or small RDS instance |
| Redis Cache (Upstash/ElastiCache) | $30–100 | Need reliable caching |
| Object Storage | $20–80 | ~50-200GB |
| CDN | $20–50 | Moderate bandwidth |
| Auth | $25–100 | Paid tier needed |
| Email + Push | $20–60 | ~10K emails/mo |
| Search | $25–100 | Growing index |
| Monitoring | $30–80 | Paid tier needed |
| **Total** | **$350–$1,300/mo** | |
| **Cost per user** | **$0.35–$1.30** | |

### 10,000 Users (Scale Stage)

| Component | Monthly Cost | Notes |
|---|---|---|
| App Server (ECS/Kubernetes) | $800–2,500 | Multi-container, auto-scaling |
| Database (RDS Multi-AZ) | $500–1,500 | Read replicas needed |
| Redis Cluster | $100–400 | Dedicated cluster |
| Object Storage | $100–500 | ~1-5TB |
| CDN + Bandwidth | $100–400 | Significant traffic |
| Auth | $200–500 | Enterprise auth features |
| Email + Push | $100–300 | ~100K emails/mo |
| Search | $200–500 | Large index, fast queries |
| Monitoring + Security | $200–500 | APM, error tracking, WAF |
| **Total** | **$2,300–$7,000/mo** | |
| **Cost per user** | **$0.23–$0.70** | |

### 100,000 Users (Enterprise Scale)

| Component | Monthly Cost | Notes |
|---|---|---|
| App Server (Multi-region K8s) | $5,000–15,000 | Global presence, HA |
| Database (Aurora Global) | $3,000–10,000 | Multi-region, auto-scaling |
| Redis Cluster | $500–2,000 | Multi-region cache |
| Object Storage | $500–3,000 | ~10-50TB |
| CDN + Bandwidth | $500–3,000 | Global CDN, high bandwidth |
| Auth | $1,000–3,000 | Enterprise SSO, SCIM |
| Email + Push | $500–1,500 | ~1M emails/mo |
| Search | $1,000–3,000 | Distributed search cluster |
| Monitoring + Security | $1,000–3,000 | Full observability stack |
| Compliance (SOC2, etc.) | $500–2,000 | Audit tools, pen testing |
| **Total** | **$13,500–$45,000/mo** | |
| **Cost per user** | **$0.14–$0.45** | |

## Cost Scaling Summary

| Scale | Monthly Infra | Cost/User | Gross Margin (at $10 base) |
|---|---|---|---|
| 100 users | ~$150 | ~$1.50 | 85% |
| 1,000 users | ~$800 | ~$0.80 | 92% |
| 10,000 users | ~$4,500 | ~$0.45 | 96% |
| 100,000 users | ~$25,000 | ~$0.25 | 98% |

*Note: Gross margin assumes $10/workspace base fee with average 2-3 users per workspace. Excludes usage-based revenue which improves margins further.*

## Key Insight: Economies of Scale
Infrastructure costs grow **sub-linearly** with users. A 10x increase in users typically results in only 3-5x increase in costs. This is the fundamental economics that makes usage-based pricing viable — the fixed cost per user drops dramatically at scale, leaving room for lower pricing.

## Highest Variable Costs (Must Be Metered)
1. **AI/LLM API calls**: $0.01–$0.15 per call — by far the highest per-action cost
2. **File storage**: $0.023/GB/month — scales linearly, no economies
3. **Export/report generation**: $0.01–$0.05 per heavy report
4. **Automation execution**: $0.001–$0.01 per run — compute bound
5. **Third-party API syncs**: $0.001 per webhook — external service costs
