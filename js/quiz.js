// Shared quiz behavior for both lessons; content stays with its lesson.
window.initBaliQuiz = function(root, questions, {animate = () => {}, success = 'Kamu sudah mengenal ketiganya.', closing = 'Jawaban benar. Pilih satu kebiasaan baik dan bawa ke harimu.', trackId = null} = {}) {
 const find=id=>root.querySelector('#'+id);
 const element=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 function icon(name){const i=element('i','fa-solid fa-'+name);i.setAttribute('aria-hidden','true');return i;}
 let step=0,score=0,answered=false,started=false;
 // GoatCounter event tracking: keeps a funnel of quiz starts vs. completions.
 const GOAT='https://baliineverycorner.goatcounter.com';
 function track(kind,title){
   if(!trackId)return;
   let tries=0;
   const send=()=>{
     if(window.goatcounter&&window.goatcounter.count){window.goatcounter.count({path:'kuis-'+kind+'/'+trackId,event:true,title});return;}
     if(++tries<12)setTimeout(send,700);
   };
   send();
 }
 // Public "how many people finished" badge, read straight from the counter endpoint.
 function showCount(){
   if(!trackId)return;
   const badge=document.getElementById('g-quiz-count');
   if(!badge)return;
   fetch(GOAT+'/counter/kuis-selesai/'+encodeURIComponent(trackId)+'.json')
     .then(r=>r.json())
     .then(data=>{
       const n=parseInt((data&&(data.count_unique||data.count))||0,10);
       if(!n||n<1)return;
       const num=document.getElementById('g-quiz-count-num');
       if(num)num.textContent=n.toLocaleString('id-ID');
       badge.hidden=false;
     })
     .catch(()=>{});
 }
 function updateProgress(done){find('g-step').textContent=step<questions.length?'Pertanyaan '+(step+1)+' dari '+questions.length:'Kuis selesai';find('g-score').textContent='Skor '+score;find('g-progress').setAttribute('aria-valuemax',questions.length);find('g-progress').setAttribute('aria-valuenow',done);find('g-progress-fill').style.transform='scaleX('+(done/questions.length)+')';}
 function renderQuestion(withMotion=false){answered=false;const q=questions[step];updateProgress(step);const body=find('g-question-body');body.replaceChildren();const heading=element('h3','g-question',q.question),answers=element('div','g-answers'),feedback=element('p','g-feedback');feedback.hidden=true;feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');const next=element('button','g-action g-next',step===questions.length-1?'Lihat hasil':'Pertanyaan berikutnya');next.type='button';next.disabled=true;next.append(icon('arrow-right'));q.options.forEach((text,i)=>{const b=element('button','g-answer');b.type='button';b.append(element('span','g-answer-letter',String.fromCharCode(65+i)),element('span','',text));b.addEventListener('click',()=>{if(answered)return;answered=true;if(!started){started=true;track('mulai','Mulai kuis');}const correct=i===q.correct;if(correct)score++;Array.from(answers.children).forEach((option,index)=>{option.disabled=true;if(index===q.correct){option.dataset.state='correct';option.append(element('span','g-answer-status','Benar'));}else if(index===i){option.dataset.state='wrong';option.append(element('span','g-answer-status','Pilihanmu'));}});feedback.hidden=false;feedback.textContent=(correct?'Tepat! ':'Belum tepat. ')+q.explanation;animate(feedback,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],450);animate(b,[{transform:'scale(.985)'},{transform:'scale(1)'}],350);next.disabled=false;updateProgress(step+1);next.focus({preventScroll:true});});answers.append(b);});next.addEventListener('click',()=>{step++;if(step===questions.length)renderResult();else renderQuestion(true);find('g-question-body').querySelector('button').focus({preventScroll:true});});body.append(heading,answers,feedback,next);if(withMotion)animate(body,[{opacity:0,transform:'translateX(18px)'},{opacity:1,transform:'translateX(0)'}],500);}
 function renderResult(){track('selesai','Kuis selesai');updateProgress(questions.length);const body=find('g-question-body');body.replaceChildren();body.append(element('h3','g-question',score===questions.length?success:'Terus jelajahi, terus belajar.'),element('p','g-result-number',score+' / '+questions.length),element('p','g-detail-copy',closing));const retry=element('button','g-action g-next','Ulangi kuis');retry.type='button';retry.append(icon('rotate-right'));retry.addEventListener('click',()=>{step=0;score=0;renderQuestion(true);find('g-question-body').querySelector('button').focus({preventScroll:true});});body.append(retry);animate(body,[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],700);}
 renderQuestion();
 showCount();
};
