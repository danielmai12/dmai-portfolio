import dynamic from "next/dynamic";
import { ComponentType } from "react";

const interactiveComponents: Record<string, ComponentType> = {
  // System Design
  "dns-cdns-internet-traffic-routing": dynamic(
    () => import("./system-design/DnsInteractive"),
  ),
  "load-balancers-reverse-proxies-api-gateways": dynamic(
    () => import("./system-design/LbInteractive"),
  ),
  // Leetcode
  // Backend
  // Database
  // DevOps
};

export function getInteractiveComponent(
  slug: string,
): ComponentType | null {
  return interactiveComponents[slug] ?? null;
}
