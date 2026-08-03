import Link from "next/link";
import { site } from "@/content/site";

export function PremiumHomeFooter() {
  return (
    <footer className="home-footer">
      <div className="home-footer__inner">
        <p className="home-footer__brand">{site.brand}</p>
        <p className="home-footer__tagline">{site.slogan}</p>
        <nav className="home-footer__links">
          <Link href="/sss">SSS</Link>
          <Link href="/iletisim">İletişim</Link>
          <Link href="/gizlilik">Gizlilik</Link>
          <Link href="/cerez">Çerezler</Link>
          <Link href="/astroloji-bildirimi">Astroloji bildirimi</Link>
        </nav>
        <p className="home-footer__copy">© {new Date().getFullYear()} {site.brand}</p>
      </div>
    </footer>
  );
}
