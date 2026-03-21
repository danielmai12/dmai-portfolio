import dynamic from "next/dynamic";
import { ComponentType } from "react";

const interactiveComponents: Record<string, ComponentType> = {
  "dns-cdns-internet-traffic-routing": dynamic(
    () => import("./dns/DnsInteractive"),
  ),
  "load-balancers-reverse-proxies-api-gateways": dynamic(
    () => import("./load-balancers/LbInteractive"),
  ),
  "vpc-networking-cloud-infrastructure": dynamic(
    () => import("./vpc/VpcInteractive"),
  ),
  "caching-strategies-patterns-redis": dynamic(
    () => import("./caching/CachingInteractive"),
  ),
  "scaling-availability-auto-scaling-high-availability": dynamic(
    () => import("./scaling/ScalingInteractive"),
  ),
};

export function getInteractiveComponent(
  slug: string,
): ComponentType | null {
  return interactiveComponents[slug] ?? null;
}
