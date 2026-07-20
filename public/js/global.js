const cursor=document.getElementById('cursor'),ring=document.getElementById('cursor-ring');
if(cursor){document.addEventListener('mousemove',e=>{cursor.style.left=(e.clientX-4)+'px';cursor.style.top=(e.clientY-4)+'px';if(ring){ring.style.left=(e.clientX-18)+'px';ring.style.top=(e.clientY-18)+'px';}});}
window.addEventListener('scroll',()=>{const nb=document.getElementById('navbar');if(nb)nb.classList.toggle('scrolled',scrollY>60);});
const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting){e.target.style.transitionDelay=(i%3)*0.1+'s';e.target.classList.add('visible');}});},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(r=>obs.observe(r));
function getToken(){return localStorage.getItem('nexus_token');}
function getUser(){const u=localStorage.getItem('nexus_user');return u?JSON.parse(u):null;}
function logout(){localStorage.removeItem('nexus_token');localStorage.removeItem('nexus_user');window.location.href='/';}
const _t=getToken(),_u=getUser(),_n=document.getElementById('navAuth');
if(_n&&_t&&_u){_n.innerHTML=`<a href="/dashboard" class="btn-nav-login">Mon espace</a><a href="/dashboard" class="btn-nav">👋 ${_u.nom.split(' ')[0]}</a>`;}
