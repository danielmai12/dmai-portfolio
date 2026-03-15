"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pageLinks } from "@/lib/utils";

const Navigation = () => {
  const pathName = usePathname();

  return (
    <nav className="flex items-center">
      {pageLinks.map((link, index) => (
        <div key={index} className="flex items-center">
          <Link
            href={link.href}
            className="capitalize text-sm px-1 py-2 transition-all duration-200"
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
          {index < pageLinks.length - 1 && (
            <span
              className="mx-2 text-xs select-none"
              style={{ color: "var(--secondary-color)", opacity: 0.7 }}
              aria-hidden="true"
            >
              ·
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
