# Recommended Pricing Model

## Model: Workspace Base Fee + Metered Usage

### Why This Model

After evaluating pure pay-as-you-go, base+usage, workspace+metered, and credits-based models, the **Workspace Base Fee + Metered Usage** model wins because:

1. **Predictable base revenue** for financial planning and investor confidence
2. **Fairness** — customers only pay for expensive resources they actually use
3. **Unlimited users** — the core differentiator, enabled by near-zero per-user marginal cost
4. **No bill shock** — base fee covers core usage, metered charges are transparent
5. **Proven model** — Stripe, Twilio, Snowflake, and others have validated this approach

---

## Pricing Structure

### Base Plan: $10/workspace/month (annual) or $14/month (monthly)

**Included in base:**
- ✅ Unlimited users (team members + guests)
- ✅ All features (boards, Gantt, timelines, sprints, custom fields, forms)
- ✅ All views (list, board, calendar, timeline, table)
- ✅ Unlimited projects and tasks
- ✅ Unlimited comments and activity
- ✅ 5 GB storage included
- ✅ 1,000 automation runs/month included
- ✅ Basic integrations (Slack, GitHub, Google)
- ✅ API access (10,000 calls/month included)
- ✅ Real-time collaboration
- ✅ Mobile app access
- ✅ Email notifications
- ✅ Usage dashboard and billing transparency

### Metered Usage (Pay Only What You Use)

| Resource | Included Free | Overage Rate |
|---|---|---|
| Storage | 5 GB | $0.50/GB/month |
| AI features (summaries, writing, insights) | 50 calls/month | $0.05/call |
| Automation runs | 1,000/month | $0.005/run |
| API requests | 10,000/month | $0.001/request |
| File uploads (processing) | 100/month | $0.01/upload |
| Third-party integrations | 3 integrations | $2/additional integration/month |
| Export/report generation | 20/month | $0.10/report |
| Guest portals (client-facing) | 1 portal | $3/additional portal/month |

### Optional Add-ons (Flat Monthly)

| Add-on | Price | What |
|---|---|---|
| Advanced Security | $5/workspace/mo | SSO, SCIM, audit logs, 2FA enforcement |
| Priority Support | $10/workspace/mo | 24/7 support, <1hr response, dedicated Slack |
| Custom Domain | $3/workspace/mo | White-label workspace URL |
| Extended History | $3/workspace/mo | 1-year activity history (vs 90 days) |

---

## Pricing Philosophy

### What We DON'T Charge For (Near-Zero Cost)
- Adding users (it's just a DB row)
- Creating tasks, projects, boards
- Using any view or layout
- Writing comments
- Assigning and organizing work
- Using custom fields and tags
- Basic reporting

### What We DO Charge For (Real Infrastructure Cost)
- Storing files (linear cost scaling)
- AI processing (highest per-action cost)
- Running automations (compute cost)
- Heavy API usage (bandwidth + compute)
- Processing file uploads (compute)
- External integrations (webhook processing + third-party API costs)

---

## Competitive Price Comparison (50-Person Team)

| Scenario | Competitor Avg | Our Platform | Savings |
|---|---|---|---|
| Light usage (basic PM) | $450–600/mo | $10/mo | 96-98% |
| Moderate usage (automations, some storage) | $450–600/mo | $25-50/mo | 90-95% |
| Heavy usage (AI, lots of storage, many automations) | $600–1,200/mo | $80-150/mo | 75-87% |
| Power usage (everything maxed) | $1,000–2,250/mo | $150-300/mo | 70-85% |

**Key insight**: Even power users save 70%+ compared to competitors. Light users save 95%+. This is the value proposition.

---

## Revenue Modeling

### Conservative Assumptions
- Average workspace: 8 users
- Average metered usage: $15/workspace/month beyond base
- Effective ARPU: ~$25/workspace/month

### Revenue Projections

| Metric | 100 WS | 500 WS | 2,000 WS | 10,000 WS |
|---|---|---|---|---|
| Base revenue | $1,000/mo | $5,000/mo | $20,000/mo | $100,000/mo |
| Usage revenue | $1,500/mo | $7,500/mo | $30,000/mo | $150,000/mo |
| **Total MRR** | **$2,500** | **$12,500** | **$50,000** | **$250,000** |
| **ARR** | **$30K** | **$150K** | **$600K** | **$3M** |
| Infrastructure cost | ~$200 | ~$800 | ~$3,000 | ~$15,000 |
| **Gross margin** | **92%** | **94%** | **94%** | **94%** |
