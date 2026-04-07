function goTo(p){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  var m={home:0,about:1,experience:2,album:3,contact:4};
  document.querySelectorAll('.nav-links a')[m[p]].classList.add('active');
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(p==='album') buildAlbum();
}
function toggleMenu(){ document.getElementById('navLinks').classList.toggle('open'); }
function openLightbox(src){ document.getElementById('lightbox-img').src=src; document.getElementById('lightbox').classList.add('open'); }
function closeLightbox(){ document.getElementById('lightbox').classList.remove('open'); }
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeLightbox(); });

/* ============================================ */

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
  v1: "assets/videos/v1.mp4"
};

document.getElementById('aboutPhoto') && (document.getElementById("aboutPhoto").src="assets/images/about.jpg");
  document.getElementById('passportPhoto') && (document.getElementById("passportPhoto").src="assets/images/passport.jpg");
buildAlbum();

function buildAlbum(){
  var sdWrap    = document.getElementById('albSdWrap');
  var glitchScr = document.getElementById('albGlitchScreen');
  var mediaWrap = document.getElementById('albMediaWrap');
  var controls  = document.getElementById('albControls');
  var filmstrip = document.getElementById('camFilmstrip');
  var strip     = document.getElementById('camStrip');
  if (!sdWrap || sdWrap.dataset.ready) return;
  sdWrap.dataset.ready = '1';

  var keys  = ['p1','p2','v1','p3','p4','p5','p6','p7','p8','p9','p10','p11','p12','p13'];
  var dates = ['2024:08:10','2024:08:11','2024:08:12','2025:08:09','2025:08:10','2023:08:08','2022:08:11','2022:08:12','2023:08:09','2021:08:10','2021:08:11','2020:08:09','2019:08:10','2019:08:11'];
  var currentIndex = 0;
  var autoPanTimer = null;
  var isAutoPan = false;
  var loaded = false;

  function loadMedia() {
    if (loaded) return;
    loaded = true;
    var validKeys = keys.filter(function(k){
      return k.charAt(0)==='v' ? (typeof VIDEOS!=='undefined' && VIDEOS[k]) : (typeof PHOTOS!=='undefined' && PHOTOS[k]);
    });
    validKeys.forEach(function(k, i) {
      var isVid = k.charAt(0)==='v';
      var src = isVid ? VIDEOS[k] : PHOTOS[k];
      if (isVid) {
        var v = document.createElement('video');
        v.src=src; v.className='cam-frame'; v.muted=true; v.loop=true; v.playsInline=true;
        strip.appendChild(v);
        var t = document.createElement('div');
        t.className='cam-thumb cam-thumb--video'+(i===0?' active':'');
        t.innerHTML='▶'; t.onclick=(function(idx){return function(){stopAuto();goToFrame(idx);};})(i);
        filmstrip.appendChild(t);
      } else {
        var img=document.createElement('img');
        img.src=src; img.className='cam-frame'; img.alt='TOA';
        strip.appendChild(img);
        var th=document.createElement('img');
        th.src=src; th.className='cam-thumb'+(i===0?' active':'');
        th.onclick=(function(idx){return function(){stopAuto();goToFrame(idx);};})(i);
        filmstrip.appendChild(th);
      }
    });
    goToFrame(0);
  }

  function goToFrame(idx) {
    var total = strip.children.length;
    if (total===0) return;
    currentIndex = Math.max(0, Math.min(idx, total-1));
    strip.style.transform = 'translateX(-'+(currentIndex*100)+'%)';
    strip.querySelectorAll('video').forEach(function(v){v.pause();});
    var cur = strip.children[currentIndex];
    if (cur && cur.tagName==='VIDEO') cur.play();
    var c=document.getElementById('camCounter');
    if (c) c.textContent=String(currentIndex+1).padStart(2,'0')+' / '+String(total).padStart(2,'0');
    var dt=document.getElementById('camDateTime');
    if (dt && dates[currentIndex]) dt.textContent=dates[currentIndex];
    filmstrip.querySelectorAll('.cam-thumb,.cam-thumb--video').forEach(function(t,ti){t.classList.toggle('active',ti===currentIndex);});
  }

  function stopAuto() {
    if (autoPanTimer){clearInterval(autoPanTimer);autoPanTimer=null;}
    isAutoPan=false;
    var sb=document.getElementById('camSim');
    if(sb) sb.classList.remove('active');
  }

  sdWrap.addEventListener('click', function(){
    if (sdWrap.classList.contains('inserted')) return;
    sdWrap.classList.add('inserted');
    loadMedia();
    setTimeout(function(){
      if(glitchScr) glitchScr.style.display='none';
      if(mediaWrap) mediaWrap.style.display='block';
      if(controls) controls.style.display='flex';
      if(filmstrip) filmstrip.style.display='flex';
      isAutoPan=true;
      var sb=document.getElementById('camSim');
      if(sb) sb.classList.add('active');
      autoPanTimer=setInterval(function(){
        goToFrame((currentIndex+1)%strip.children.length);
      },2500);
    },600);
  });

  var prevBtn=document.getElementById('camPrev');
  var nextBtn=document.getElementById('camNext');
  var simBtn =document.getElementById('camSim');
  if(prevBtn) prevBtn.onclick=function(){stopAuto();goToFrame(currentIndex-1);};
  if(nextBtn) nextBtn.onclick=function(){stopAuto();goToFrame(currentIndex+1);};
  if(simBtn)  simBtn.onclick=function(){
    if(isAutoPan){stopAuto();}
    else{isAutoPan=true;simBtn.classList.add('active');autoPanTimer=setInterval(function(){goToFrame((currentIndex+1)%strip.children.length);},2500);}
  };
}

function goTo(p){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
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
  var revealEls = document.querySelectorAll('.section-heading, .quote-block, .section-label, .skills-grid, .album-intro, .contact-box, .contact-info, .album-note, .divider');
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
