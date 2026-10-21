(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement;

  /* Dark mode (remembers choice, follows system by default) */
  let saved=null; try{saved=localStorage.getItem('theme')}catch(e){}
  const dark0=saved?saved==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  const btn=$('#theme');
  function setTheme(d){
    root.dataset.theme=d?'dark':'light';
    btn.setAttribute('aria-pressed',d);
    btn.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');
    try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}
  }
  setTheme(dark0);
  btn.onclick=()=>setTheme(root.dataset.theme!=='dark');

  /* Scroll progress + active nav */
  const bar=$('#progress'), links=$$('.nav nav a'), secs=$$('main section');
  function onScroll(){
    const h=document.documentElement;
    bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
    let cur=secs[0].id;
    secs.forEach(s=>{if(s.getBoundingClientRect().top<innerHeight*0.4)cur=s.id});
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* Typing effect */
  const lines=['I write.','I read at Mass.','I stay calm under pressure.','I encode, fast and accurate.','I never skip a k-drama.'];
  const t=$('#typed'); let li=0,ci=0,del=false;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){t.textContent=lines[0]}
  else(function tick(){
    const w=lines[li];
    t.textContent=w.slice(0,ci);
    if(!del&&ci===w.length){del=true;return setTimeout(tick,1400)}
    if(del&&ci===0){del=false;li=(li+1)%lines.length}
    ci+=del?-1:1; setTimeout(tick,del?25:55);
  })();

  /* Role tabs */
  /* Each role has its own picture. Save the images in this folder with these names. */
  const roles=[
    {img:'role-student.jpg',alt:'Jannah as a student',text:'I am a Bachelor of Science in Information Technology student and a CHED scholar. I am also the youngest in our family, which means I learned early how to listen first and speak up when it counts.'},
    {img:'role-writer.jpg',alt:'Jannah as a writer',text:'I am a writer in the Social Communications Ministry of our parish. I turn parish activities and stories into words that people can read and share.'},
    {img:'role-council.jpg',alt:'Jannah with the Parish Youth Coordinating Council',text:'I am part of the Parish Youth Coordinating Council in Dalaguete, where I help organize activities that bring young people together.'},
    {img:'role-lector.jpg',alt:'Jannah as a lector',text:'I serve as a Lector, proclaiming the Word of God during Mass. It keeps me grounded, prepared, and confident speaking in front of others.'}
  ];
  const panel=$('#panel'), tabs=$$('.tabs button');
  function showTab(i){
    tabs.forEach((b,n)=>b.setAttribute('aria-selected',n===i));
    const r=roles[i];
    panel.innerHTML='';
    const fig=document.createElement('div'); fig.className='role-pic';
    const im=new Image(); im.src=r.img; im.alt=r.alt;
    im.onerror=()=>fig.remove();
    fig.appendChild(im);
    const p=document.createElement('p'); p.textContent=r.text;
    panel.append(fig,p);
    panel.style.animation='none'; panel.offsetHeight; panel.style.animation='';
  }
  tabs.forEach((b,i)=>b.onclick=()=>showTab(i)); showTab(0);

  /* Skills: expand + animate meters when visible */
  $$('.skill').forEach(s=>s.onclick=()=>s.setAttribute('aria-expanded',s.getAttribute('aria-expanded')!=='true'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){$$('i',e.target).forEach(i=>i.style.width=i.dataset.level+'%');io.unobserve(e.target)}
  }),{threshold:.4});
  $$('.skill').forEach(s=>io.observe(s));

  /* Flip cards */
  $$('.flip').forEach(c=>c.onclick=()=>c.classList.toggle('on'));

  /* Quiz */
  const qs=[
    {q:'Where am I in the family order?',o:['Eldest','Middle child','Youngest','Only child'],a:2},
    {q:'What do I love watching in my free time?',o:['Anime','K-drama','Soccer','News'],a:1},
    {q:'Which parish ministry do I write for?',o:['Social Communications','Music','Liturgy of the Hours','Altar servers'],a:0}
  ];
  const box=$('#quiz-box'); let n=0,score=0;
  function render(){
    if(n>=qs.length){
      const msg=score===3?'Perfect score. You really paid attention.':score>=1?'Not bad. Now you know me a little better.':'Time to scroll back up and read again.';
      box.innerHTML='<h3>You got '+score+' out of 3</h3><p>'+msg+'</p><button class="btn primary next" id="again">Try again</button>';
      $('#again').onclick=()=>{n=0;score=0;render()};
      return;
    }
    const q=qs[n];
    box.innerHTML='<p class="step">Question '+(n+1)+' of 3</p><h3>'+q.q+'</h3><div class="opts">'+
      q.o.map((o,i)=>'<button class="opt" data-i="'+i+'">'+o+'</button>').join('')+'</div><p class="fb"></p>';
    $$('.opt',box).forEach(b=>b.onclick=()=>{
      const i=+b.dataset.i, ok=i===q.a;
      if(ok)score++;
      $$('.opt',box).forEach((x,k)=>{x.disabled=true;x.classList.add(k===q.a?'right':'wrong')});
      $('.fb',box).textContent=ok?'Correct!':'Close, but the highlighted answer is right.';
      const nx=document.createElement('button');
      nx.className='btn primary next'; nx.textContent=n<qs.length-1?'Next question':'See my score';
      nx.onclick=()=>{n++;render()}; box.appendChild(nx); nx.focus();
    });
  }
  render();
})();