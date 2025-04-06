import Link from "next/link";

import { Button } from "./ui/button";
import Navigation from "./Navigation";

const Header = () => {
  return (
    <header className="py-8 xl:py-12 text-white bg-pink-50/20">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="text-4xl font-semibold">
            Daniel<span className="text-accent">.</span>
          </h1>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden xl:flex items-center gap-8">
          <Navigation />
          <Link href="/contact">
            <Button className="ml-auto">Contact</Button>
          </Link>
        </div>

        {/* Mobile navigation */}
        <div className="xl:hidden">mobile nav</div>
      </div>
    </header>
  );
};

export default Header;
