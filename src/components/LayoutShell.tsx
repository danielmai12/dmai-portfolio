"use client";

import Header from "./Header";
import StairTransition from "./StairTransition";
import PageTransition from "./PageTransition";

const LayoutShell = ({ children }: { children: React.ReactNode }) => {
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
