# Infrastructure Cost Research — Raw Data

## AWS-Based SaaS Cost Benchmarks (2025-2026)

### Early Stage (MVP / <100 users)
- Basic cloud hosting: $300–$500/mo
- Database (RDS/Supabase): $50–$200/mo
- Storage (S3): $5–$20/mo
- CDN (CloudFront): $10–$50/mo
- Email (SES/Resend): $5–$20/mo
- Auth (Cognito/Clerk): $0–$25/mo
- Monitoring (CloudWatch): $20–$50/mo
- **Total**: ~$400–$900/mo

### Growth Stage (1,000 users)
- App servers (ECS/Lambda): $500–$1,500/mo
- Database (RDS Multi-AZ): $200–$600/mo
- Redis/caching: $50–$150/mo
- Storage: $20–$100/mo
- CDN + bandwidth: $50–$200/mo
- Search (OpenSearch/Typesense): $100–$300/mo
- Email + push: $30–$100/mo
- Monitoring + logging: $50–$150/mo
- **Total**: ~$1,000–$3,000/mo

### Scale Stage (10,000 users)
- App servers (ECS cluster): $2,000–$5,000/mo
- Database (RDS + read replicas): $1,000–$3,000/mo
- Redis cluster: $200–$500/mo
- Storage: $100–$500/mo
- CDN + bandwidth: $200–$800/mo
- Search: $300–$800/mo
- Email + push: $100–$400/mo
- Monitoring + security: $200–$500/mo
- **Total**: ~$4,000–$11,000/mo

### Enterprise Scale (100,000 users)
- App servers (multi-region): $10,000–$25,000/mo
- Database (Aurora cluster): $5,000–$15,000/mo
- Redis cluster: $1,000–$3,000/mo
- Storage: $500–$3,000/mo
- CDN + bandwidth: $1,000–$5,000/mo
- Search: $1,000–$3,000/mo
- Email + push: $500–$2,000/mo
- Monitoring + security + compliance: $1,000–$3,000/mo
- **Total**: ~$20,000–$60,000/mo

## Cost Per Active User (Estimated)
| Scale | Monthly Infra | Cost/User/Mo |
|---|---|---|
| 100 users | ~$500 | ~$5.00 |
| 1,000 users | ~$2,000 | ~$2.00 |
| 10,000 users | ~$7,500 | ~$0.75 |
| 100,000 users | ~$40,000 | ~$0.40 |

## Key Cost Drivers
- Database scales sub-linearly (bulk of cost at low scale)
- Storage scales linearly with usage
- Bandwidth scales with activity level
- AI/LLM calls are the most expensive per-action cost ($0.01–$0.10+ per call)
- Search indexing scales with data volume
- Real-time features (WebSockets) add server overhead

## Architecture Impact on Cost
- Serverless (Lambda + DynamoDB) can reduce costs 30-50% for variable workloads
- Reserved instances cut compute costs 40-60% vs on-demand
- CDN caching can reduce origin requests by 80-90%
- Proper connection pooling reduces database costs significantly

## Hidden Costs Often Missed
- Data transfer out: $0.09/GB
- CloudWatch logging: $0.50/GB ingested
- NAT Gateway: $0.045/hr + $0.045/GB processed
- SSL certificates: free with ACM but management overhead
- Backup storage: often 2-3x primary storage cost
- Dev/staging environments: typically 30-50% of production cost
