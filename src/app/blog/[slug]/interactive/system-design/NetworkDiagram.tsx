"use client";

import { Node, ConnectionLine, PacketDot } from "@/components/blog/primitives";

interface NetworkDiagramProps {
  activeStep: number;
}

export default function NetworkDiagram({ activeStep }: NetworkDiagramProps) {
  const user = { x: 60, y: 50 };
  const browser = { x: 60, y: 130 };
  const dns = { x: 200, y: 50 };
  const cdn = { x: 200, y: 200 };
  const gateway = { x: 340, y: 130 };
  const lb = { x: 340, y: 250 };
  const server = { x: 200, y: 320 };

  return (
    <svg viewBox="0 0 400 380" className="w-full h-auto" style={{ maxHeight: "60vh" }}>
      {/* Connection lines */}
      <ConnectionLine x1={user.x} y1={user.y} x2={browser.x} y2={browser.y} active={activeStep >= 0} />
      <ConnectionLine x1={browser.x} y1={browser.y} x2={dns.x} y2={dns.y} active={activeStep >= 1} delay={0.1} />
      <ConnectionLine x1={browser.x} y1={browser.y} x2={cdn.x} y2={cdn.y} active={activeStep >= 3} delay={0.1} />
      <ConnectionLine x1={cdn.x} y1={cdn.y} x2={gateway.x} y2={gateway.y} active={activeStep >= 4} delay={0.1} />
      <ConnectionLine x1={gateway.x} y1={gateway.y} x2={lb.x} y2={lb.y} active={activeStep >= 5} delay={0.1} />
      <ConnectionLine x1={lb.x} y1={lb.y} x2={server.x} y2={server.y} active={activeStep >= 5} delay={0.2} />

      {/* Animated packets */}
      <PacketDot x1={browser.x} y1={browser.y} x2={dns.x} y2={dns.y} active={activeStep === 1} delay={0.2} />
      <PacketDot x1={browser.x} y1={browser.y} x2={cdn.x} y2={cdn.y} active={activeStep === 3} delay={0.2} />
      <PacketDot x1={cdn.x} y1={cdn.y} x2={gateway.x} y2={gateway.y} active={activeStep === 4} delay={0.2} />
      <PacketDot x1={gateway.x} y1={gateway.y} x2={server.x} y2={server.y} active={activeStep === 5} delay={0.2} />
      <PacketDot x1={server.x} y1={server.y} x2={browser.x} y2={browser.y} active={activeStep === 6} delay={0.3} />

      {/* Nodes */}
      <Node {...user} label="User" icon="👤" active={activeStep >= 0} />
      <Node {...browser} label="Browser" icon="🌐" active={activeStep >= 0} delay={0.05} />
      <Node {...dns} label="DNS" icon="📖" active={activeStep >= 1 && activeStep <= 2} delay={0.1} />
      <Node {...cdn} label="CDN Edge" icon="⚡" active={activeStep >= 3 && activeStep <= 4} delay={0.15} />
      <Node {...gateway} label="API Gateway" icon="🚪" active={activeStep >= 4 && activeStep <= 5} delay={0.2} />
      <Node {...lb} label="Load Balancer" icon="⚖️" active={activeStep >= 5} delay={0.25} />
      <Node {...server} label="Origin Server" icon="🖥️" active={activeStep >= 5} delay={0.3} />
    </svg>
  );
}
