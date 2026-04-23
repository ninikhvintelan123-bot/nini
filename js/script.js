var PHOTOS = {
  p1: "assets/images/p1.jpg",
  p2: "assets/images/p2.jpg",
  p3: "assets/images/p3.jpg",
  p4: "assets/images/p4.jpg",
  p5: "assets/images/p5.jpg",
  p6: "assets/images/p6.jpg",
  p7: "assets/images/p7.jpg",
  p8: "assets/images/p8.jpg",
  p9: "assets/images/p9.jpg",
  p10: "assets/images/p10.jpg",
  p11: "assets/images/p11.jpg",
  p12: "assets/images/p12.jpg",
  p13: "assets/images/p13.jpg",
};
var VIDEOS = {

  v1: "assets/videos/v1.mp4",
  v2: "assets/videos/v2.mp4",
  v6: "assets/videos/v6.mp4",
  v8: "assets/videos/v8.mp4",
  v9: "assets/videos/v9.mp4",
};

document.getElementById('aboutPhoto') && (document.getElementById("aboutPhoto").src="assets/images/about.jpg");
  document.getElementById('passportPhoto') && (document.getElementById("passportPhoto").src="assets/images/passport.jpg");
buildAlbum();

function buildAlbum(){
  var sdWrap   = document.getElementById('cam2SdWrap');
  var offScreen= document.getElementById('cam2Off');
  var bootScr  = document.getElementById('cam2Boot');
  var gallery  = document.getElementById('cam2Gallery');
  var strip    = document.getElementById('cam2Strip');
  var filmInner= document.getElementById('cam2FilmInner');
  var film     = document.getElementById('cam2Film');

  if (!sdWrap || sdWrap.dataset.ready) return;
  sdWrap.dataset.ready = '1';

  var keys = ['v1','p1','v2','p2','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13','v6','v8','v9'];
  var dates = ['TOA 2024','TOA 2024','TOA 2024','TOA 2025','TOA 2025','TOA 2023','TOA 2022','TOA 2022','TOA 2023','TOA 2021','TOA 2021','TOA 2020','TOA 2019','TOA 2019','TOA 2024','TOA 2024','TOA 2025','TOA 2025'];
  var currentIndex = 0;
  var autoPanTimer = null;
  var isAutoPan = false;
  var loaded = false;

  function loadMedia() {
    if (loaded) return;
    loaded = true;
    var validKeys = keys.filter(function(k){
      return k.charAt(0)==='v'
        ? (typeof VIDEOS!=='undefined' && VIDEOS[k])
        : (typeof PHOTOS!=='undefined' && PHOTOS[k]);
    });
    validKeys.forEach(function(k, i) {
      var isVid = k.charAt(0)==='v';
      var src = isVid ? VIDEOS[k] : PHOTOS[k];
      // main frame
      var el;
      if (isVid) {
        el = document.createElement('video');
        el.src=src; el.muted=true; el.loop=true; el.playsInline=true;
      } else {
        el = document.createElement('img');
        el.src = src; el.alt = 'TOA';
      }
      el.className = 'cam2-frame';
      strip.appendChild(el);
      // thumbnail
      var th;
      if (isVid) {
        th = document.createElement('div');
        th.className = 'cam2-thumb--vid' + (i===0?' active':'');
        th.innerHTML = '▶';
      } else {
        th = document.createElement('img');
        th.src = src; th.alt = '';
        th.className = 'cam2-thumb' + (i===0?' active':'');
      }
      th.onclick = (function(idx){ return function(){ stopAuto(); goToFrame(idx); }; })(i);
      filmInner.appendChild(th);
    });
    goToFrame(0);
  }

  function goToFrame(idx) {
    var total = strip.children.length;
    if (!total) return;
    currentIndex = Math.max(0,Math.min(idx,total-1));
    strip.style.transform = 'translateX(-'+(currentIndex*100)+'%)';
    strip.querySelectorAll('video').forEach(function(v){v.pause();});
    var cur = strip.children[currentIndex];
    if (cur && cur.tagName==='VIDEO') cur.play();
    var ctr = document.getElementById('cam2Counter');
    if (ctr) ctr.textContent = String(currentIndex+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    var dt = document.getElementById('cam2Date');
    if (dt && dates[currentIndex]) dt.textContent = dates[currentIndex];
    if (filmInner) filmInner.querySelectorAll('.cam2-thumb,.cam2-thumb--vid').forEach(function(t,ti){
      t.classList.toggle('active', ti===currentIndex);
    });
  }

  function stopAuto() {
    if (autoPanTimer){clearInterval(autoPanTimer);autoPanTimer=null;}
    isAutoPan=false;
    var btn=document.getElementById('cam2AutoBtn');
    if(btn) btn.classList.remove('active');
  }

  // SD CARD INSERT
  sdWrap.addEventListener('click', function(){
    if (sdWrap.classList.contains('inserting')) return;
    sdWrap.classList.add('inserting');
    loadMedia();

    // After slide-up animation: boot sequence
    setTimeout(function(){
      if(offScreen) offScreen.style.display='none';
      if(bootScr) bootScr.style.display='flex';

      // After glitch boot: show gallery
      setTimeout(function(){
        if(bootScr) bootScr.style.display='none';
        if(gallery) gallery.style.display='block';
        if(film) film.style.display='block';

        // auto pan start
        isAutoPan=true;
        var ab=document.getElementById('cam2AutoBtn');
        if(ab) ab.classList.add('active');
        autoPanTimer=setInterval(function(){
          if(strip.children.length)
            goToFrame((currentIndex+1)%strip.children.length);
        },2800);
      }, 1800);
    }, 750);
  });

  // BUTTONS
  var pb=document.getElementById('cam2PrevBtn');
  var nb=document.getElementById('cam2NextBtn');
  var ab=document.getElementById('cam2AutoBtn');
  var pl=document.getElementById('cam2PlayBtn');
  if(pb) pb.onclick=function(){stopAuto();goToFrame(currentIndex-1);};
  if(nb) nb.onclick=function(){stopAuto();goToFrame(currentIndex+1);};
  if(pl) pl.onclick=function(){stopAuto();goToFrame(currentIndex+1);};
  if(ab) ab.onclick=function(){
    if(isAutoPan){stopAuto();}
    else{
      isAutoPan=true; ab.classList.add('active');
      autoPanTimer=setInterval(function(){
        if(strip.children.length)
          goToFrame((currentIndex+1)%strip.children.length);
      },2800);
    }
  };
}

function goTo(p){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  if(p==='album') { setTimeout(buildAlbum,100); }
  var m={home:0,about:1,experience:2,album:3,contact:4};
  document.querySelectorAll('.nav-links a')[m[p]].classList.add('active');
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(p==='album') buildAlbum();
}
function toggleMenu(){ document.getElementById('navLinks').classList.toggle('open'); }
function openLightbox(src){ document.getElementById('lightbox-img').src=src; document.getElementById('lightbox').classList.add('open'); }
function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); }
document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeLightbox(); });
(function() {
  // CURSOR GLOW
  var glow = document.getElementById('cursorGlow');
  if (glow) {
    document.addEventListener('mousemove', function(e) {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    });
  }

  // 3D TILT on Hero
  var heroContent = document.querySelector('.hero-content');
  var heroEl = document.querySelector('.hero');
  if (heroContent && heroEl) {
    heroEl.addEventListener('mousemove', function(e) {
      var rect = heroEl.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top  + rect.height / 2;
      var dx = (e.clientX - cx) / rect.width  * 14;
      var dy = (e.clientY - cy) / rect.height * 14;
      heroContent.style.transform = 'rotateY(' + dx + 'deg) rotateX(' + (-dy) + 'deg)';
    });
    heroEl.addEventListener('mouseleave', function() {
      heroContent.style.transform = 'rotateY(0) rotateX(0)';
    });
  }


  // PARTICLES
  var canvas = document.getElementById('particles-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var pColors = ['#c8f135','#ff3cac','#38cfff','rgba(255,255,255,0.7)'];
    var particles = [];
    for (var i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.3,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        c: pColors[Math.floor(Math.random() * pColors.length)],
        o: Math.random() * 0.4 + 0.1
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var j = 0; j < particles.length; j++) {
        var p = particles[j];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.o;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // SCROLL REVEAL
  var revealEls = document.querySelectorAll('.quote-block, .skills-grid, .album-intro, .contact-box, .contact-info, .album-note, .divider');
  for (var k = 0; k < revealEls.length; k++) {
    revealEls[k].classList.add('reveal');
  }
  function revealOnScroll() {
    var targets = document.querySelectorAll('.reveal, .timeline-item, .checklist li, .about-card, .lang-card');
    for (var m = 0; m < targets.length; m++) {
      (function(el, idx) {
        if (el.getBoundingClientRect().top < window.innerHeight - 50) {
          setTimeout(function() { el.classList.add('visible'); }, idx * 55);
        }
      })(targets[m], m);
    }
  }
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // MAGNETIC BUTTONS
  var btns = document.querySelectorAll('.btn-main, .btn-ghost, .btn-insta');
  for (var b = 0; b < btns.length; b++) {
    (function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var r  = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width  / 2) * 0.25;
        var dy = (e.clientY - r.top  - r.height / 2) * 0.25;
        btn.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translateY(-3px)';
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = '';
      });
    })(btns[b]);
  }
})();

