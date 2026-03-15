import Link from "next/link";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header
      className="py-5 xl:py-5 fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--primary-color)" }}
          >
            Daniel<span style={{ color: "var(--accent-color)" }}>.</span>
          </h1>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden xl:flex items-center gap-3">
          <Navigation />
          <ThemeToggle />
        </div>

        {/* Mobile navigation */}
        <div className="xl:hidden flex items-center gap-2">
          <ThemeToggle />
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
};

export default Header;
