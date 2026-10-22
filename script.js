(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =====================================================================
     ALL YOUR CONTENT LIVES HERE. Edit text in this block only.
     Photos: put them next to index.html or inside an "album" folder.
       roles:  role-student.jpg, role-writer.jpg, role-council.jpg, role-lector.jpg
       album:  kdrama-1.jpg ... , food-1.jpg ... , pets-1.jpg ...   (number = caption order)
       pets:   pet-max.jpg, pet-uno.jpg ...   (pet name in lowercase)
     ===================================================================== */
  const DATA={
    typed:['I write.','I read at Mass.','I stay calm under pressure.','I encode, fast and accurate.','I never skip a K-drama.'],
    now:[['Watching','Doctor X',true],['Studying','for my database hands-on exam'],['Eating','ready-to-cook meals, boarder style']],

    roles:[
      {tab:'Student',img:'role-student.jpg',alt:'Jannah as a student',text:'I am a Bachelor of Science in Information Technology student and a CHED scholar. I am also the youngest in our family, which means I learned early how to listen first and speak up when it counts.'},
      {tab:'Writer',img:'role-writer.jpg',alt:'Jannah as a writer',parish:true,text:'I am a writer in the Social Communications Ministry of our parish. I turn parish activities and stories into words that people can read and share.'},
      {tab:'Youth council',img:'role-council.jpg',alt:'Jannah with the Parish Youth Coordinating Council',parish:true,text:'I am part of the Parish Youth Coordinating Council in Dalaguete, where I help organize activities that bring young people together.'},
      {tab:'Lector',img:'role-lector.jpg',alt:'Jannah as a lector',parish:true,text:'I serve as a Lector, proclaiming the Word of God during Mass. It keeps me grounded, prepared, and confident speaking in front of others.'}
    ],

    skills:[
      {name:'Working under pressure',level:90,text:'Deadlines do not scare me. I plan, prioritize, and keep a calm head.'},
      {name:'Writing',level:85,text:'Clear, organized, and written with the reader in mind.'},
      {name:'Encoding',level:88,text:'Fast and accurate data entry, with a habit of double-checking my work.'}
    ],

    days:[
      ['\u23F0','Wake up','Rise and shine. A new day begins.'],
      ['\u{1F9F9}','Do chores','Keeping my space neat and tidy.'],
      ['\u{1F6BF}','Freshen up','Fresh and ready for the day.'],
      ['\u{1F4DA}','Schoolwork and study','Schoolwork and review come first.'],
      ['\u{1F3EB}','Go to school','Off to class.'],
      ['\u{1F37D}\uFE0F','Eat','Time to refuel.'],
      ['\u{1F4D6}','Study again','Back to the books.'],
      ['\u{1F37F}','Free time','K-drama, a series, or One Piece!']
    ],

    /* One caption per photo slot. Slot 1 = kdrama-1, slot 2 = kdrama-2, and so on. */
    album:{
      kdrama:{label:'K-Drama',icon:'\u{1F3AC}',search:true,tag:'Always one more episode away from "just one more."',
        captions:['Teach You a Lesson','Phantom Lawyer','Take Charge of My Heart','Taxi Driver','The Wonderfools','Bloodhounds','Vincenzo','Our Sticky Love']},
      food:{label:'Foods I tried',icon:'\u{1F35C}',tag:'New place, new plate. I am always up for a taste test.',
        captions:['','','','','','','','']},
      pets:{label:'Pets & family',icon:'\u{1F43E}',tag:'My favorite way to recharge is with the people and pets I love.',
        captions:['','','','']}
    },

    top3:['Take Charge of My Heart','Phantom Lawyer','Teach You a Lesson'],

    pets:[
      {name:'Max',text:'Always greets you with a little offering.'},
      {name:'Uno',text:'The nonchalant and jealous one who looks after the younger dogs.'},
      {name:'Molly',text:'Shy at first, but a jolly little soul once she warms up to you.'},
      {name:'Samson',text:'The eldest, but forever the baby.'},
      {name:'Skimmy',text:'The rescued troublemaker who never says no to a laag.'}
    ],

    goals:['Graduate college','Land a stable job','Travel to different countries','Give back to my parents and older sister'],

    facts:['I am the youngest in our family.','I have five pets: Max, Uno, Molly, Samson, and Skimmy.','I watched all three seasons of Taxi Driver.','I am a boarder, and ready-to-cook meals keep me going.','I love trying new foods.'],

    quiz:[
      {q:'Where am I in the family order?',o:['Eldest','Middle child','Youngest','Only child'],a:2},
      {q:'What do I love watching in my free time?',o:['Anime','K-drama','Soccer','News'],a:1},
      {q:'Which parish ministry do I write for?',o:['Social Communications','Music','Liturgy of the Hours','Altar servers'],a:0},
      {q:'Which anime do I watch in my free time?',o:['Naruto','Bleach','One Piece','Attack on Titan'],a:2},
      {q:'What is my number 1 K-drama?',o:['Vincenzo','Phantom Lawyer','Bloodhounds','Take Charge of My Heart'],a:3}
    ]
  };

  /* ---------- Helpers ---------- */
  const EXTS=['jpg','jpeg','png','webp','JPG','JPEG','PNG','jfif'];
  function loadImg(src,ok,fail){            /* tries album/ then the main folder, with common extensions */
    const base=src.replace(/\.[^.\/]+$/,''), bases=[base];
    if(base.indexOf('album/')!==0)bases.unshift('album/'+base);
    const tries=[]; bases.forEach(b=>EXTS.forEach(x=>tries.push(b+'.'+x)));
    let i=0;
    (function next(){
      if(i>=tries.length){if(fail)fail();return}
      const im=new Image(); im.onload=()=>ok(im); im.onerror=next; im.src=tries[i++];
    })();
  }
  const gsearch=t=>'https://www.google.com/search?q='+encodeURIComponent(t+' Korean drama');
  const el=(tag,cls,txt)=>{const e=document.createElement(tag); if(cls)e.className=cls; if(txt!=null)e.textContent=txt; return e};
  const retrigger=(node,cls)=>{node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls)};

  /* ---------- Dark mode ---------- */
  let saved=null; try{saved=localStorage.getItem('theme')}catch(e){}
  const btn=$('#theme');
  function setTheme(d){
    root.dataset.theme=d?'dark':'light';
    btn.setAttribute('aria-pressed',d);
    btn.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');
    try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}
  }
  setTheme(saved?saved==='dark':matchMedia('(prefers-color-scheme: dark)').matches);
  btn.onclick=()=>setTheme(root.dataset.theme!=='dark');

  /* ---------- Sidebar menu (small screens) ---------- */
  const side=$('#sidenav'), menu=$('#menu'), scrim=$('#scrim');
  function setMenu(o){
    side.classList.toggle('open',o); scrim.classList.toggle('show',o);
    menu.setAttribute('aria-expanded',o);
    document.body.style.overflow=o?'hidden':'';
    if(o)$('#close').focus(); else if(document.activeElement&&side.contains(document.activeElement))menu.focus();
  }
  menu.onclick=()=>setMenu(true); $('#close').onclick=()=>setMenu(false); scrim.onclick=()=>setMenu(false);
  $$('a',side).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  matchMedia('(min-width:1001px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});

  /* ---------- Scroll progress + active nav ---------- */
  const bar=$('#progress'), links=$$('.nav nav a'),
        secs=$$('main section').filter(s=>links.some(a=>a.getAttribute('href')==='#'+s.id));
  function onScroll(){
    const h=document.documentElement;
    bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
    let cur=secs[0].id;
    secs.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*0.4)cur=s.id});
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* ---------- Hero: typing + right-now chips ---------- */
  const t=$('#typed'); let li=0,ci=0,del=false;
  if(reduce){t.textContent=DATA.typed[0]}
  else(function tick(){
    const w=DATA.typed[li];
    t.textContent=w.slice(0,ci);
    if(!del&&ci===w.length){del=true;return setTimeout(tick,1400)}
    if(del&&ci===0){del=false;li=(li+1)%DATA.typed.length}
    ci+=del?-1:1; setTimeout(tick,del?25:55);
  })();
  DATA.now.forEach(([k,v,link])=>{
    const l=el('li'); l.append(el('b',null,k),' ');
    if(link){const a=el('a',null,v); a.href=gsearch(v); a.target='_blank'; a.rel='noopener'; a.title='Search on Google'; l.appendChild(a)} else l.append(v);
    $('#now').appendChild(l);
  });

  /* ---------- About: role tabs ---------- */
  const panel=$('#panel'), rt=$('#role-tabs');
  DATA.roles.forEach((r,i)=>{
    const b=el('button',null,r.tab); b.setAttribute('role','tab'); b.onclick=()=>showTab(i); rt.appendChild(b);
  });
  function showTab(i){
    $$('button',rt).forEach((b,n)=>b.setAttribute('aria-selected',n===i));
    const r=DATA.roles[i], fig=el('div','role-pic');
    fig.style.display='none';
    loadImg(r.img,im=>{im.alt=r.alt; fig.appendChild(im); fig.style.display=''});
    panel.innerHTML=''; panel.append(fig,el('p',null,r.text));
    retrigger(panel,'swap');
  }
  showTab(0);

  /* ---------- Album + top 3 ---------- */
  const grid=$('#album-grid'), lb=$('#lb');
  let shown=[], cur=0, lastTile=null, current=null;
  function renderAlbum(key){
    current=key; const cat=DATA.album[key]; grid.innerHTML='';
    let pending=cat.captions.length, found=0;
    const done=()=>{ if(--pending===0&&found===0){
      const hint=el('div','tile empty'); hint.append(el('b',null,cat.icon),el('span',null,'Add photos named '+key+'-1.jpg, '+key+'-2.jpg ...')); grid.appendChild(hint);
    }};
    cat.captions.forEach((c,i)=>{
      const tile=el('button','tile'); tile.type='button'; tile.hidden=true; grid.appendChild(tile);
      loadImg(key+'-'+(i+1)+'.jpg',im=>{
        found++; im.alt=c||cat.label; tile.append(im); if(c)tile.append(el('span','cap',c));
        tile.dataset.cap=c; tile.dataset.url=(cat.search&&c)?gsearch(c):''; tile.setAttribute('aria-label','Open photo'+(c?': '+c:'')); tile.hidden=false; done();
      },done);
      tile.onclick=()=>{
        lastTile=tile; const open=$$('.tile:not([hidden]):not(.empty)',grid);
        shown=open.map(x=>({src:$('img',x).src,cap:x.dataset.cap||'',url:x.dataset.url||''})); cur=open.indexOf(tile); openLb();
      };
    });
  }
  const cardsBox=$('#album-cards');
  Object.keys(DATA.album).forEach(k=>{
    const cat=DATA.album[k], b=el('button','flip'); b.type='button'; b.dataset.k=k;
    b.setAttribute('aria-pressed','false'); b.setAttribute('aria-label',cat.label+' card');
    const f=el('span','face front'); f.append(el('b','ico',cat.icon),el('span',null,cat.label));
    b.append(f,el('span','face back',cat.tag));
    b.onclick=()=>{
      if(current===k){b.classList.toggle('on'); return}
      $$('.flip',cardsBox).forEach(x=>{x.classList.remove('on','sel'); x.setAttribute('aria-pressed','false')});
      b.classList.add('on','sel'); b.setAttribute('aria-pressed','true'); renderAlbum(k);
    };
    cardsBox.appendChild(b);
  });
  function openLb(){
    const p=shown[cur]; $('#lb-img').src=p.src; $('#lb-img').alt=p.cap;
    const cp=$('#lb-cap'); cp.innerHTML='';
    if(p.url){const a=el('a',null,p.cap+' \u2197'); a.href=p.url; a.target='_blank'; a.rel='noopener'; a.title='Search on Google'; cp.appendChild(a)}
    else cp.textContent=p.cap;
    lb.hidden=false; document.body.style.overflow='hidden'; $('#lb-x').focus();
  }
  function closeLb(){lb.hidden=true; document.body.style.overflow=''; if(lastTile)lastTile.focus()}
  function step(d){cur=(cur+d+shown.length)%shown.length; openLb()}
  $('#lb-x').onclick=closeLb; $('#lb-p').onclick=()=>step(-1); $('#lb-n').onclick=()=>step(1);
  lb.onclick=e=>{if(e.target===lb)closeLb()};
  addEventListener('keydown',e=>{
    if(lb.hidden)return;
    if(e.key==='Escape')closeLb(); if(e.key==='ArrowLeft')step(-1); if(e.key==='ArrowRight')step(1);
  });
  renderAlbum('kdrama'); $('.flip',cardsBox).classList.add('sel'); $('.flip',cardsBox).setAttribute('aria-pressed','true');

  const medals=['\u{1F947}','\u{1F948}','\u{1F949}'], pod=$('#podium');
  [1,0,2].forEach(i=>{
    const d=el('div','pod r'+(i+1)), a=el('a','tt',medals[i]+' '+DATA.top3[i]);
    a.href=gsearch(DATA.top3[i]); a.target='_blank'; a.rel='noopener'; a.title='Search on Google';
    const bk=el('button','blk',i+1); bk.type='button'; bk.setAttribute('aria-label','Light up number '+(i+1));
    bk.onclick=()=>d.classList.toggle('lit'); d.append(a,bk); pod.appendChild(d);
  });

  /* ---------- Skills ---------- */
  const sl=$('#skills-list');
  DATA.skills.forEach(s=>{
    const b=el('button','skill'); b.setAttribute('aria-expanded','false');
    const m=el('span','meter'), i=el('i'); i.dataset.level=s.level; m.appendChild(i);
    b.append(el('span','skill-name',s.name),m,el('span','skill-more',s.text));
    b.onclick=()=>b.setAttribute('aria-expanded',b.getAttribute('aria-expanded')!=='true'); sl.appendChild(b);
  });

  /* ---------- Day in my life ---------- */
  const dr=$('#day-range'), dc=$('.day-card'), ds=$('#day-steps');
  dr.max=DATA.days.length-1;
  DATA.days.forEach((d,i)=>{
    const l=el('li'), b=el('button',null,i+1); b.type='button'; b.setAttribute('aria-label','Step '+(i+1)+': '+d[1]);
    b.onclick=()=>setDay(i); l.appendChild(b); ds.appendChild(l);
  });
  function setDay(i){
    const d=DATA.days[i]; dr.value=i;
    $('#day-ico').textContent=d[0]; $('#day-title').textContent=d[1]; $('#day-text').textContent=d[2];
    dr.setAttribute('aria-valuetext','Step '+(i+1)+' of '+DATA.days.length+': '+d[1]);
    $$('button',ds).forEach((b,k)=>{b.classList.toggle('on',k===i); b.classList.toggle('done',k<i)});
    retrigger(dc,'pop');
  }
  dr.oninput=()=>setDay(+dr.value); setDay(0);

  /* ---------- Pets ---------- */
  const pg=$('#pets-grid');
  DATA.pets.forEach(p=>{
    const b=el('button','flip pet'); b.type='button'; b.setAttribute('aria-label','Meet '+p.name);
    const f=el('span','face front'), k=el('span','face back');
    f.append(el('b','ico','\u{1F43E}'),el('span',null,p.name)); k.append(el('b',null,p.name),el('span',null,p.text));
    b.append(f,k);
    loadImg('pet-'+p.name.toLowerCase()+'.jpg',im=>{im.alt=''; f.innerHTML=''; f.append(im,el('span','nm',p.name))});
    b.onclick=()=>b.classList.toggle('on'); pg.appendChild(b);
  });

  /* ---------- Goals ---------- */
  const gl=$('#glist');
  DATA.goals.forEach(g=>{
    const l=el('li'), lab=el('label'), c=el('input'); c.type='checkbox';
    lab.append(c,el('span','box'),el('span',null,g)); l.appendChild(lab); gl.appendChild(l);
  });
  function goalUpdate(){
    const n=$$('input:checked',gl).length, total=DATA.goals.length, pct=n/total*100;
    $('#gfill').style.width=pct+'%'; $('.gbar').setAttribute('aria-valuenow',pct);
    $('#gcount').textContent=n===total?'Every goal is lit up. Let us go!':n+' of '+total+' goals lit up';
  }
  gl.addEventListener('change',goalUpdate); goalUpdate();

  /* ---------- At a glance (numbers come from the lists above) + fun facts ---------- */
  const stats=[
    [DATA.pets.length,'pets'],
    [DATA.album.kdrama.captions.length,'favorite K-dramas'],
    [DATA.roles.filter(r=>r.parish).length,'parish roles'],
    [DATA.goals.length,'big goals']
  ];
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return; cio.unobserve(e.target);
    const b=$('b',e.target), end=+b.dataset.n, t0=performance.now();
    if(reduce)return;
    (function f(t){const p=Math.min((t-t0)/900,1); b.textContent=Math.round(end*p); if(p<1)requestAnimationFrame(f)})(t0);
  }),{threshold:.6});
  stats.forEach(([n,label])=>{
    const s=el('div','stat'), b=el('b',null,reduce?n:0); b.dataset.n=n;
    s.append(b,el('span',null,label)); $('#glance').appendChild(s); cio.observe(s);
  });
  let fi=-1; const fp=$('#fact');
  $('#fact-btn').onclick=()=>{
    let n; do{n=Math.floor(Math.random()*DATA.facts.length)}while(n===fi&&DATA.facts.length>1); fi=n;
    fp.textContent=DATA.facts[n]; retrigger(fp,'swap');
  };

  /* ---------- Myth reveal ---------- */
  const rv=$('#reveal'), tr=$('#truth');
  rv.onclick=()=>{
    const open=tr.hidden; tr.hidden=!open;
    rv.setAttribute('aria-expanded',open); rv.textContent=open?'Hide':'Reveal the truth';
  };

  /* ---------- Reveal on scroll (meters, podium, verse) ---------- */
  const rio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return; e.target.classList.add('in');
    $$('.meter i',e.target).forEach(i=>i.style.width=i.dataset.level+'%'); rio.unobserve(e.target);
  }),{threshold:.35});
  [$('#podium'),$('.skills'),...$$('.rv')].forEach(x=>rio.observe(x));

  /* ---------- Quiz ---------- */
  const box=$('#quiz-box'), qs=DATA.quiz; let n=0,score=0;
  function render(){
    box.innerHTML='';
    if(n>=qs.length){
      const msg=score===qs.length?'Perfect score. You really paid attention.':score>=1?'Not bad. Now you know me a little better.':'Time to scroll back up and read again.';
      const again=el('button','btn primary next','Try again'); again.onclick=()=>{n=0;score=0;render()};
      box.append(el('h3',null,'You got '+score+' out of '+qs.length),el('p',null,msg),again); return;
    }
    const q=qs[n], opts=el('div','opts'), fb=el('p','fb');
    q.o.forEach((o,i)=>{
      const b=el('button','opt',o); b.onclick=()=>{
        const ok=i===q.a; if(ok)score++;
        $$('.opt',box).forEach((x,k)=>{x.disabled=true; x.classList.add(k===q.a?'right':'wrong')});
        fb.textContent=ok?'Correct!':'Close, but the highlighted answer is right.';
        const nx=el('button','btn primary next',n<qs.length-1?'Next question':'See my score');
        nx.onclick=()=>{n++;render()}; box.appendChild(nx); nx.focus();
      }; opts.appendChild(b);
    });
    box.append(el('p','step','Question '+(n+1)+' of '+qs.length),el('h3',null,q.q),opts,fb);
  }
  render();
})();