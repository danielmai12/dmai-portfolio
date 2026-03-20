"use client";

import { useEffect, useState } from "react";

export function useBlogPrefix() {
  const [isBlogDomain, setIsBlogDomain] = useState(false);

  useEffect(() => {
    setIsBlogDomain(window.location.hostname === "blog.codewithdmai.com");
  }, []);

  return (path: string) => {
    if (isBlogDomain) {
      // Strip /blog prefix — middleware handles the rewrite
      return path.replace(/^\/blog/, "") || "/";
    }
    return path;
  };
}
