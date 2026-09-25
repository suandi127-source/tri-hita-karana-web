// Run with npm run dev and the existing Playwright runtime in NODE_PATH.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({headless:true, channel:'msedge', args:['--autoplay-policy=no-user-gesture-required']});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1000}, reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => {
      // Back/Forward can cancel an in-flight frame document; asset failures still fail.
      if(request.isNavigationRequest() && request.failure()?.errorText==='net::ERR_ABORTED') return;
      errors.push(request.url()+' '+request.failure()?.errorText);
    });
    page.on('response', response => {if(response.status() >= 400) errors.push(response.url());});
    assert.equal((await page.goto('http://127.0.0.1:4182/')).status(),200);
    await page.waitForFunction(() => !document.querySelector('audio').paused);
    await page.evaluate(() => {window.originalAudio=document.querySelector('audio'); window.pauses=0; originalAudio.addEventListener('pause',()=>pauses++);});
    await page.locator('#next').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#number').innerText(),'02');
    for(const width of [320,390,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await page.locator('html').evaluate(el=>el.scrollWidth>innerWidth),false,`Topic card overflow at ${width}`);
    }
    await page.setViewportSize({width:390,height:900});
    await page.screenshot({path:'assets/previews/nyepi-topic-card.png',fullPage:true});
    await page.locator('.slide:not([hidden]) .enter').click();
    const frame = page.frameLocator('.topic-frame');
    await frame.locator('#g-title').waitFor();
    assert.match(page.url(),/topic=nyepi-ogoh-ogoh/);
    assert.equal(await frame.locator('.n-placeholder').count(),0);
    assert.equal(await frame.locator('img').count(),2);
    assert.equal(await frame.locator('body').evaluate(el=>/\p{Extended_Pictographic}/u.test(el.innerText)),false);
    for (const [step,answer] of [1,1,2,0,1].entries()) {
      assert.equal(await frame.locator('.g-answer').count(),4);
      assert.equal(await frame.locator('.g-next').isDisabled(),true);
      await frame.locator('.g-answer').nth(answer).focus();
      await page.keyboard.press('Enter');
      assert.equal(await frame.locator('#g-progress').getAttribute('aria-valuenow'),String(step+1));
      assert.match(await frame.locator('.g-feedback').innerText(),/^Tepat!/);
      await frame.locator('.g-next').click();
    }
    assert.equal(await frame.locator('.g-result-number').innerText(),'5 / 5');
    await frame.getByRole('button',{name:'Ulangi kuis'}).click();
    assert.equal(await frame.locator('#g-progress').getAttribute('aria-valuenow'),'0');
    for(let step=0;step<5;step++) {
      await frame.locator('.g-answer').nth([0,0,0,1,0][step]).click();
      assert.match(await frame.locator('.g-feedback').innerText(),/^Belum tepat/);
      await frame.locator('.g-next').click();
    }
    assert.equal(await frame.locator('.g-result-number').innerText(),'0 / 5');
    await frame.getByRole('button',{name:'Ulangi kuis'}).click();
    for(const width of [320,390,430,768,1024,1440]) {
      await page.setViewportSize({width,height:900});
      assert.equal(await frame.locator('html').evaluate(el=>el.scrollWidth>innerWidth),false,`Topic overflow at ${width}`);
      assert.equal(await page.locator('html').evaluate(el=>el.scrollWidth>innerWidth),false,`Shell overflow at ${width}`);
    }
    await page.locator('.all-topics').click();
    assert.equal(await page.evaluate(()=>document.activeElement.closest('.slide').getAttribute('aria-label')),'2 dari 2: Nyepi dan Ogoh-ogoh');
    await page.locator('#prev').click();
    await page.locator('.slide:not([hidden]) .enter').click();
    await frame.locator('#g-tab-1').click();
    assert.equal(await frame.locator('#g-panel-title').innerText(),'Pawongan');
    for(const answer of [1,1,2,0,2]) {await frame.locator('.g-answer').nth(answer).click();await frame.locator('.g-next').click();}
    assert.equal(await frame.locator('.g-result-number').innerText(),'5 / 5');
    await page.goBack();
    await page.goBack();
    await frame.locator('#nyepi-title').waitFor();
    await page.goForward();
    await page.locator('.shell').waitFor();
    await page.goForward();
    await frame.locator('#g-tab-0').waitFor();
    await page.goBack();
    await page.goBack();
    await frame.locator('#nyepi-title').waitFor();
    assert(await page.evaluate(()=>originalAudio===document.querySelector('audio')&&!originalAudio.paused&&pauses===0));
    await page.locator('#g-audio-btn').click();
    await page.locator('.all-topics').click();
    await page.locator('#next').click();
    await page.locator('.slide:not([hidden]) .enter').click();
    await frame.locator('#nyepi-title').waitFor();
    assert(await page.locator('audio').evaluate(a=>a.paused));
    // Direct URLs must resolve into the persistent site shell as well.
    await page.goto('http://127.0.0.1:4182/nyepi-ogoh-ogoh.html');
    await frame.locator('#nyepi-title').waitFor();
    assert.match(page.url(),/index.html\?topic=nyepi-ogoh-ogoh/);
    // Capture the full lesson outside the viewport-sized frame for visual review.
    await page.goto('http://127.0.0.1:4182/nyepi-ogoh-ogoh.html?embedded=1');
    for(const [width,theme,name] of [[1440,'light','nyepi-desktop'],[390,'light','nyepi-mobile'],[390,'dark','nyepi-dark']]) {
      await page.setViewportSize({width,height:900});
      await page.emulateMedia({colorScheme:theme});
      await page.evaluate(()=>document.fonts.ready);
      await page.screenshot({path:`assets/previews/${name}.png`,fullPage:true});
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: both lesson quizzes, correct/wrong/retry, keyboard, 320–1440px, placeholder-only visuals, history/direct URLs, continuous music and explicit pause.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
