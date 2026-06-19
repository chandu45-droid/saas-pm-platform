# Suggested MVP Scope

## MVP Philosophy
Build the smallest PM tool that demonstrates the pricing model's value. Every feature in MVP must pass two tests:
1. Would a 5-15 person team need this daily?
2. Can it be built in 1-2 weeks with AI-assisted development?

If no to either, it's post-MVP.

---

## MVP Features (Must Ship)

### Core Task Management
- [ ] Create, edit, delete tasks
- [ ] Task properties: title, description, status, priority, due date, assignee
- [ ] Custom statuses per project (To Do, In Progress, Done, etc.)
- [ ] Subtasks (one level deep)
- [ ] Comments on tasks (text only at MVP)
- [ ] Task activity log (who changed what, when)

### Project Organization
- [ ] Workspaces (top-level container)
- [ ] Projects within workspaces
- [ ] Invite unlimited team members (email invite)
- [ ] Role-based access: Admin, Member, Guest (view-only)

### Views
- [ ] List view (default, table-like)
- [ ] Board/Kanban view (drag-and-drop columns)
- [ ] Calendar view (tasks by due date)
- *Timeline/Gantt is post-MVP*

### Search & Filter
- [ ] Global search across tasks
- [ ] Filter tasks by status, priority, assignee, due date
- [ ] Sort by created date, due date, priority

### File Attachments
- [ ] Upload files to tasks (images, docs, PDFs)
- [ ] Storage metered (5GB free, then $0.50/GB)
- [ ] File preview (images inline, others download)

### Notifications
- [ ] In-app notifications (task assigned, mentioned, status changed)
- [ ] Email notifications (configurable)
- [ ] Notification preferences per user

### Billing & Usage (THE DIFFERENTIATOR)
- [ ] Real-time usage dashboard
- [ ] Storage usage meter
- [ ] Automation run counter
- [ ] Stripe billing integration
- [ ] Usage alerts (50%, 80%, 100% of typical)
- [ ] Transparent pricing page with calculator

### Auth & Settings
- [ ] Email + password signup/login
- [ ] Google OAuth login
- [ ] Workspace settings (name, timezone, invite links)
- [ ] Profile settings (name, avatar, notification prefs)

---

## Post-MVP (V1.1–V2.0)

### Phase 2 (Month 3-4 post-launch)
- Timeline/Gantt view
- Custom fields (text, number, dropdown, date)
- Basic automations (if X then Y)
- Task templates
- Bulk operations
- API v1 (REST)

### Phase 3 (Month 5-6 post-launch)
- AI features (task summarization, smart assignment, writing assist)
- Integrations (Slack, GitHub, Google Calendar)
- Advanced reporting / dashboards
- Sprint/iteration management
- Mobile-responsive improvements

### Phase 4 (Month 7-12 post-launch)
- Native mobile apps (React Native / Expo)
- Advanced automations (multi-step workflows)
- Formula fields
- Time tracking
- Guest portals (client-facing)
- SSO / SCIM (enterprise)
- Webhook API

---

## What's Explicitly NOT in MVP

| Feature | Why Not |
|---|---|
| AI features | Not core PM; add when metering is proven |
| Automations | Complex to build; manual workflows are fine for MVP |
| Gantt/timeline | Nice-to-have, not essential for small teams |
| API access | No external consumers at MVP |
| Mobile app | Responsive web is sufficient |
| Integrations | Manual workflow is acceptable initially |
| SSO/SCIM | Enterprise feature, no enterprise customers at MVP |
| Custom fields | Built-in fields are enough for MVP |
| Time tracking | Different product category |
| White labeling | Enterprise feature |

---

## MVP Development Estimate

### Using AI-Assisted Development (Claude Code + Cursor)

| Component | Estimate | Notes |
|---|---|---|
| Auth + user management | 2-3 days | Clerk/Supabase Auth handles heavy lifting |
| Database schema + API | 3-4 days | Drizzle ORM + tRPC / Server Actions |
| Task CRUD + properties | 3-4 days | Core functionality |
| Project/workspace management | 2-3 days | Multi-tenancy setup |
| Board view (Kanban) | 2-3 days | DnD library + real-time updates |
| List view | 1-2 days | Table component |
| Calendar view | 1-2 days | Calendar library integration |
| File upload + storage metering | 2-3 days | S3/R2 + usage tracking |
| Search + filtering | 2-3 days | Full-text search |
| Notifications system | 2-3 days | In-app + email |
| Billing + usage dashboard | 3-5 days | Stripe + metering UI |
| Landing page + pricing | 2-3 days | Marketing site |
| UI polish + testing | 3-5 days | Responsive design, edge cases |
| **Total** | **28-43 days** | **~5-8 weeks** |

### Cost to Build MVP

| Item | Cost |
|---|---|
| Claude Pro subscription | $20/mo |
| Cursor Pro | $20/mo |
| Domain | $12/yr |
| Vercel Pro | $20/mo |
| Supabase Pro | $25/mo |
| Stripe (no upfront cost) | Transaction fees only |
| **Monthly cost during dev** | **~$85/mo** |
| **Total MVP cost (8 weeks)** | **~$180 + domain** |
