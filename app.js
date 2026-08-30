const stories = {
  princess: {theme:'Magical Kingdom',title:'The Princess and the Moon Door',scene:['🌙','🏰','👸🏾'],start:'Princess Amara discovered a mysterious silver door glowing beneath the castle stairs. A tiny dragon whispered, “The moonlight is waiting for someone courageous.”',choices:[{label:'🌲 Follow the moonlit path',text:'Amara stepped through and followed a shimmering path into an enchanted forest. The branches hummed a gentle song and pointed towards a sleepy giant.'},{label:'🗝️ Turn the golden key',text:'Amara turned the ancient key. The whole castle floated into the clouds, where a curious moon fox needed her help finding its family.'}]},
  sport: {theme:'Sporting Heroes',title:'The Last-Minute Goal',scene:['🏟️','⚽','🧑🏾'],start:'Kai heard a thunderous cheer as the championship match began. His enormous team badge sparkled beneath the spectacular stadium lights.',choices:[{label:'⚽ Try the clever pass',text:'Kai spotted a surprising gap and made an extraordinary pass. His teammate raced forward while the crowd counted down.'},{label:'🏃 Dribble towards goal',text:'Kai moved carefully around the final defender. With one courageous kick, the ball curved towards the top corner.'}]},
  space: {theme:'Space Explorers',title:"Milo's Mission to Mars",scene:['🪐','🚀','🧑🏽‍🚀'],start:"Milo fastened his enormous space helmet and checked the rocket's flashing controls. A surprising signal was bouncing all the way from Mars.",choices:[{label:'📡 Answer the signal',text:'Milo answered carefully. A friendly robot appeared on screen and invited him to an extraordinary zero-gravity race.'},{label:'🚀 Blast towards Mars',text:'The rocket zoomed through a spectacular meteor shower. Milo spotted a hidden station sparkling beneath the red dust.'}]},
  dinosaur: {theme:'Dinosaur Island',title:'The Secret Jungle Egg',scene:['🌋','🥚','🦖'],start:'Zuri pushed through the gigantic ferns and found an unusual rainbow egg. Nearby, a gentle dinosaur made a thunderous worried sound.',choices:[{label:'🥚 Protect the egg',text:'Zuri built a shelter from enormous leaves. Soon the egg cracked and a magnificent baby dinosaur peeped out.'},{label:'🔎 Search for its family',text:'Zuri followed some mysterious footprints across the island and discovered a peaceful valley full of dinosaurs.'}]}
};

