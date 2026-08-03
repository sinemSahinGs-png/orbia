/**
 * Capture mobile homepage screenshots for layout QA.
 * Usage: node scripts/capture-home.mjs
 */
const fs = require("fs");
const path = require("path");

async function main() {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    console.error("Playwright not installed locally. Trying npx download...");
    throw new Error("Install playwright: npm i -D playwright");
  }

  const outDir = path.join(process.cwd(), "tmp-screenshots");
  fs.mkdirSync(outDir, { recursive: true });

  const viewports = [
    { name: "390x844", width: 390, height: 844 },
    { name: "360x800", width: 360, height: 800 },
    { name: "430x932", width: 430, height: 932 },
  ];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1500);

    const aboveFold = path.join(outDir, `home-${vp.name}-fold.png`);
    await page.screenshot({ path: aboveFold, fullPage: false });

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector("#hero");
      const sticky = document.querySelector(".hero-scrub__sticky");
      const video = document.querySelector(".hero-scrub__video");
      const manifesto = document.querySelector("#manifesto");
      const nfc = document.querySelector("#nfc-journey");
      const heroRect = hero?.getBoundingClientRect();
      const stickyRect = sticky?.getBoundingClientRect();
      return {
        heroHeight: hero ? getComputedStyle(hero).height : null,
        heroClass: hero?.className ?? null,
        stickyTop: stickyRect?.top ?? null,
        stickyHeight: stickyRect?.height ?? null,
        videoOpacity: video ? getComputedStyle(video).opacity : null,
        videoReady: video?.classList.contains("hero-scrub__video--ready") ?? null,
        heroOffsetHeight: hero?.offsetHeight ?? null,
        viewportH: window.innerHeight,
        manifestoTop: manifesto?.getBoundingClientRect().top ?? null,
        nfcTop: nfc?.getBoundingClientRect().top ?? null,
        scrollHeight: document.documentElement.scrollHeight,
        blackGapEstimate:
          stickyRect && heroRect
            ? Math.max(0, stickyRect.top)
            : null,
      };
    });

    fs.writeFileSync(
      path.join(outDir, `metrics-${vp.name}.json`),
      JSON.stringify(metrics, null, 2),
    );
    console.log(vp.name, metrics);

    await page.screenshot({
      path: path.join(outDir, `home-${vp.name}-full.png`),
      fullPage: true,
    });
  }

  await browser.close();
  console.log("Screenshots written to", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
