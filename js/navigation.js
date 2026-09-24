(()=>{
 const home=document.querySelector('.shell'),frame=document.createElement('iframe');
 frame.title='Materi Tri Hita Karana';frame.className='topic-frame';frame.hidden=true;
 // Critical sizing must also work when a phone still has an older stylesheet cached.
 frame.style.cssText='display:block;width:100%;border:0;outline:none;background:#f5f1e8';
 const bar=document.querySelector('.site-bar');
 function fitFrame(){frame.style.height=Math.max(0,innerHeight-bar.getBoundingClientRect().height)+'px';}
 addEventListener('resize',fitFrame);
 new ResizeObserver(fitFrame).observe(bar);
 frame.addEventListener('load',()=>{
  const doc=frame.contentDocument;
  doc.addEventListener('click',()=>window.startBaliMusic?.());
  doc.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key))window.startBaliMusic?.();});
 });
 document.body.append(frame);
 function render(){
  const topic=new URLSearchParams(location.search).get('topic')==='tri-hita-karana';
  home.hidden=topic;frame.hidden=!topic;document.body.classList.toggle('topic-open',topic);fitFrame();
  if(topic&&!frame.hasAttribute('src'))frame.src='tri-hita-karana.html?embedded=1';
  document.title=topic?'Tri Hita Karana | Bali in Every Corner':'Bali — Pilih ceritamu';
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest('a');if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(link.href);if(url.origin!==location.origin)return;
  const topic=/\/tri-hita-karana(?:\.html)?$/.test(url.pathname),back=link.matches('.all-topics,.brand');
  if(!topic&&!back)return;
  event.preventDefault();history.pushState(null,'',topic?'?topic=tri-hita-karana':location.pathname);render();scrollTo(0,0);
  if(topic)frame.focus();else document.querySelector('.enter').focus({preventScroll:true});
 });
 addEventListener('popstate',render);render();
})();
