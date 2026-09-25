const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try {
    const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    const url='http://127.0.0.1:4182/nyepi-ogoh-ogoh.html?embedded=1';
    await page.goto(url);
    const entrance=await page.locator('.n-hero > div > *').evaluateAll(nodes=>nodes.map(node=>({name:getComputedStyle(node).animationName,delay:getComputedStyle(node).animationDelay})));
    assert(entrance.every(item=>item.name==='g-enter'));
    assert.deepEqual(entrance.map(item=>item.delay),['0s','0.08s','0.16s','0.24s','0.32s']);
    assert.equal(await page.locator('#ogoh-ogoh .n-copy > p').first().evaluate(node=>node.classList.contains('g-pending')),true);
    // Every block becomes fully readable, then stays revealed when scrolling back.
    const blocks=page.locator('.g-reveal');
    for(let i=0;i<await blocks.count();i++){
      const block=blocks.nth(i);
      await block.scrollIntoViewIfNeeded();
      await page.waitForFunction(index=>!document.querySelectorAll('.g-reveal')[index].classList.contains('g-pending'),i);
    }
    assert.equal(await page.locator('.g-pending').count(),0);
    await page.locator('#g-title').scrollIntoViewIfNeeded();
    assert.equal(await page.locator('.g-pending').count(),0);
    await page.locator('.g-answer').nth(1).click();
    assert.match(await page.locator('.g-feedback').innerText(),/^Tepat!/);
    await page.locator('.g-next').click();
    assert(await page.locator('#g-question-body').evaluate(node=>node.getAnimations().length>0));
    // Switching the preference while animation is running cancels JS motion too.
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>document.getElementById('thk-green').getAnimations({subtree:true}).length===0);
    assert.equal(await page.locator('html').evaluate(node=>getComputedStyle(node).scrollBehavior),'auto');
    await page.reload();
    assert.equal(await page.locator('.g-pending').count(),0);
    assert.equal(await page.locator('#g-title').evaluate(node=>getComputedStyle(node).animationName),'none');
    for(const answer of [1,1,2,0,1]){await page.locator('.g-answer').nth(answer).click();await page.locator('.g-next').click();}
    assert.equal(await page.locator('.g-result-number').innerText(),'5 / 5');
    await page.getByRole('button',{name:'Ulangi kuis'}).click();
    assert.equal(await page.locator('#g-score').innerText(),'Skor 0');
    // Preference changes clear offscreen pending content permanently.
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.goto(url);
    assert(await page.locator('.g-pending').count()>0);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>!document.querySelector('.g-pending'));
    await page.emulateMedia({reducedMotion:'no-preference'});
    assert.equal(await page.locator('.g-pending').count(),0);
    // Keyboard focus into a block never leaves an invisible focused control.
    await page.goto(url);
    await page.locator('.g-answer').first().focus();
    assert.equal(await page.locator('.g-quiz-box').evaluate(node=>node.classList.contains('g-pending')),false);
    await page.setViewportSize({width:1440,height:900});
    await page.goto(url);
    assert.equal(await page.locator('#g-title').evaluate(node=>getComputedStyle(node).animationName),'g-enter');
    assert.equal(await page.locator('html').evaluate(node=>node.scrollWidth>innerWidth),false);
    assert.deepEqual(errors,[]);
    console.log('PASS: staggered hero, one-shot reading reveals, quiz transitions, keyboard focus and reduced-motion load/live changes, mobile and desktop.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
