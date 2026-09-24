const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const previewDir = path.join(__dirname, '..', 'assets', 'previews');
  if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === 'win32' ? { channel: 'msedge' } : {})
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce'
    });

    const page = await context.newPage();
    await page.goto('http://localhost:4182', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // Wait slightly for any layout settling
    await page.waitForTimeout(500);

    // 1. Mobile Hero (Above the fold viewport)
    await page.screenshot({ path: path.join(previewDir, 'mobile-viewport-hero.png') });
    console.log('Saved mobile-viewport-hero.png');

    // 2. Mobile Full Page
    await page.screenshot({ path: path.join(previewDir, 'mobile-full.png'), fullPage: true });
    console.log('Saved mobile-full.png');

    // 3. Section: Intro & Tabs (Parahyangan)
    const exploreSection = await page.$('#g-explore');
    if (exploreSection) {
      await exploreSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await exploreSection.screenshot({ path: path.join(previewDir, 'mobile-tabs.png') });
      console.log('Saved mobile-tabs.png');
    }

    // 4. Section: School (Ruang Belajar)
    const schoolSection = await page.$('#g-school');
    if (schoolSection) {
      await schoolSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await schoolSection.screenshot({ path: path.join(previewDir, 'mobile-school.png') });
      console.log('Saved mobile-school.png');
    }

    // 5. Section: Quiz
    const quizSection = await page.$('#g-quiz');
    if (quizSection) {
      await quizSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await quizSection.screenshot({ path: path.join(previewDir, 'mobile-quiz.png') });
      console.log('Saved mobile-quiz.png');
    }

    // 6. Mobile Nav Menu Open
    await page.goto('http://localhost:4182', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.click('#g-menu');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(previewDir, 'mobile-menu-open.png') });
    console.log('Saved mobile-menu-open.png');

    // 7. Dark Mode Full Page
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('http://localhost:4182', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(previewDir, 'mobile-dark-full.png'), fullPage: true });
    console.log('Saved mobile-dark-full.png');

    console.log('All mobile screenshots captured successfully!');
  } finally {
    await browser.close();
  }
})().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
