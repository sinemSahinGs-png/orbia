import { HomeNavbar } from "@/components/home/HomeNavbar";
import { PremiumHomeFooter } from "@/components/home/PremiumHomeFooter";

export function MarketingChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="memoora-home-premium">
      <HomeNavbar demoHref="/siparis" />
      <main className="astra-page">{children}</main>
      <PremiumHomeFooter />
    </div>
  );
}
