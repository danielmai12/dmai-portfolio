import { Article } from "./types";

export const cloudInfraArticles: Article[] = [
  {
    slug: "scaling-availability-auto-scaling-high-availability",
    title: "Scaling & Availability",
    date: "Mar 20, 2026",
    category: "Cloud & Infrastructure",
    summary:
      "Auto scaling, health checks, multi-zone deployments, and managed instance groups. How cloud systems stay up when things go down.",
    readingTime: "10 min read",
    interactive: true,
    content: `## Scaling & Availability

A load balancer routes traffic. But who decides how many servers there are? And what happens when an entire data center goes down?

### Auto Scaling

Auto scaling automatically adjusts instance count based on demand. **Scale out** adds instances when CPU or request rate exceeds thresholds. **Scale in** removes them when load drops.

In GCP, this is a **Managed Instance Group (MIG)** with autoscaling policies. In AWS, it's an **Auto Scaling Group (ASG)** with target tracking or step scaling.

### Health Checks

The load balancer pings each instance with \`GET /health\` every 10-30 seconds. Failed instances are removed from rotation. In GCP, MIGs use health checks for **auto-healing** - failed instances are automatically recreated.

### High Availability

HA is measured in "nines" - 99.99% uptime means ~52 minutes of downtime per year. The key is **redundancy across failure domains**: spread instances across availability zones so a zone failure doesn't take down your service.

### The Trifecta

Load balancing detects failures and reroutes traffic. Auto scaling ensures capacity. Multi-zone deployment provides redundancy. Together, they form a self-healing system.

\`\`\`
Client → HTTPS LB (global) → Regional MIG (multi-zone) → VM instances
                                  ↑
                          Health checks + Auto scaling
\`\`\``,
  },
];
