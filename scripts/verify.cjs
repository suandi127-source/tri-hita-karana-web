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
      assert.equal(await page.locator('#g-panel-img').evaluate(image => image.naturalHeight > image.naturalWidth && image.clientHeight > image.clientWidth && image.clientWidth <= image.naturalWidth), true, `${name} must use a portrait image without upscaling`);
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
    assert.equal(await page.locator('[role="tablist"]').getAttribute('aria-orientation'), 'vertical');
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#g-tab-1').getAttribute('aria-selected'), 'true');
    await page.keyboard.press('ArrowUp');
    assert.equal(await page.locator('#g-tab-0').getAttribute('aria-selected'), 'true');

    for (const answer of [1, 1, 2, 0, 2]) {
      assert.equal(await page.locator('.g-answer').count(), 4);
      await page.locator('.g-answer').nth(answer).click();
      await page.locator('.g-next').click();
    }
    assert.equal(await page.locator('.g-result-number').innerText(), '5 / 5');
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
    await page.setViewportSize({ width: 390, height: 670 });
    await page.evaluate(() => scrollTo(0, 0));
    for (const selector of ['.g-hero .g-action', '#g-audio-btn']) {
      const box = await page.locator(selector).boundingBox();
      assert.ok(box.y >= 0 && box.y + box.height <= 670, selector + ' must fit with browser toolbars');
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#g-menu').click();
    assert.equal(await page.locator('#g-menu').getAttribute('aria-expanded'), 'true');
    await page.locator('#g-navigation a').first().focus();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#g-menu').getAttribute('aria-expanded'), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'g-menu');
    assert.equal(await page.locator('[role="tablist"]').getAttribute('aria-orientation'), 'horizontal');

    // Motion must reveal all content, and switching to reduced motion must make it still.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.reload({ waitUntil: 'networkidle' });
    assert.ok(await page.locator('.g-hero-heading h1').evaluate(node => node.getAnimations().length));
    for (const section of ['.g-intro', '#g-explore', '#g-school', '.g-school-list li:last-child', '#g-quiz']) {
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForFunction(selector => !document.querySelector(selector).classList.contains('g-pending'), section);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.g-hero-heading h1').evaluate(node => getComputedStyle(node).animationName), 'none');
    assert.equal(await page.locator('#g-panel-img').evaluate(node => node.getAnimations().length), 0);
    assert.deepEqual(errors, []);
    console.log('PASS: portrait assets without upscaling, tab orientation and keyboard, dialogs, quiz, mobile menu, light/dark, 320-1440px layouts, scroll reveals, and reduced motion.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
