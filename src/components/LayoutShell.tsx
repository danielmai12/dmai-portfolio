"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import BlogHeader from "./BlogHeader";
import StairTransition from "./StairTransition";
import PageTransition from "./PageTransition";

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
  const [isBlog, setIsBlog] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const isBlogDomain = window.location.hostname === "blog.codewithdmai.com";
    const isBlogPath = pathname.startsWith("/blog");
    setIsBlog(isBlogDomain || isBlogPath);
    setReady(true);
  }, [pathname]);

  if (!ready) return null;

  if (isBlog) {
    return (
      <>
        <BlogHeader />
        <main className="pt-16">{children}</main>
      </>
    );
  }

  return (
    <>
      <Header />
      <StairTransition />
      <main className="pt-16">
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
};

export default LayoutShell;
