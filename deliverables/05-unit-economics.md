# Unit Economics Model

## Scenario A: $10/workspace/month + 5GB Storage Included

### Assumptions
- Average workspace: 8 users
- Average storage used: 8 GB (3 GB overage)
- Average automation runs: 500/month (within free tier)
- Average AI calls: 20/month (within free tier)
- Minimal overages — light usage profile

### Per-Workspace Economics

| Metric | Value |
|---|---|
| Base fee | $10.00/mo |
| Storage overage (3GB × $0.50) | $1.50/mo |
| Other overages | ~$0.50/mo |
| **Total Revenue/Workspace** | **$12.00/mo** |
| Infrastructure cost/workspace | ~$1.50/mo at 1K WS scale |
| **Gross Profit/Workspace** | **$10.50/mo (88%)** |

### Scale Economics

| Scale | Workspaces | MRR | Infra Cost | Gross Margin | Gross Profit |
|---|---|---|---|---|---|
| Seed | 100 | $1,200 | $200 | 83% | $1,000 |
| Early | 500 | $6,000 | $700 | 88% | $5,300 |
| Growth | 2,000 | $24,000 | $2,200 | 91% | $21,800 |
| Scale | 10,000 | $120,000 | $8,000 | 93% | $112,000 |

### Break-Even Analysis (Scenario A)
- Monthly operating expenses (solo founder): ~$2,000 (tools, infra, personal)
- Break-even: ~170 workspaces (~$2,000 MRR)
- Timeline to break-even: 3-6 months post-launch (realistic)

---

## Scenario B: $20/workspace/month + Metered AI & Automations

### Assumptions
- Average workspace: 12 users (larger teams attracted by higher base)
- Storage included: 10 GB, average used: 15 GB
- Average AI calls: 100/month ($2.50 overage after 50 free)
- Average automation runs: 3,000/month ($10 overage after 1K free)
- Moderate usage profile

### Per-Workspace Economics

| Metric | Value |
|---|---|
| Base fee | $20.00/mo |
| Storage overage (5GB × $0.50) | $2.50/mo |
| AI overage (50 calls × $0.05) | $2.50/mo |
| Automation overage (2K × $0.005) | $10.00/mo |
| Other overages (API, exports) | ~$3.00/mo |
| **Total Revenue/Workspace** | **$38.00/mo** |
| Infrastructure cost/workspace | ~$3.00/mo at 1K WS scale |
| **Gross Profit/Workspace** | **$35.00/mo (92%)** |

### Scale Economics

| Scale | Workspaces | MRR | Infra Cost | Gross Margin | Gross Profit |
|---|---|---|---|---|---|
| Seed | 100 | $3,800 | $350 | 91% | $3,450 |
| Early | 500 | $19,000 | $1,200 | 94% | $17,800 |
| Growth | 2,000 | $76,000 | $4,000 | 95% | $72,000 |
| Scale | 10,000 | $380,000 | $15,000 | 96% | $365,000 |

### Break-Even Analysis (Scenario B)
- Monthly operating expenses (solo founder): ~$2,500
- Break-even: ~66 workspaces (~$2,500 MRR)
- Timeline to break-even: 2-4 months post-launch

---

## Comparison: Our Platform vs Competitors

### Revenue Per User Comparison

| Platform | Avg Revenue/User/Month | Our Platform (per effective user) |
|---|---|---|
| ClickUp | $10-12 | — |
| Jira | $8-15 | — |
| Asana | $15-25 | — |
| Monday.com | $12-19 | — |
| Notion | $12-20 | — |
| Zoho | $4-9 | — |
| **Ours (Scenario A)** | — | **$1.50** (12/8 users) |
| **Ours (Scenario B)** | — | **$3.17** (38/12 users) |

**Key insight**: Our revenue per user is 3-10x lower than competitors, but our cost per user is also 10-50x lower because most per-user costs are near zero. Gross margins are comparable or better.

---

## Sustainability Analysis

### At What Scale Is This Business Sustainable?

| Milestone | Workspaces | MRR | Annual Revenue | Team Needed |
|---|---|---|---|---|
| Ramen profitable | 200 | $4,000 | $48K | Solo founder |
| Comfortable solo | 500 | $12,500 | $150K | Solo + 1 contractor |
| Small team viable | 2,000 | $50,000 | $600K | 3-4 people |
| Growth stage | 5,000 | $125,000 | $1.5M | 6-8 people |
| Series A ready | 10,000 | $250,000 | $3M | 10-15 people |

### Key Ratios

| Metric | Target | Notes |
|---|---|---|
| Gross margin | >85% | Achieved at all scales |
| CAC payback | <3 months | Low price = low friction acquisition |
| LTV:CAC | >3:1 | Target through organic + content marketing |
| Net revenue retention | >110% | Usage grows as teams use more features |
| Churn | <5% monthly | Low price = low switching motivation |

---

## Recommendation

**Scenario B ($20 base) is recommended for launch** because:
1. Higher base fee provides more revenue predictability
2. Still dramatically cheaper than all competitors for any team size
3. Metered AI and automations capture value from power users
4. Faster break-even (66 workspaces vs 170)
5. Can always introduce a $10 "starter" tier later as a downmarket play
