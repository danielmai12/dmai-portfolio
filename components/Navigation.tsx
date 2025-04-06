"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "home", href: "/" },
  { name: "resume", href: "/resume" },
  { name: "projects", href: "/projects" },
  { name: "work", href: "/work" },
  { name: "contact", href: "/contact" },
  { name: "blog", href: "/blog" },
];
const Navigation = () => {
  const pathName = usePathname();

  return (
    <nav className="flex gap-8">
      {links.map((link, index) => (
        <Link
          href={link.href}
          key={index}
          className={`${
            link.href === pathName && "text-accent border-b-2 border-accent"
          }`}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
