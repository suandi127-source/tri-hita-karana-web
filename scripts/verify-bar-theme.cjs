// Run against the preview server with Playwright available in NODE_PATH.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4182/');
  async function checkTheme(topic){
   await page.waitForFunction(topic=>{
    const frame=document.querySelector('iframe');
    const source=topic?frame.contentDocument?.querySelector('#thk-green'):document.body;
    if(!source)return false;
    const bar=getComputedStyle(document.querySelector('.site-bar')),style=getComputedStyle(source);
    return bar.backgroundColor===style.backgroundColor&&bar.color===style.color;
   },topic);
  }
  await checkTheme(false);
  for(const topic of ['tri-hita-karana','nyepi-ogoh-ogoh']){
   if(topic==='nyepi-ogoh-ogoh')await page.locator('#next').click();
   await page.locator('.slide:not([hidden]) .enter').click();
   await page.frameLocator('iframe').locator('#g-title').waitFor();
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:900});
    for(const colorScheme of ['light','dark']){
     await page.emulateMedia({colorScheme});
     await checkTheme(true);
     await page.locator('.all-topics').hover();
     const colors=await page.locator('.all-topics').evaluate(el=>({text:getComputedStyle(el).color,bg:getComputedStyle(el.parentElement).backgroundColor}));
     assert.notEqual(colors.text,colors.bg);
    }
   }
   if(topic==='nyepi-ogoh-ogoh')await page.screenshot({path:'assets/previews/nyepi-bar-dark.png'});
   await page.locator('.all-topics').click();
   await checkTheme(false);
   await page.goBack();
   await checkTheme(true);
   await page.goForward();
   await checkTheme(false);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: header matches both lessons and homepage across light/dark, desktop/mobile, theme changes and Back/Forward.');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
