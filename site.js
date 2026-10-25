const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#main-nav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation')});const dropdown=document.querySelector('.nav-dropdown');const trigger=dropdown?.querySelector('button');trigger?.addEventListener('click',()=>{const open=dropdown.classList.toggle('open');trigger.setAttribute('aria-expanded',String(open))});document.addEventListener('click',event=>{if(dropdown&&!dropdown.contains(event.target)){dropdown.classList.remove('open');trigger.setAttribute('aria-expanded','false')}});document.addEventListener('keydown',event=>{if(event.key==='Escape'){dropdown?.classList.remove('open');trigger?.setAttribute('aria-expanded','false');nav?.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}});document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false');dropdown?.classList.remove('open');trigger?.setAttribute('aria-expanded','false')}));document.getElementById('year').textContent=new Date().getFullYear();
// Reveal sections as they enter the viewport; keep content visible without IntersectionObserver.
if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){const items=document.querySelectorAll('.motion-reveal:not(.hero-copy)');const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.remove('is-pending');entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}},{threshold:.08});items.forEach(el=>{el.classList.add('is-pending');observer.observe(el)})}

// Keep section navigation usable without showing fragments in the address bar.
(function(){
  const sectionAliases={about:'vision',home:'home',businesses:'businesses',vision:'vision','farm-contact':'farm-contact'};
  const cleanPath=location.pathname.replace(/\/index\.html$/,'/');
  const isFarm=cleanPath.includes('/chicken-farm');
  const isHome=!isFarm;
  function jump(id){const el=document.getElementById(sectionAliases[id]||id);if(!el)return false;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return true}
  document.querySelectorAll('a[href]').forEach(link=>{
    const raw=link.getAttribute('href');
    if(!raw)return;
    const url=new URL(raw,location.href);
    if(url.origin!==location.origin||!url.hash)return;
    const target=url.hash.slice(1);
    if(!sectionAliases[target])return;
    link.addEventListener('click',event=>{
      const destinationFarm=url.pathname.includes('/chicken-farm');
      if(destinationFarm===isFarm){event.preventDefault();jump(target);history.replaceState(null,'',location.pathname)}
      else if(!destinationFarm&&isFarm){event.preventDefault();sessionStorage.setItem('ogunronbi-scroll',target);location.assign('/')}
    });
  });
  const pending=sessionStorage.getItem('ogunronbi-scroll');
  if(pending&&isHome){sessionStorage.removeItem('ogunronbi-scroll');requestAnimationFrame(()=>requestAnimationFrame(()=>jump(pending)))}
  if(location.hash){const id=location.hash.slice(1);if(sectionAliases[id]){requestAnimationFrame(()=>jump(id));history.replaceState(null,'',location.pathname+location.search)}}
})();
