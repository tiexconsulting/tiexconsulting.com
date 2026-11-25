(function(){
  // Menú móvil
  var b=document.getElementById('menuBtn'),m=document.getElementById('menu');
  b.addEventListener('click',function(){
    var o=m.classList.toggle('open');
    b.setAttribute('aria-expanded',o);
  });
  m.addEventListener('click',function(e){
    if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded','false');}
  });

  document.getElementById('yr').textContent=new Date().getFullYear();

  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Aparición al hacer scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduce){
    document.documentElement.classList.add('anim');
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
    },{threshold:.12});
    els.forEach(function(el){io.observe(el);});
  }else{els.forEach(function(el){el.classList.add('in');});}

  // Contadores
  var counts=document.querySelectorAll('.count');
  function fmt(n,sep){return sep?n.toLocaleString('en-US'):String(n);}
  function run(el){
    var to=+el.dataset.to,sep=el.dataset.sep,t0=null,d=1400;
    function f(t){
      if(!t0)t0=t;
      var p=Math.min((t-t0)/d,1),e=1-Math.pow(1-p,3);
      el.textContent=fmt(Math.round(to*e),sep);
      if(p<1)requestAnimationFrame(f);
    }
    requestAnimationFrame(f);
  }
  if('IntersectionObserver' in window && !reduce){
    var co=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){run(e.target);co.unobserve(e.target);}});
    },{threshold:.6});
    counts.forEach(function(c){co.observe(c);});
  }
})();

(function(){
  var f=document.getElementById('leadForm'); if(!f) return;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(n){return (f.elements[n].value||'').trim();};
    var err=document.getElementById('f-err');
    if(!v('nombre')||!v('empresa')||!v('giro')){err.hidden=false;return;}
    err.hidden=true;
    var t='Hola, me gustaría agendar un Diagnóstico Organizacional 360° para mi empresa.\n'+
      'Nombre: '+v('nombre')+'\nEmpresa: '+v('empresa')+'\nGiro: '+v('giro')+
      (v('tam')?'\nColaboradores: '+v('tam'):'')+(v('msg')?'\nQuiero resolver: '+v('msg'):'');
    window.open('https://wa.me/526624984223?text='+encodeURIComponent(t),'_blank','noopener');
  });
})();

(function(){
  var tabs=[].slice.call(document.querySelectorAll('.plist [role=tab]')); if(!tabs.length) return;
  function sel(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});}
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){sel(t);});
    t.addEventListener('keydown',function(e){
      var k=e.key,n=k==='ArrowDown'||k==='ArrowRight'?i+1:k==='ArrowUp'||k==='ArrowLeft'?i-1:-1;
      if(n<0)return;e.preventDefault();var x=tabs[(n+tabs.length)%tabs.length];x.focus();sel(x);
    });
  });
})();

