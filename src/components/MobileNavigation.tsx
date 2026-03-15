"use client";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CiMenuFries } from "react-icons/ci";
import { pageLinks } from "@/lib/utils";

const MobileNavigation = () => {
  const pathName = usePathname();

  return (
    <Sheet>
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
          <Link href="/">
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
          {pageLinks.map((link, index) => (
            <Link
              href={link.href}
              key={index}
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
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
