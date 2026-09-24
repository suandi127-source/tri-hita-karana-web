(()=>{
 const audio=document.getElementById('g-audio-el'),button=document.getElementById('g-audio-btn'),label=document.getElementById('g-audio-label');
 if(!audio||!button)return;
 let saved={},wantPlay=true;
 try{saved=JSON.parse(sessionStorage.getItem('bali-music')||'{}');}catch{}
 wantPlay=saved.playing!==false;audio.volume=.65;
 function save(){try{sessionStorage.setItem('bali-music',JSON.stringify({playing:wantPlay,time:audio.currentTime}));}catch{}}
 function update(){const playing=!audio.paused;button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Jeda musik latar Bali':'Putar musik latar Bali');label.textContent=playing?'Ⅱ Jeda musik':'▶ Putar musik';}
 function stopRetry(){document.removeEventListener('click',retry);document.removeEventListener('keydown',retry);}
 async function play(){try{await audio.play();}catch{update();}}
 function retry(event){if(event.target.closest?.('#g-audio-btn')||!wantPlay)return;if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;play();}
 audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(saved.time)&&saved.time>0&&saved.time<audio.duration)audio.currentTime=saved.time;},{once:true});
 audio.addEventListener('play',()=>{stopRetry();update();});audio.addEventListener('pause',update);
 button.addEventListener('click',()=>{stopRetry();wantPlay=audio.paused;if(wantPlay)play();else audio.pause();save();});
 addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
 if(wantPlay){document.addEventListener('click',retry);document.addEventListener('keydown',retry);play();}else update();
})();
