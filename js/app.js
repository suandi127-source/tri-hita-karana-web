
(()=>{
 const root=document.getElementById('thk-green');
 const find=id=>root.querySelector('#'+id);
 const data={
  pillars:[
   {name:'Parahyangan',relation:'Hubungan manusia dengan Tuhan',title:'Parahyangan',message:'Memberi ruang untuk rasa syukur.',summary:'Hubungan harmonis antara manusia dengan Tuhan.',examples:['Berdoa','Beribadah','Menjalankan ajaran agama'],image:'Prahyangan/premium_photo-1677829177960-6f414a5393ce.avif',alt:'Sesaji dan ukiran kayu di dalam bangunan suci Bali',caption:'Ruang untuk doa dan rasa syukur.',position:'50% 50%',paragraphs:['Parahyangan berbicara tentang keharmonisan hubungan manusia dengan Tuhan. Dalam kehidupan masyarakat Hindu Bali, hubungan ini hadir melalui doa, rasa syukur, dan praktik keagamaan.','Penerapannya bukan hanya tentang upacara. Kesadaran untuk menghormati kehidupan dan menjalankan keyakinan dengan tulus juga memberi ruang bagi hubungan spiritual.'],practice:'Luangkan waktu hening untuk berdoa sesuai keyakinan dan mensyukuri satu hal sederhana hari ini.'},
   {name:'Pawongan',relation:'Hubungan manusia dengan sesama',title:'Pawongan',message:'Kebaikan tumbuh saat dibagikan.',summary:'Hubungan harmonis antara manusia dengan sesama.',examples:['Saling menghargai','Membantu satu sama lain','Bekerja sama','Menjaga kerukunan'],image:'assets/images/pawongan-portrait.webp',alt:'Ilustrasi AI warga saling membantu menata keranjang di halaman bangunan Bali',caption:'Saling membantu, dalam hal sederhana.',position:'50% 50%',paragraphs:['Pawongan menekankan hubungan yang harmonis antarmanusia. Kehidupan bersama membutuhkan rasa saling menghormati, komunikasi, dan kemauan untuk bekerja sama.','Gotong royong menjadi contoh yang mudah ditemui. Setiap orang memberi kontribusi sesuai kemampuan, dengan kepentingan bersama sebagai tujuan.'],practice:'Tawarkan bantuan kepada seseorang di sekitarmu atau luangkan waktu untuk benar-benar mendengarkan ceritanya.'},
   {name:'Palemahan',relation:'Hubungan manusia dengan lingkungan',title:'Palemahan',message:'Merawat alam, merawat kehidupan.',summary:'Hubungan harmonis antara manusia dengan lingkungan.',examples:['Menjaga kebersihan','Membuang sampah pada tempatnya','Merawat tanaman','Menjaga alam'],image:'assets/images/bali-portrait.webp',alt:'Ilustrasi AI sawah berundak dengan aliran air dan pepohonan di Bali',caption:'Alam yang dirawat, kehidupan yang terjaga.',position:'50% 55%',paragraphs:['Palemahan mengajak manusia menjaga hubungan yang harmonis dengan lingkungan. Alam mendukung kehidupan melalui air, pangan, udara, dan ruang untuk tumbuh.','Menghemat sumber daya serta merawat lingkungan dapat dimulai dari rumah. Kebiasaan kecil yang dilakukan bersama membantu menjaga keseimbangan.'],practice:'Bawa botol minum sendiri dan perhatikan satu kebiasaan yang bisa mengurangi pemborosan air hari ini.'}
  ],
  quiz:[
  {
    "question": "Apa yang dimaksud dengan Tri Hita Karana?",
    "options": [
      "Tiga jenis upacara dalam agama Hindu",
      "Tiga hubungan harmonis dalam kehidupan",
      "Tiga aturan dalam kehidupan masyarakat Bali",
      "Tiga tradisi utama masyarakat Bali"
    ],
    "correct": 1,
    "explanation": "Tri Hita Karana mengajarkan tiga hubungan harmonis: dengan Tuhan, sesama manusia, dan lingkungan."
  },
  {
    "question": "Sikap menghormati dan membantu teman merupakan contoh penerapan…",
    "options": [
      "Parahyangan",
      "Pawongan",
      "Palemahan",
      "Parahyangan dan Palemahan"
    ],
    "correct": 1,
    "explanation": "Menghormati dan membantu teman mencerminkan Pawongan, yaitu hubungan harmonis dengan sesama manusia."
  },
  {
    "question": "Menjaga kebersihan lingkungan sekolah termasuk penerapan…",
    "options": [
      "Parahyangan",
      "Pawongan",
      "Palemahan",
      "Semua benar"
    ],
    "correct": 2,
    "explanation": "Menjaga kebersihan lingkungan sekolah mencerminkan Palemahan, yaitu hubungan harmonis dengan lingkungan."
  },
  {
    "question": "Berdoa sebelum memulai pembelajaran merupakan contoh…",
    "options": [
      "Parahyangan",
      "Pawongan",
      "Palemahan",
      "Pawongan dan Palemahan"
    ],
    "correct": 0,
    "explanation": "Berdoa sebelum belajar mencerminkan Parahyangan, yaitu hubungan harmonis dengan Tuhan."
  },
  {
    "question": "Manakah tindakan yang paling tepat untuk menerapkan Tri Hita Karana di sekolah?",
    "options": [
      "Menjaga kebersihan tetapi tidak peduli dengan teman",
      "Hanya mengikuti kegiatan keagamaan",
      "Menghormati sesama, menjaga lingkungan, dan menjalankan kewajiban kepada Tuhan",
      "Mengikuti kegiatan sekolah hanya untuk mendapatkan nilai"
    ],
    "correct": 2,
    "explanation": "Ketiga hubungan dijalankan bersama: menghormati sesama, merawat lingkungan, dan menjalankan kewajiban kepada Tuhan."
  }
]
 };
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const design={motion:'flow',appearance:'auto'};
 function animate(node,frames,duration=600){if(reduced.matches||design.motion==='off'||!node.animate)return null;node.getAnimations().forEach(a=>a.cancel());return node.animate(frames,{duration:design.motion==='gentle'?duration*.75:duration,easing:'cubic-bezier(.22,1,.36,1)'});}
 const element=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function icon(name){const i=element('i','fa-solid fa-'+name);i.setAttribute('aria-hidden','true');return i;}
 const tabs=Array.from(root.querySelectorAll('.g-tab'));
 let selected=0;
 function selectPillar(index,withMotion=true){selected=index;const p=data.pillars[index];tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});find('g-panel').setAttribute('aria-labelledby','g-tab-'+index);find('g-relation').textContent=p.relation;find('g-panel-title').textContent=p.title;find('g-panel-message').textContent=p.message;find('g-panel-caption').textContent=p.caption;find('g-panel-summary').textContent=p.summary;find('g-panel-img').src=p.image;find('g-panel-img').alt=p.alt;find('g-panel-img').style.objectPosition=p.position;find('g-examples').replaceChildren(...p.examples.map(text=>{const line=element('li','g-example');line.append(icon('check'),document.createTextNode(text));return line;}));find('g-read').setAttribute('aria-label','Selami makna '+p.name);if(withMotion){animate(find('g-panel-body'),[{opacity:.15,transform:'translateY(13px)'},{opacity:1,transform:'translateY(0)'}]);animate(find('g-panel-img'),[{opacity:.6,transform:'scale(1.045)'},{opacity:1,transform:'scale(1)'}],850);}}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{if(i!==selected)selectPillar(i);});tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(i+1)%3;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(i+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();selectPillar(next);tabs[next].focus();}});});
 const tabLayout=matchMedia('(min-width: 1100px)');
 const updateTabOrientation=()=>root.querySelector('.g-tabs').setAttribute('aria-orientation',tabLayout.matches?'vertical':'horizontal');
 updateTabOrientation();tabLayout.addEventListener('change',updateTabOrientation);
 selectPillar(0,false);
 const dialog=find('g-dialog');let closing=false;
 find('g-read').addEventListener('click',()=>{const p=data.pillars[selected];find('g-dialog-title').textContent=p.name;find('g-dialog-relation').textContent=p.relation;find('g-dialog-copy').replaceChildren(...p.paragraphs.map(text=>element('p','g-detail-copy',text)));find('g-practice').textContent=p.practice;dialog.showModal();animate(dialog,[{opacity:0,transform:'translateY(24px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],500);});
 async function closeDialog(){if(closing)return;closing=true;const a=animate(dialog,[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(12px) scale(.98)'}],220);if(a)await a.finished.catch(()=>{});dialog.close();closing=false;}
 find('g-close').addEventListener('click',closeDialog);dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
 const menu=find('g-menu'),nav=find('g-navigation');
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Tutup':'Menu';nav.classList.toggle('g-open',open);if(open)animate(nav,[{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],350);});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('g-open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu';menu.focus();}});
 root.querySelectorAll('a[href^="#g-"]').forEach(link=>link.addEventListener('click',e=>{const target=root.querySelector(link.getAttribute('href'));if(!target)return;e.preventDefault();nav.classList.remove('g-open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu';if(!target.hasAttribute('tabindex'))target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView({behavior:reduced.matches||design.motion==='off'?'instant':'smooth',block:'start'});}));
 initBaliQuiz(root, data.quiz, {animate});
 if('IntersectionObserver'in window&&!reduced.matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('g-pending');observer.unobserve(entry.target);}});},{threshold:.06});root.querySelectorAll('.g-reveal, .g-school-list li').forEach(n=>{n.classList.add('g-reveal','g-pending');observer.observe(n);});}
 function updateMotion(){root.style.colorScheme=design.appearance==='auto'?'':design.appearance;root.style.setProperty('--g-duration',design.motion==='off'?'0ms':design.motion==='gentle'?'450ms':'650ms');root.querySelectorAll('.g-pending').forEach(n=>n.classList.remove('g-pending'));root.dataset.motion=design.motion;if(design.motion==='off')root.getAnimations({subtree:true}).forEach(a=>a.cancel());}
 if(globalThis.Tweak){const tweak=new Tweak({container:root,onChange:updateMotion});tweak.addSelect(design,'appearance',{label:'Tampilan hijau',options:[{label:'Ikuti perangkat',value:'auto'},{label:'Hijau terang',value:'light'},{label:'Hijau hutan gelap',value:'dark'}]});tweak.addSelect(design,'motion',{label:'Gerakan',options:[{label:'Mengalir',value:'flow'},{label:'Lebih tenang',value:'gentle'},{label:'Tanpa animasi',value:'off'}]});}
})();
