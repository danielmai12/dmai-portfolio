"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pageLinks } from "@/lib/utils";

const Navigation = () => {
  const pathName = usePathname();

  return (
    <nav className="flex gap-8">
      {pageLinks.map((link, index) => (
        <Link
          href={link.href}
          key={index}
          className={`${
            link.href === pathName && "text-accent border-b-2 border-accent"
          } capitalize font-medium hover:text-accent transition-all`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
