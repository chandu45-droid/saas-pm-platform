# Usage-Based Pricing Models — Research

## Success Stories
- **Snowflake**: Pure consumption model, strong net dollar retention
- **Twilio**: Pay-per-API-call, one of most recognized consumption models
- **AWS**: Usage-based across all services, fueled massive growth
- **Datadog**: Usage-based monitoring pricing
- **Stripe**: Per-transaction pricing (2.9% + $0.30)
- 37% of Fortune 5000 SaaS companies utilize usage-based pricing (Vista Point Advisors, 2021)
- 7 of 9 best-performing IPOs had usage-based models

## What Genuinely Costs Money (High marginal cost)
| Action | Why It Costs | Cost Range |
|---|---|---|
| File storage | S3 storage + bandwidth | $0.023/GB/mo |
| AI features (LLM calls) | API costs per token | $0.01–$0.15 per call |
| Automations executed | Compute time per run | $0.001–$0.01 per run |
| API requests (external) | Compute + bandwidth | $0.0001–$0.001 per call |
| Email notifications | SES/provider charges | $0.0001 per email |
| File uploads/processing | Compute + storage | $0.001–$0.01 per upload |
| Real-time sync (heavy) | WebSocket server costs | ~$0.00001 per message |
| Search indexing | OpenSearch/Typesense | $0.001 per document |
| 3rd party integrations | Webhook processing | $0.0001–$0.001 per sync |
| Export/report generation | Compute-intensive | $0.01–$0.05 per report |

## What Costs Almost Nothing (Near-zero marginal cost)
| Action | Why It's Cheap |
|---|---|
| Creating tasks/projects | Just a DB row insert |
| Adding users | Auth token + DB row |
| Viewing dashboards | Cached queries |
| Writing comments | Small text inserts |
| Assigning tasks | DB update |
| Creating custom fields | Schema metadata |
| Changing task status | DB update |
| Using board/list views | Frontend rendering |

## Billing Models Evaluated

### 1. Pure Pay-As-You-Go
- **Pros**: Maximum fairness, no waste
- **Cons**: Revenue unpredictable, bill shock risk, hard to forecast
- **Risk**: Customers may self-limit to save money, reducing engagement
- **Verdict**: Too risky as primary model

### 2. Base Fee + Usage (RECOMMENDED)
- **Pros**: Predictable base revenue + upside from heavy users, fair
- **Cons**: Slightly more complex billing
- **Examples**: Workspace fee + metered storage/AI/automations
- **Verdict**: Best balance of predictability and fairness

### 3. Workspace Pricing + Metered Resources
- **Pros**: Simple base unit (workspace), clear metered add-ons
- **Cons**: Need to define workspace scope carefully
- **Verdict**: Variation of #2, works well

### 4. Credits-Based Pricing
- **Pros**: Simple mental model, prepaid reduces bill shock
- **Cons**: Credits create accounting complexity, can feel like a game
- **Examples**: AI credits, automation credits
- **Verdict**: Good for AI features specifically, not for whole platform

## Customer Perception of Fair Metering
- Storage: ✅ Universally accepted as fair (Dropbox, Google Drive precedent)
- AI features: ✅ Accepted (OpenAI, Claude precedent)
- API calls: ✅ Accepted (Stripe, Twilio precedent)
- Automations: ⚠️ Acceptable if clear (Zapier precedent)
- Number of projects: ❌ Feels artificial/gatekeeping
- Number of users: ❌ Punitive, major pain point
- Number of views/boards: ❌ Feels like feature gating

## Risks of Usage-Based Pricing
1. Revenue unpredictability (harder to forecast)
2. Bill shock → churn
3. Complex billing infrastructure needed
4. Customers may self-limit engagement
5. Harder to sell to enterprise (procurement wants fixed POs)
6. Metering infrastructure must be bulletproof

## Mitigation Strategies
- Generous free tier for near-zero-cost actions
- Usage dashboards with alerts and caps
- Spending limits / budget controls
- Hybrid model: base fee covers core, usage charges for premium
- Annual commitment options for enterprise predictability