const phonics={mysterious:'mys–TEER–ee–us',courageous:'kuh–RAY–jus',shimmering:'SHIM–er–ing',enchanted:'en–CHAN–tid',ancient:'AYN–shunt',curious:'KYOOR–ee–us',enormous:'ih–NOR–mus',surprising:'ser–PRY–zing',extraordinary:'ik–STROR–din–air–ee',spectacular:'spek–TAK–yuh–ler',gigantic:'jy–GAN–tik',unusual:'un–YOO–zhoo–ul',thunderous:'THUN–der–us',magnificent:'mag–NIF–ih–sunt',discovered:'dis–KUV–erd',carefully:'KAIR–fuh–lee',peaceful:'PEES–ful',championship:'CHAM–pee–un–ship',defender:'dee–FEN–der'};
function dateKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`}
const today=dateKey();const yesterdayDate=new Date();yesterdayDate.setDate(yesterdayDate.getDate()-1);const yesterday=dateKey(yesterdayDate);
const storedDay=localStorage.getItem('meehee-reading-day');
const savedRewards=JSON.parse(localStorage.getItem('meehee-rewards')||'[]').map(reward=>typeof reward==='string'?{name:reward,cost:100}:reward);
const lastCompleted=localStorage.getItem('meehee-last-goal-date')||'';const savedStreak=Number(localStorage.getItem('meehee-streak')||0);
const state={
  stars:Number(localStorage.getItem('meehee-stars')||120), words:JSON.parse(localStorage.getItem('meehee-words')||'[]'),
  stories:Number(localStorage.getItem('meehee-stories')||0), seconds:storedDay===today?Number(localStorage.getItem('meehee-reading-seconds')||0):0,
  rewarded:storedDay===today&&localStorage.getItem('meehee-mission-rewarded')==='yes', rewards:savedRewards,
  hiddenRewards:JSON.parse(localStorage.getItem('meehee-hidden-rewards')||'[]'),
  streak:lastCompleted===today||lastCompleted===yesterday?savedStreak:0,lastCompleted,
  profile:localStorage.getItem('meehee-profile')||'princess', current:null
};
const storyModal=document.querySelector('#story-modal'),panelModal=document.querySelector('#panel-modal'),storyText=document.querySelector('#story-text'),choices=document.querySelector('#choice-area');

function formatTime(seconds){const mins=Math.floor(seconds/60);return `${mins}:${String(seconds%60).padStart(2,'0')}`}
function updateTimer(){
  document.querySelector('#reading-time').textContent=`${formatTime(state.seconds)} of 10:00`;
  document.querySelector('#mission-progress').style.width=`${Math.min(100,state.seconds/6)}%`;
  if(state.seconds>=600&&!state.rewarded){state.stars+=30;state.rewarded=true;completeDailyGoal();save()}
}
function completeDailyGoal(){if(state.lastCompleted===today)return;state.streak=state.lastCompleted===yesterday?state.streak+1:1;state.lastCompleted=today}
function save(){
  localStorage.setItem('meehee-stars',state.stars);localStorage.setItem('meehee-words',JSON.stringify(state.words));localStorage.setItem('meehee-stories',state.stories);
  localStorage.setItem('meehee-reading-day',today);localStorage.setItem('meehee-reading-seconds',state.seconds);localStorage.setItem('meehee-mission-rewarded',state.rewarded?'yes':'no');
  localStorage.setItem('meehee-rewards',JSON.stringify(state.rewards));localStorage.setItem('meehee-hidden-rewards',JSON.stringify(state.hiddenRewards));localStorage.setItem('meehee-profile',state.profile);localStorage.setItem('meehee-streak',state.streak);localStorage.setItem('meehee-last-goal-date',state.lastCompleted);
  document.querySelector('#star-count').textContent=state.stars;document.querySelector('#reader-stars').textContent=state.stars;document.querySelector('#word-summary').textContent=`${state.words.length} word${state.words.length===1?'':'s'} saved`;updateTimer();
  document.querySelector('#streak-count').textContent=state.streak;
}

setInterval(()=>{if(!storyModal.hidden&&!document.hidden){state.seconds+=1;updateTimer();if(state.seconds%5===0)save()}},1000);
window.addEventListener('beforeunload',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});
function openModal(modal){modal.hidden=false;document.body.classList.add('modal-open')}
function closeModals(){save();storyModal.hidden=true;panelModal.hidden=true;document.body.classList.remove('modal-open')}
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeModals));document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModals()}));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModals()});

function wordify(text){return text.split(/(\s+)/).map(part=>{const clean=part.toLowerCase().replace(/[^a-z]/g,'');return phonics[clean]?`<button class="word ${state.words.includes(clean)?'learned':''}" data-word="${clean}">${part}</button>`:part}).join('')}
function bindWords(){storyText.querySelectorAll('.word').forEach(button=>button.addEventListener('click',()=>helpWord(button.dataset.word,button)))}
function speak(word,slow=false){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(word);voice.rate=slow?.55:.82;voice.pitch=1.05;speechSynthesis.speak(voice)}
function helpWord(word,button){if(!state.words.includes(word)){state.words.push(word);button.classList.add('learned');state.stars+=2;save()}document.querySelector('.phonics-pop')?.remove();const pop=document.createElement('div');pop.className='phonics-pop';pop.innerHTML=`<span>🔊</span><div><small>Sound it out</small><br><strong>${phonics[word]}</strong></div><button>Hear “${word}”</button>`;pop.querySelector('button').addEventListener('click',()=>speak(word,true));storyText.after(pop);speak(word)}
function openStory(key){const story=stories[key];state.current=key;document.querySelector('#story-theme').textContent=story.theme;document.querySelector('#story-title').textContent=story.title;document.querySelector('#story-scene').innerHTML=story.scene.map(x=>`<span aria-hidden="true">${x}</span>`).join('');storyText.innerHTML=wordify(story.start);choices.innerHTML=`<p>What should happen next?</p>${story.choices.map((c,i)=>`<button class="choice" data-choice="${i}">${c.label}</button>`).join('')}`;choices.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',()=>continueStory(Number(b.dataset.choice))));bindWords();openModal(storyModal)}
function continueStory(index){const ending=stories[state.current].choices[index];storyText.innerHTML=wordify(ending.text);bindWords();choices.innerHTML='<p>Brilliant choice! You changed the story.</p><button class="choice finish">Finish story and collect 20 stars ⭐</button>';choices.querySelector('.finish').addEventListener('click',finishStory)}
function finishStory(){state.stars+=20;state.stories+=1;save();closeModals();showPanel('words')}
document.querySelectorAll('.story-card').forEach(card=>card.querySelector('button').addEventListener('click',()=>openStory(card.dataset.story)));document.querySelector('#start-story').addEventListener('click',()=>document.querySelector('.stories').scrollIntoView({behavior:'smooth'}));

function applyProfile(profile){
  state.profile=profile;const sport=profile==='sport';document.body.classList.toggle('sport-mode',sport);
  document.querySelector('.avatar').textContent=sport?'⚽':'ME';document.querySelector('#hero-icon').textContent=sport?'⚽':'🏰';
  document.querySelector('#hero-eyebrow').textContent=sport?'Your next sporting adventure':'Your next reading adventure';
  document.querySelector('#hero-title').innerHTML=sport?'Ready to <span>read, play and score?</span>':'Where will your <span>imagination</span> take you?';
  document.querySelector('#hero-description').textContent=sport?'Choose a challenge, tap tricky words for help, and make choices that lead your team to victory.':'Choose a story, tap tricky words for help, and make choices that change what happens next.';
  const card=document.querySelector('#featured-story');card.dataset.story=sport?'sport':'princess';document.querySelector('#featured-emoji').textContent=sport?'⚽🏃🏾':'👸🏾';document.querySelector('#featured-theme').textContent=sport?'Sporting Heroes':'Magical Kingdom';document.querySelector('#featured-title').textContent=sport?'The Last-Minute Goal':'The Princess and the Moon Door';save();
}

function profileChooser(){return `<div class="profile-choice"><button class="profile-option ${state.profile==='princess'?'selected':''}" data-profile="princess"><span>👧🏾</span>Girl adventures<small>Magic and princess stories</small></button><button class="profile-option ${state.profile==='sport'?'selected':''}" data-profile="sport"><span>⚽</span>Boy adventures<small>Sport and team challenges</small></button></div>`}
function bindProfileButtons(){document.querySelectorAll('[data-profile]').forEach(button=>button.addEventListener('click',()=>{applyProfile(button.dataset.profile);showPanel('parents')}))}
function verifyParent(){const entered=window.prompt('Grown-up password:');if(entered===null)return false;if(entered!=='Parent'){window.alert('That password is not correct. Please ask a grown-up.');return false}return true}
function removeWord(word){if(!verifyParent())return;state.words=state.words.filter(saved=>saved!==word);save();showPanel('words')}
function removeReward(kind,id){if(!verifyParent())return;if(kind==='built-in')state.hiddenRewards.push(id);else state.rewards.splice(Number(id),1);save();showPanel('rewards')}
function redeemReward(name,cost){if(!verifyParent())return;if(state.stars<cost){window.alert('There are not enough stars for this reward yet.');return}if(!window.confirm(`Approve “${name}” for ${cost} stars?`))return;state.stars-=cost;save();showPanel('rewards');window.alert(`${name} approved! ${cost} stars have been used.`)}
function showPanel(type){
  const panel=document.querySelector('#panel-content');
  if(type==='words'){
    panel.innerHTML=`<p class="eyebrow">Your reading toolkit</p><h2 id="panel-title">My tricky words</h2><p class="panel-intro">Tap a word to hear it again. Removing words needs the grown-up password.</p>${state.words.length?`<div class="word-list">${state.words.map(w=>`<div class="saved-word"><span>🔤</span><div><strong>${w}</strong><small>${phonics[w]}</small></div><div class="row-actions"><button data-speak="${w}">🔊 Hear</button><button class="remove-button" data-remove-word="${w}">Remove</button></div></div>`).join('')}</div>`:'<div class="empty-state">📖<br>Tap a highlighted word inside a story and it will appear here.</div>'}`;panel.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak,true)));panel.querySelectorAll('[data-remove-word]').forEach(b=>b.addEventListener('click',()=>removeWord(b.dataset.removeWord)));
  }else if(type==='rewards'){
    const builtIns=[{id:'treat',icon:'🍬',name:'A shop treat',cost:80},{id:'money',icon:'💰',name:'Pocket money bonus',cost:150},{id:'film',icon:'🎬',name:'Choose family film',cost:200}].filter(r=>!state.hiddenRewards.includes(r.id));
    const rewards=[...builtIns.map(r=>({...r,kind:'built-in'})),...state.rewards.map((r,index)=>({id:String(index),icon:'🎁',name:r.name,cost:r.cost,kind:'custom'}))];panel.innerHTML=`<p class="eyebrow">Stars become smiles</p><h2 id="panel-title">My rewards</h2><p class="panel-intro">You have <strong>${state.stars} stars</strong>. Approval and removal both need the grown-up password.</p><div class="reward-list">${rewards.map(r=>`<div class="reward-row"><span>${r.icon}</span><div><strong>${r.name}</strong><small>${r.cost} stars</small></div><div class="row-actions"><button class="claim-button" data-claim="${r.id}" ${state.stars<r.cost?'disabled':''}>${state.stars>=r.cost?'Ask grown-up':'Keep reading'}</button><button class="remove-button" data-remove-reward="${r.id}" data-kind="${r.kind}">Remove</button></div></div>`).join('')}</div>`;
    panel.querySelectorAll('[data-claim]').forEach(button=>{const reward=rewards.find(r=>r.id===button.dataset.claim);button.addEventListener('click',()=>redeemReward(reward.name,reward.cost))});panel.querySelectorAll('[data-remove-reward]').forEach(button=>button.addEventListener('click',()=>removeReward(button.dataset.kind,button.dataset.removeReward)));
  }else{
    panel.innerHTML=`<p class="eyebrow">Choose your style</p><h2 id="panel-title">My profile</h2><p class="panel-intro">Pick the kind of reading world you would like to see.</p>${profileChooser()}<p class="eyebrow">Grown-up view</p><h2>MeeHee's progress</h2><div class="parent-code"><small>Progress proof code</small><strong>ME-${state.stories+24}R</strong><small>Changes as stories are completed</small></div><div class="stat-grid"><div class="stat"><strong>${state.stories}</strong><small>stories finished</small></div><div class="stat"><strong>${formatTime(state.seconds)}</strong><small>reading today</small></div><div class="stat"><strong>${state.words.length}</strong><small>words practised</small></div></div><p class="timer-note">Reading time counts only while a story is open and visible. A 10-minute day keeps the streak going.</p><label class="form-label" for="reward-name">Add a family reward</label><form class="custom-reward"><input id="reward-name" required maxlength="40" aria-label="Custom reward" placeholder="e.g. Choose Friday's dinner"><input class="reward-cost" required type="number" min="1" max="9999" step="1" aria-label="Stars needed" placeholder="Stars needed"><button>Add reward</button></form><small class="reward-help">Choose any value from 1 to 9,999 stars.</small>`;bindProfileButtons();panel.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const name=e.currentTarget.querySelector('#reward-name').value.trim();const cost=Number(e.currentTarget.querySelector('.reward-cost').value);if(!name||!Number.isInteger(cost)||cost<1||cost>9999)return;state.rewards.push({name,cost});save();showPanel('rewards')});
  }openModal(panelModal)
}
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>showPanel(button.dataset.open)));document.querySelector('.avatar').addEventListener('click',()=>showPanel('parents'));applyProfile(state.profile);

