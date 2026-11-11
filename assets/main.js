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
