(()=>{
const root=document.getElementById('thk-green');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function animate(node,frames,duration=600){
  if(reduced.matches||!node.animate)return;
  node.getAnimations().forEach(animation=>animation.cancel());
  return node.animate(frames,{duration,easing:'cubic-bezier(.22,1,.36,1)'});
}
initBaliQuiz(root, [
  {question:'Kapan Nyepi dirayakan?', options:['Tahun Baru Masehi','Tahun Baru Saka','Hari Galungan','Hari Kuningan'], correct:1, explanation:'Nyepi menandai pergantian Tahun Baru Saka.'},
  {question:'Apa yang dimaksud Amati Lelunganan?', options:['Tidak bekerja','Tidak bepergian','Tidak menyalakan api','Tidak menghibur diri'], correct:1, explanation:'Amati Lelunganan berarti tidak bepergian selama Nyepi.'},
  {question:'Ogoh-ogoh umumnya menggambarkan...', options:['Pahlawan Bali','Dewa','Bhuta Kala','Tokoh kerajaan'], correct:2, explanation:'Bhuta Kala melambangkan kekuatan atau sifat negatif yang perlu dikendalikan.'},
  {question:'Ogoh-ogoh biasanya diarak pada rangkaian...', options:['Pengerupukan','Galungan','Kuningan','Saraswati'], correct:0, explanation:'Pawai ogoh-ogoh menjadi bagian dari rangkaian Pengerupukan, sehari sebelum Nyepi.'},
  {question:'Apa pesan yang bisa kita ambil dari Nyepi?', options:['Bersenang-senang','Pengendalian diri dan introspeksi','Berkompetisi','Bepergian bersama'], correct:1, explanation:'Nyepi mengajarkan introspeksi dan pengendalian diri, serta keseimbangan dengan lingkungan.'}
], {
  animate,
  success:'Kamu sudah mengenal Nyepi & Ogoh-ogoh.',
  closing:'Jawaban benar. Bawa semangat introspeksi dan pengendalian diri ke keseharianmu.'
});

// Reveal individual reading blocks once, so long chapters stay paced on mobile.
if('IntersectionObserver' in window&&!reduced.matches){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.remove('g-pending');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.06});
  root.querySelectorAll('.n-chapter-heading, .n-copy > :not(.n-brata), .n-brata > div, .n-pause > p, .g-quiz-intro, .g-quiz-box, .g-footer').forEach(node=>{
    node.classList.add('g-reveal','g-pending');
    observer.observe(node);
  });
  root.addEventListener('focusin',event=>{
    const block=event.target.closest('.g-pending');
    if(block){block.classList.remove('g-pending');observer.unobserve(block);}
  });
  reduced.addEventListener('change',()=>{
    if(reduced.matches){
      observer.disconnect();
      root.querySelectorAll('.g-pending').forEach(node=>node.classList.remove('g-pending'));
    }
  });
}
reduced.addEventListener('change',()=>{
  if(reduced.matches)root.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
});
})();
