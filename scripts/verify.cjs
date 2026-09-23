// Run with the preview server active and Playwright available in NODE_PATH.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.platform === 'win32' ? { channel: 'msedge' } : {})
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.url()));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    assert.equal((await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:4182', { waitUntil: 'networkidle' })).status(), 200);
    assert.equal(await page.title(), 'Bali in Every Corner | Tri Hita Karana');
    assert.equal(await page.locator('h1').count(), 1);
    assert.match(await page.locator('#g-school').innerText(), /Berdoa sebelum belajar/);
    await page.evaluate(() => document.fonts.ready);

    for (const [index, name] of ['Parahyangan', 'Pawongan', 'Palemahan'].entries()) {
      await page.locator(`#g-tab-${index}`).click();
      assert.match(await page.locator('#g-panel-title').innerText(), new RegExp(name));
      assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
      await page.locator('#g-panel-img').evaluate(image => image.decode());
      await page.locator('#g-read').click();
      assert.equal(await page.locator('#g-dialog-title').innerText(), name);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#g-dialog').evaluate(dialog => dialog.open), false);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'g-read');
    }
    await page.locator('#g-tab-2').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#g-tab-0').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('#g-tab-2').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#g-tab-0').getAttribute('aria-selected'), 'true');

    for (const answer of [1, 0, 1]) {
      await page.locator('.g-answer').nth(answer).click();
      await page.locator('.g-next').click();
    }
    assert.equal(await page.locator('.g-result-number').innerText(), '3 / 3');
    await page.getByRole('button', { name: 'Ulangi kuis' }).click();
    await page.locator('.g-answer').nth(0).click();
    assert.match(await page.locator('.g-feedback').innerText(), /Belum tepat/);
    assert.equal(await page.locator('#g-score').innerText(), 'Skor 0');

    // Reload the initial state for shareable desktop, mobile, and dark previews.
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    for (const [width, theme, filename] of [
      [1440, 'light', 'desktop-preview.png'],
      [390, 'light', 'mobile-preview.png'],
      [1440, 'dark', 'dark-preview.png'],
      [320, 'light', null], [768, 'light', null], [1024, 'light', null]
    ]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme: theme });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `Overflow at ${width}px`);
      if (filename) await page.screenshot({ path: `assets/previews/${filename}`, fullPage: true });
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#g-menu').click();
    assert.equal(await page.locator('#g-menu').getAttribute('aria-expanded'), 'true');
    await page.locator('#g-navigation a').first().focus();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#g-menu').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'g-menu');
    assert.deepEqual(errors, []);
    console.log('PASS: content, local assets, tabs, keyboard, dialogs, quiz, mobile menu, light/dark, and layouts from 320 to 1440px.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
