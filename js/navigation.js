(()=>{
 const home=document.querySelector('.shell'),frame=document.createElement('iframe');
 const topics={'tri-hita-karana':'Tri Hita Karana','nyepi-ogoh-ogoh':'Nyepi & Ogoh-ogoh'};
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
  const key=new URLSearchParams(location.search).get('topic');
  const topic=Object.hasOwn(topics,key);
  home.hidden=topic;frame.hidden=!topic;document.body.classList.toggle('topic-open',topic);fitFrame();
  if(topic){
   const src=key+'.html?embedded=1';
   frame.title='Materi '+topics[key];
   if(frame.dataset.topic!==key){
    // Topic changes belong to the outer history, not a second iframe history entry.
    if(frame.hasAttribute('src'))frame.contentWindow.location.replace(src);
    else frame.src=src;
    frame.dataset.topic=key;
   }
  }
  document.title=topic?topics[key]+' | Bali in Every Corner':'Bali — Pilih ceritamu';
 }
 document.addEventListener('click',event=>{
  const link=event.target.closest('a');if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const url=new URL(link.href);if(url.origin!==location.origin)return;
  const key=url.pathname.split('/').pop().replace(/\.html$/,'');
  const topic=Object.hasOwn(topics,key),back=link.matches('.all-topics,.brand');
  if(!topic&&!back)return;
  event.preventDefault();history.pushState(null,'',topic?'?topic='+key:location.pathname);render();scrollTo(0,0);
  if(topic)frame.focus();else document.querySelector('.slide:not([hidden]) .enter').focus({preventScroll:true});
 });
 addEventListener('popstate',render);render();
})();