/* ============================================ */

(function() {

  // SCROLL PROGRESS BAR
  var prog = document.getElementById('scrollProgress');
  window.addEventListener('scroll', function() {
    if (!prog) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    prog.style.width = pct + '%';
  }, { passive: true });

  // TYPEWRITER
  var twEl = document.getElementById('typewriterText');
  var twCursor = document.getElementById('twCursor');
  var twText = 'ერთგული მსმენელიდან — TOA-ს Backstage-ში 🤞';
  var twIndex = 0;
  var twStarted = false;

  function typeNext() {
    if (twIndex <= twText.length) {
      if (twEl) twEl.textContent = twText.slice(0, twIndex);
      twIndex++;
      setTimeout(typeNext, twIndex < 10 ? 80 : 55);
    } else {
      if (twCursor) setTimeout(function() { twCursor.style.display = 'none'; }, 2000);
    }
  }
  setTimeout(function() {
    if (!twStarted) { twStarted = true; typeNext(); }
  }, 800);

  // COUNT-UP
  function countUp(el, target, duration) {
    var start = 0;
    var step = Math.ceil(target / (duration / 30));
    var timer = setInterval(function() {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = start;
    }, 30);
  }
  function initCounters() {
    var counters = document.querySelectorAll('.stat-num[data-target]');
    counters.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-target'));
      if (el.getBoundingClientRect().top < window.innerHeight && !el.dataset.done) {
        el.dataset.done = '1';
        countUp(el, target, 1200);
      }
    });
  }
  window.addEventListener('scroll', initCounters, { passive: true });
  setTimeout(initCounters, 1000);

})();