(function(){
  var WA_NUMBER='526624984223'; // número de WhatsApp de TIEX (editable)
  var D={"rot": {"t": "Rotación de personal", "x": "La salida constante de colaboradores puede ser una señal de problemas más profundos en la organización.", "c": ["Perfiles de puesto mal definidos", "Liderazgo y supervisión deficientes", "Sueldos y prestaciones poco competitivos", "Falta de desarrollo y oportunidades de crecimiento"], "s": ["ret", "cap", "rec", "ali"]}, "vac": {"t": "Vacantes sin cubrir", "x": "Si no encuentras a la persona adecuada, quizá el problema no sea la falta de candidatos, sino tu estrategia de atracción.", "c": ["Requisitos del puesto poco realistas", "Salarios fuera de mercado", "Difusión inadecuada de las vacantes", "Procesos de selección lentos o poco efectivos"], "s": ["rec", "ben", "red"]}, "fue": {"t": "Apagar fuegos todos los días", "x": "Cuando todo es urgente, normalmente hay algo en la organización que necesita estructura.", "c": ["Falta de planeación y seguimiento", "Responsabilidades poco claras", "Procesos inexistentes o mal definidos", "Mandos medios sin herramientas de gestión"], "s": ["ali", "cons", "cap"]}, "des": {"t": "Desorden operativo", "x": "El desorden cotidiano puede ser consecuencia de una estructura que no acompaña el crecimiento de la empresa.", "c": ["Organigrama que no refleja la operación real", "Funciones duplicadas o sin responsables", "Falta de procedimientos documentados", "Ausencia de indicadores de desempeño"], "s": ["ali", "cons", "suc"]}, "fug": {"t": "Baja productividad y fugas de dinero", "x": "Los costos que más afectan a una empresa no siempre aparecen como un gasto evidente: muchas veces están en su operación diaria.", "c": ["Mala distribución de cargas de trabajo", "Personal sin capacitación adecuada", "Errores operativos y retrabajos", "Alta rotación, ausentismo y horas extra"], "s": ["cap", "cons", "ali"]}, "con": {"t": "Conflictos y mal ambiente laboral", "x": "Los conflictos recurrentes pueden revelar fallas en la comunicación, el liderazgo y la cultura organizacional.", "c": ["Comunicación deficiente entre áreas", "Liderazgo autoritario o poco desarrollado", "Falta de claridad en funciones y expectativas", "Ausencia de mecanismos para atender conflictos"], "s": ["ret", "cap", "ali"]}, "vis": {"t": "Poca visibilidad: nadie te conoce", "x": "Si solo te conocen tus clientes actuales, quizá tu marca no está llegando al mercado que podría contratarte.", "c": ["Sin redes sociales activas", "Contenido poco útil o inexistente", "Marca sin identidad definida", "Sin estrategia digital ni seguimiento"], "s": ["red", "mar", "ben"]}};
  var m=document.getElementById('dmap'); if(!m) return;
  var efs=[].slice.call(m.querySelectorAll('.ef')),box=document.getElementById('dcas'),svg=document.getElementById('dlines'),cap=document.getElementById('dcap'),wa=document.getElementById('dwa'),svcs=[].slice.call(document.querySelectorAll('#dsol .svc'));
  function msg(t){return 'Hola, en mi empresa estamos viviendo este problema: '+t+'. Me gustaría platicar y ver cómo TIEX puede ayudarnos.';}
  function setWa(t){wa.href='https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(t?msg(t):'Hola, me gustaría platicar con TIEX Consulting sobre mi empresa.');}
  function draw(sel){
    svg.innerHTML=''; if(!sel||getComputedStyle(svg).display==='none')return;
    var r=m.getBoundingClientRect(),A=sel.getBoundingClientRect();
    [].slice.call(box.children).forEach(function(c){
      var B=c.getBoundingClientRect(),x1=A.left+A.width/2-r.left,y1=A.bottom-r.top,x2=B.left+B.width/2-r.left,y2=B.top-r.top,my=(y1+y2)/2;
      var p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('d','M'+x1+' '+y1+' C'+x1+' '+my+' '+x2+' '+my+' '+x2+' '+y2);svg.appendChild(p);
    });
  }
  var cur=null;
  function pick(el){
    cur=el;m.classList.add('sel');var d=D[el.dataset.id];
    efs.forEach(function(x){x.classList.toggle('on',x===el);x.setAttribute('aria-pressed',x===el);});
    box.innerHTML='';
    d.c.forEach(function(t,i){var c=document.createElement('div');c.className='ca lit pop';c.style.animationDelay=(i*90)+'ms';c.textContent=t;box.appendChild(c);});
    cap.innerHTML='<b>'+d.t+'.</b> '+d.x;
    svcs.forEach(function(s){s.classList.toggle('rel',d.s.indexOf(s.dataset.id)>-1);});
    var g=document.getElementById('dgo');if(g)g.hidden=false;var rq=document.getElementById('dreq');if(rq)rq.hidden=(el.dataset.id!=='vac');
    setWa(d.t);
    setTimeout(function(){draw(el);},60);
  }
  efs.forEach(function(el){el.addEventListener('click',function(){pick(el);});});
  window.addEventListener('resize',function(){draw(cur);});
  setWa(null);
  var g2=document.getElementById('dgo'),sol=document.getElementById('dsol');
  if(g2&&sol){
    g2.setAttribute('role','button');g2.setAttribute('aria-expanded','false');g2.setAttribute('aria-controls','dsol');
    g2.addEventListener('click',function(e){
      e.preventDefault();var o=!sol.classList.contains('has');
      sol.classList.toggle('has',o);g2.setAttribute('aria-expanded',o);
      g2.innerHTML=o?'Ocultar soluciones ↑':'Ver cómo podemos ayudarte ↓';
      if(o)setTimeout(function(){sol.scrollIntoView({behavior:'smooth',block:'start'});},60);
    });
  }
})();

(function(){
  var h=document.querySelector('.vhero'); if(!h) return;
  var imgs=[].slice.call(h.querySelectorAll('.vs')),words=[].slice.call(h.querySelectorAll('.rot>span')),v=h.querySelector('.vvid');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(v){var ok=function(){v.classList.add('ready');v.play&&v.play().catch(function(){});};v.addEventListener('canplay',ok);v.addEventListener('error',function(){v.remove();});}
  if(reduce)return;
  var a=0,b=0;
  setInterval(function(){imgs[a].classList.remove('on');a=(a+1)%imgs.length;imgs[a].classList.add('on');},5500);
  setInterval(function(){words[b].classList.remove('on');b=(b+1)%words.length;words[b].classList.add('on');},2600);
})();

(function(){
  var f=document.getElementById('lifefig'); if(!f)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  f.classList.add('pre');
  new IntersectionObserver(function(es,o){if(es[0].isIntersecting){f.classList.add('go');o.disconnect();}},{threshold:.4}).observe(f);
})();

(function(){
  var vs=[].slice.call(document.querySelectorAll('.phone video')); if(!vs.length)return;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)){vs.forEach(function(v){v.controls=true;});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){});}else v.pause();});},{threshold:.5});
  vs.forEach(function(v){io.observe(v);});
})();
