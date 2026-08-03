"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { site } from "@/content/site";

const NAV_LINKS = [
  { href: "/urunler", label: "Ürünler" },
  { href: "/nasil-calisir", label: "Nasıl Çalışır?" },
  { href: "/uyum", label: "Uyum" },
  { href: "/siparis", label: "Sipariş" },
] as const;

interface HomeNavbarProps {
  demoHref?: string;
}

export function HomeNavbar({ demoHref = "/siparis" }: HomeNavbarProps) {
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const updateNavState = useCallback(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    setPastHero(rect.bottom <= 72);
  }, []);

  useEffect(() => {
    updateNavState();

    const lenis = window.__lenis;
    if (lenis) {
      lenis.on("scroll", updateNavState);
      return () => {
        lenis.off("scroll", updateNavState);
      };
    }

    window.addEventListener("scroll", updateNavState, { passive: true });
    return () => window.removeEventListener("scroll", updateNavState);
  }, [updateNavState]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`home-nav${pastHero ? " home-nav--solid" : ""}`}
        data-past-hero={pastHero}
      >
        <div className="home-nav__inner">
          <Link
            href="/"
            className="home-nav__logo"
            onClick={() => setMenuOpen(false)}
          >
            {site.brand}
          </Link>

          <nav className="home-nav__links" aria-label="Ana menü">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="home-nav__link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href={demoHref} className="home-nav__link home-nav__link--cta">
              {site.ctaPrimary}
            </Link>
          </nav>

          <button
            type="button"
            className={`home-nav__toggle${menuOpen ? " home-nav__toggle--open" : ""}`}
            aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        className={`home-nav__drawer${menuOpen ? " home-nav__drawer--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          className="home-nav__backdrop"
          aria-label="Menüyü kapat"
          onClick={() => setMenuOpen(false)}
        />
        <nav className="home-nav__drawer-nav" aria-label="Mobil menü">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href={demoHref} onClick={() => setMenuOpen(false)}>
            {site.ctaPrimary}
          </Link>
        </nav>
      </div>
    </>
  );
}