/* ============================================ */

(function() {
  // STAGE HOVER COLORS
  var blocks = document.querySelectorAll('.stage-block');
  blocks.forEach(function(b) {
    var col = b.getAttribute('data-color');
    b.style.setProperty('--stage-color', col);
    b.addEventListener('mouseenter', function() {
      b.style.background = 'rgba(' + hexToRgb(col) + ',0.07)';
      b.querySelector('.stage-name').style.color = col;
      b.querySelector('.stage-number').style.color = col;
    });
    b.addEventListener('mouseleave', function() {
      b.style.background = '';
      b.querySelector('.stage-name').style.color = '';
      b.querySelector('.stage-number').style.color = '';
    });
  });

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var v = parseInt(hex.slice(5,7), 16);
    return r + ',' + g + ',' + v;
  }
})();

/* ============================================ */

(function() {
  var card = document.getElementById('tiltCard');
  var shine = document.getElementById('tiltShine');
  if (!card) return;

  var MAX_TILT = 22, SCALE = 1.05;
  var curRotX=0, curRotY=0, tarRotX=0, tarRotY=0;
  var isHovered=false, rafId=null;

  function lerp(a,b,t){ return a+(b-a)*t; }

  function animate(){
    if(!isHovered) return;
    curRotX=lerp(curRotX,tarRotX,0.1);
    curRotY=lerp(curRotY,tarRotY,0.1);
    card.style.transform='rotateX('+curRotX+'deg) rotateY('+curRotY+'deg) scale('+SCALE+')';
    var heroText=document.querySelector('.ab-hero-text');
    if(heroText) heroText.style.transform='translate('+(tarRotY*0.4)+'px,'+(tarRotX*-0.3)+'px)';
    var particles=card.querySelectorAll('.card-particle');
    particles.forEach(function(p,i){
      var f=i%2===0?1:-1;
      p.style.transform='translate('+(tarRotY*0.6*f)+'px,'+(tarRotX*-0.5*f)+'px)';
    });
    rafId=requestAnimationFrame(animate);
  }

  card.addEventListener('mousemove',function(e){
    var rect=card.getBoundingClientRect();
    tarRotY=((e.clientX-rect.left-rect.width/2)/rect.width*2)*MAX_TILT;
    tarRotX=-((e.clientY-rect.top-rect.height/2)/rect.height*2)*MAX_TILT;
    if(shine){
      var px=(e.clientX-rect.left)/rect.width*100;
      var py=(e.clientY-rect.top)/rect.height*100;
      shine.style.background='radial-gradient(circle at '+px+'% '+py+'%, rgba(255,255,255,0.15) 0%, rgba(200,241,53,0.04) 40%, transparent 60%)';
    }
  });
  card.addEventListener('mouseenter',function(){
    isHovered=true; card.style.transition='none';
    if(!rafId) rafId=requestAnimationFrame(animate);
  });
  card.addEventListener('mouseleave',function(){
    isHovered=false; cancelAnimationFrame(rafId); rafId=null;
    tarRotX=0; tarRotY=0;
    card.style.transition='transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    card.style.transform='rotateX(0) rotateY(0) scale(1)';
    var heroText=document.querySelector('.ab-hero-text');
    if(heroText){ heroText.style.transition='transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'; heroText.style.transform='translate(0,0)'; }
    var particles=card.querySelectorAll('.card-particle');
    particles.forEach(function(p){ p.style.transform='translate(0,0)'; });
    if(shine) shine.style.background='radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)';
    setTimeout(function(){ card.style.transition='transform 0.08s ease'; curRotX=0; curRotY=0; },600);
  });

  // Magnetic nav links
  document.querySelectorAll('.nav-links a, .hero-cta-primary, .hero-cta-secondary').forEach(function(el){
    el.addEventListener('mousemove',function(e){
      var rect=el.getBoundingClientRect();
      el.style.transform='translate('+(e.clientX-rect.left-rect.width/2)*0.35+'px,'+(e.clientY-rect.top-rect.height/2)*0.35+'px)';
    });
    el.addEventListener('mouseleave',function(){
      el.style.transform='';
      el.style.transition='transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });

})();

/* ============================================ */

(function(){
  // 3D tilt for rm-cards
  document.querySelectorAll('.rm-card').forEach(function(card){
    var shine = card.querySelector('.rm-card-shine');
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      var cx = r.width/2, cy = r.height/2;
      var rx = -(y-cy)/cy*8, ry = (x-cx)/cx*8;
      card.style.transform = 'perspective(600px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-6px) scale(1.02)';
      if(shine){
        var px = (x/r.width)*100, py = (y/r.height)*100;
        shine.style.background = 'radial-gradient(circle at '+px+'% '+py+'%, rgba(255,255,255,0.08) 0%, transparent 55%)';
        shine.style.opacity = '1';
      }
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease, border-color 0.25s';
      if(shine){ shine.style.opacity='0'; }
      setTimeout(function(){ card.style.transition=''; },500);
    });
  });
})();
