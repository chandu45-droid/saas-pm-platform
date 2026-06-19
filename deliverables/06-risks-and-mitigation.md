# Risks and Mitigation Strategies

## High-Impact Risks

### 1. Revenue Unpredictability
- **Risk**: Usage-based revenue fluctuates monthly, making forecasting hard
- **Impact**: HIGH — affects hiring, investment, and planning decisions
- **Mitigation**:
  - Hybrid model (base fee provides 40-60% of revenue as fixed)
  - Annual workspace commitments with discounted base fee
  - Usage trend analytics to forecast revenue 2-3 months out
  - Maintain 6-month runway at all times

### 2. Incumbents Copy the Model
- **Risk**: ClickUp or Monday.com launches an "unlimited users" tier
- **Impact**: MEDIUM — they can copy pricing but can't easily restructure
- **Mitigation**:
  - Per-seat pricing is deeply embedded in their revenue models — shareholders won't let them switch
  - Build community and brand loyalty before incumbents react
  - Focus on execution speed — they're bureaucratic, you're nimble
  - Open-source core components for added defensibility

### 3. Enterprise Sales Friction
- **Risk**: Enterprise procurement teams want predictable annual contracts, not metered billing
- **Impact**: MEDIUM — limits upmarket potential
- **Mitigation**:
  - Offer annual commitment pricing with pre-purchased usage blocks
  - Provide spending caps and budget alerts
  - Create "committed use" discounts (similar to AWS Reserved Instances)
  - Don't target enterprise initially — focus on SMB/startup

### 4. Bill Shock → Churn
- **Risk**: Customer gets unexpected high bill, churns angrily
- **Impact**: HIGH — word-of-mouth damage is worse than lost revenue
- **Mitigation**:
  - Real-time usage dashboard prominently displayed
  - Email alerts at 50%, 80%, 100% of typical usage
  - Configurable spending caps (hard stop or soft warning)
  - Generous free tier makes overage rare for most users
  - Transparent pricing calculator before signup

### 5. Building a PM Tool is Hard
- **Risk**: The core product (not just pricing) needs to be excellent to win
- **Impact**: CRITICAL — pricing alone won't save a bad product
- **Mitigation**:
  - MVP scope is ruthlessly tight (see deliverable 08)
  - AI-assisted development for speed
  - Launch as "simple and focused" — don't try to match ClickUp's 200 features
  - Target a niche first (e.g., small agencies, indie dev teams)

---

## Medium-Impact Risks

### 6. Metering Infrastructure Complexity
- **Risk**: Usage metering must be bulletproof — billing disputes destroy trust
- **Impact**: MEDIUM — technical complexity, not market risk
- **Mitigation**:
  - Use proven metering services (Stripe Billing, Lago, Orb)
  - Event-sourced architecture for audit trail
  - Real-time usage visibility for customers
  - Monthly usage statement with line-item detail

### 7. AI Cost Volatility
- **Risk**: LLM API prices fluctuate; customers using AI heavily could cost more than charged
- **Impact**: MEDIUM — margins at risk if AI pricing changes
- **Mitigation**:
  - Use open-source/self-hosted models for basic AI tasks (Llama, Mistral)
  - Reserve premium API calls (Claude, GPT-4) for high-value features
  - Re-price AI overages quarterly to match provider costs
  - Set per-user AI rate limits to prevent abuse

### 8. Free Tier Abuse
- **Risk**: Users create multiple workspaces to stay free forever
- **Impact**: LOW-MEDIUM — costs money, sets bad precedent
- **Mitigation**:
  - Free tier is generous for core PM (tasks, views) but limited on storage/AI
  - Account-level limits (not just workspace-level)
  - Fair use policy enforcement
  - Conversion focus: make paid tier so cheap that free feels limiting

### 9. Regulatory/Compliance
- **Risk**: Data residency requirements, GDPR compliance add cost and complexity
- **Impact**: MEDIUM — required for enterprise, costly to implement
- **Mitigation**:
  - Start with Supabase/Vercel (EU regions available)
  - SOC2 preparation from month 6+ (not MVP)
  - GDPR compliance built in from day 1 (it's a design choice, not a bolt-on)
  - Data export/deletion features as core functionality

---

## Low-Impact Risks

### 10. Brand Perception — "Cheap = Low Quality"
- **Risk**: Extremely low pricing makes customers skeptical
- **Mitigation**: Position as "transparent" not "cheap" — emphasize fairness, not price
  
### 11. Support Cost at Scale
- **Risk**: Unlimited users = more support requests
- **Mitigation**: AI-powered support bot, comprehensive docs, community forum

### 12. Technical Debt from AI-Assisted Development
- **Risk**: Claude-generated code may need refactoring at scale
- **Mitigation**: Code review discipline, architecture-first approach, refactor sprints quarterly
