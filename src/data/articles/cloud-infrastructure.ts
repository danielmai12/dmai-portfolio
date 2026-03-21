import { Article, CATEGORY } from "./types";

export const cloudInfraArticles: Article[] = [
  {
    slug: "scaling-availability-auto-scaling-high-availability",
    title: "Scaling & Availability",
    date: "Mar 20, 2026",
    category: CATEGORY.CLOUD_INFRA,
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
  {
    slug: "vpc-networking-cloud-infrastructure",
    title: "VPC - Your Private Network in the Cloud",
    date: "Mar 19, 2026",
    category: CATEGORY.CLOUD_INFRA,
    summary:
      "Subnets, gateways, route tables, security groups, and CIDR blocks - how cloud networking actually works under the hood.",
    readingTime: "8 min read",
    interactive: true,
    content: `## VPC - Your Private Network in the Cloud

A Virtual Private Cloud (VPC) is your isolated network within a cloud provider. Every resource you deploy lives inside one.

### Core Concepts

**Subnets** partition your VPC into public (internet-facing), private (internal), and isolated (no internet) zones.

**Internet Gateway (IGW)** enables bidirectional internet access for public subnets. **NAT Gateway** lets private resources make outbound requests without being exposed.

**Route Tables** determine where traffic flows - they're what actually make a subnet "public" or "private."

**Security Groups** (stateful, per-instance) and **NACLs** (stateless, per-subnet) provide two layers of firewall protection.

**VPC Peering** connects two VPCs directly. **Transit Gateway** acts as a hub for many VPCs at scale.

**CIDR Blocks** define your IP address space. Plan carefully - overlapping CIDRs prevent peering.

### A Typical Production VPC

\`\`\`
Internet → IGW → ALB (public subnet) → App Server (private subnet) → RDS (isolated subnet)
\`\`\`

Defense in depth: multiple layers of network isolation ensuring that even if one layer is compromised, the blast radius is contained.`,
  },
];
