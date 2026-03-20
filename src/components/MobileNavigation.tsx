"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";
import { pageLinks } from "@/lib/utils";

const MobileNavigation = () => {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries
          className="text-[32px]"
          style={{ color: "var(--text-color)" }}
        />
      </SheetTrigger>
      <SheetContent
        className="flex flex-col"
        style={{
          backgroundColor: "var(--bg-color)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
        }}
      >
        {/* logo */}
        <div className="mt-32 mb-48 text-center text-2xl">
          <Link href="/" onClick={() => setOpen(false)}>
            <h1
              className="text-4xl font-semibold tracking-tight"
              style={{ color: "var(--primary-color)" }}
            >
              Daniel<span style={{ color: "var(--accent-color)" }}>.</span>
            </h1>
          </Link>
        </div>

        {/* nav */}
        <nav className="flex flex-col justify-center items-center gap-8">
          {pageLinks.map((link, index) => {
            const isExternal = link.href.startsWith("http");
            const LinkComponent = isExternal ? "a" : Link;
            const linkProps = isExternal
              ? { href: link.href, target: "_blank", rel: "noopener noreferrer" }
              : { href: link.href };
            return (
            <LinkComponent
              {...linkProps}
              key={index}
              onClick={() => setOpen(false)}
              className="text-xl capitalize transition-all duration-200"
              style={{
                color:
                  link.href === pathName
                    ? "var(--primary-color)"
                    : "var(--text-color)",
                fontWeight: link.href === pathName ? 600 : 500,
              }}
            >
              {link.name}
            </LinkComponent>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
