const fs = require("fs");
const p = require("puppeteer-core");

(async () => {
  const exe = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    process.env.LOCALAPPDATA + "\\Google\\Chrome\\Application\\chrome.exe",
  ].find((c) => fs.existsSync(c));
  const b = await p.launch({
    executablePath: exe,
    headless: true,
    args: ["--no-sandbox", "--autoplay-policy=no-user-gesture-required"],
  });

  async function go(w, h, rm = false) {
    const page = await b.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 2 });
    if (rm) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    const errs = [];
    page.on("pageerror", (e) => errs.push(String(e)));
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 120000 });
    return { page, errs };
  }

  const { page, errs } = await go(390, 844);
  const report = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const img = q(".ak-product-photo__img") || q("#physical-product img");
    const heroV = q(".hero-scrub__video");
    const poster = q(".hero-scrub__poster");
    const cards = [...document.querySelectorAll(".ak-zodiac-card")].map((c) => ({
      name: c.querySelector(".ak-zodiac-card__name")?.textContent,
      hasProduct: !!c.querySelector(".ak-zodiac-card__product-img"),
      hasGlyph: !!c.querySelector(".ak-zodiac-card__glyph"),
      src: c.querySelector(".ak-zodiac-card__product-img")?.getAttribute("src"),
    }));
    return {
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      heroSrc: heroV?.currentSrc || heroV?.getAttribute("src"),
      heroReady: heroV?.classList.contains("hero-scrub__video--ready"),
      heroPaused: heroV?.paused,
      posterBg: poster ? getComputedStyle(poster).backgroundImage.slice(0, 80) : null,
      product: img
        ? {
            src: img.getAttribute("src"),
            nat: img.naturalWidth,
            w: Math.round(img.getBoundingClientRect().width),
            h: Math.round(img.getBoundingClientRect().height),
            op: getComputedStyle(img).opacity,
          }
        : null,
      placeholderLeft: !!q("#physical-product .ak-keychain"),
      configPhoto: !!q("#personalization .ak-product-photo__img"),
      cards,
      nfcVideo: !!q("#nfc-journey video, .ak-nfc video"),
    };
  });
  console.log("HOME390", JSON.stringify(report, null, 2));
  console.log("ERRS", errs.slice(0, 5));

  await page.screenshot({ path: "tmp-home-390-hero.png" });
  await page.evaluate(() => document.querySelector("#physical-product")?.scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: "tmp-home-390-product.png" });
  await page.evaluate(() => document.querySelector("#personalization")?.scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "tmp-home-390-config.png" });
  await page.evaluate(() => document.querySelector("#zodiac-collection")?.scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: "tmp-home-390-zodiac.png" });
  await page.evaluate(() => document.querySelector("#nfc-journey, .ak-nfc")?.scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 300));
  await page.screenshot({ path: "tmp-home-390-nfc.png" });
  await page.close();

  const d = await go(1440, 900);
  await d.page.screenshot({ path: "tmp-home-1440-hero.png" });
  const dHero = await d.page.evaluate(() => {
    const v = document.querySelector(".hero-scrub__video");
    return { src: v?.currentSrc || v?.getAttribute("src"), ready: v?.classList.contains("hero-scrub__video--ready") };
  });
  console.log("DESK_HERO", JSON.stringify(dHero));
  await d.page.evaluate(() => document.querySelector("#physical-product")?.scrollIntoView({ block: "center" }));
  await new Promise((r) => setTimeout(r, 500));
  await d.page.screenshot({ path: "tmp-home-1440-product.png" });
  await d.page.evaluate(() => document.querySelector("#zodiac-collection")?.scrollIntoView({ block: "start" }));
  await new Promise((r) => setTimeout(r, 400));
  await d.page.screenshot({ path: "tmp-home-1440-zodiac.png" });
  await d.page.close();

  for (const [w, h, n] of [
    [360, 800, "360"],
    [430, 932, "430"],
    [768, 1024, "768"],
  ]) {
    const g = await go(w, h);
    const o = await g.page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      hero: document.querySelector(".hero-scrub__video")?.getAttribute("src"),
      prodNat: document.querySelector(".ak-product-photo__img")?.naturalWidth || 0,
    }));
    console.log(n, JSON.stringify(o));
    await g.page.close();
  }

  const rm = await go(390, 844, true);
  const rmR = await rm.page.evaluate(() => ({
    hasVideo: !!document.querySelector(".hero-scrub__video"),
    poster: getComputedStyle(document.querySelector(".hero-scrub__poster")).backgroundImage.includes("orbia-cosmic-poster"),
    ambient: document.querySelector(".hero-scrub")?.classList.contains("hero-scrub--ambient"),
  }));
  console.log("RM", JSON.stringify(rmR));
  await rm.page.close();
  await b.close();
})();
