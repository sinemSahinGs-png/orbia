const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const CHROME =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const VIEWPORTS = [
  [390, 844, "390x844"],
  [360, 800, "360x800"],
  [430, 932, "430x932"],
  [768, 1024, "768x1024"],
  [1440, 900, "1440x900"],
];

async function capture(width, height, name) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: [`--window-size=${width},${height}`, "--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
    defaultViewport: { width, height, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto("http://127.0.0.1:3000/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await new Promise((r) => setTimeout(r, 1800));

  const outDir = path.join(process.cwd(), "tmp-screenshots");
  fs.mkdirSync(outDir, { recursive: true });

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector("#hero");
    const video = document.querySelector(".hero-scrub__video");
    const poster = document.querySelector(".hero-scrub__poster");
    const loading = document.querySelector(".hero-scrub__loading");
    const copy = document.querySelector(".hero-scrub__copy-inner");
    const title = document.querySelector(".hero-title");
    const manifesto = document.querySelector("#manifesto");
    const manifestoText = document.querySelector(".cine-manifesto__text");
    const nfc = document.querySelector("#nfc-journey");
    const container = document.querySelector(".ak-container");
    const heading = document.querySelector(".ak-heading");
    const phone = document.querySelector(".ak-nfc__phone-frame");

    const titleRect = title?.getBoundingClientRect();
    const posterBg = poster ? getComputedStyle(poster).backgroundImage : null;
    const words = [...document.querySelectorAll(".hero-word")].slice(0, 3).map((el) => ({
      text: el.textContent,
      opacity: getComputedStyle(el).opacity,
    }));

    return {
      heroHeight: hero?.offsetHeight ?? null,
      viewportH: window.innerHeight,
      heroRatio: hero ? hero.offsetHeight / window.innerHeight : null,
      videoOpacity: video ? getComputedStyle(video).opacity : null,
      videoReady: video?.classList.contains("hero-scrub__video--ready") ?? null,
      posterBg: posterBg && posterBg !== "none",
      posterOpacity: poster ? getComputedStyle(poster).opacity : null,
      loadingDisplay: loading ? getComputedStyle(loading).display : null,
      copyJustify: copy?.parentElement
        ? getComputedStyle(copy.parentElement).justifyContent
        : null,
      copyMarginTop: copy ? getComputedStyle(copy).marginTop : null,
      titleTop: titleRect?.top ?? null,
      titleVisible: titleRect ? titleRect.top < window.innerHeight && titleRect.bottom > 0 : false,
      words,
      manifestoColor: manifestoText ? getComputedStyle(manifestoText).color : null,
      manifestoHeight: manifesto?.offsetHeight ?? null,
      containerWidth: container?.getBoundingClientRect().width ?? null,
      headingWidth: heading?.getBoundingClientRect().width ?? null,
      headingFontSize: heading ? getComputedStyle(heading).fontSize : null,
      phoneWidth: phone?.getBoundingClientRect().width ?? null,
      scrollHeight: document.documentElement.scrollHeight,
      nfcTopDoc: nfc ? nfc.getBoundingClientRect().top + window.scrollY : null,
    };
  });


  fs.writeFileSync(
    path.join(outDir, `metrics-${name}.json`),
    JSON.stringify(metrics, null, 2),
  );

  await page.screenshot({
    path: path.join(outDir, `after-${name}-fold.png`),
    fullPage: false,
  });

  if (name === "390x844") {
    await page.screenshot({
      path: path.join(outDir, `after-${name}-full.png`),
      fullPage: true,
    });

    for (const [sel, label] of [
      ["#manifesto", "manifesto"],
      ["#nfc-journey", "nfc"],
      ["#zodiac-collection", "zodiac"],
      ["#daily-sky", "sky"],
      ["#astronomy-layer", "astro"],
      ["#pairing", "pair"],
      ["#physical-product", "product"],
      ["#personalization", "config"],
    ]) {
      const exists = await page.$(sel);
      if (!exists) continue;
      await page.evaluate((s) => {
        document.querySelector(s)?.scrollIntoView({ block: "start" });
      }, sel);
      await new Promise((r) => setTimeout(r, 700));
      await page.screenshot({
        path: path.join(outDir, `after-${name}-${label}.png`),
        fullPage: false,
      });
    }
  }

  await browser.close();
  console.log(name, JSON.stringify(metrics));
}

(async () => {
  for (const [w, h, name] of VIEWPORTS) {
    await capture(w, h, name);
  }
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
