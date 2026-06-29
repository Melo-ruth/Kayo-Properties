document.addEventListener("DOMContentLoaded", function () {

  var items = [
    { number:"01", label:"Properties", tag:"Kayo Properties — Properties", title:"Spaces With Lasting Value.", desc:"Thoughtfully selected properties designed for growth, comfort, and long-term return.", btn:"Explore Properties", link:"#properties", angle:90 },
    { number:"02", label:"Capital",    tag:"Kayo Properties — Capital",    title:"As Invested As You Are.",   desc:"Clear, personalised investment solutions built for long-term wealth. From investor-focused apartments to contemporary condominiums — each approached with purpose and precision.", btn:"Explore Capital", link:"#capital", angle:30 },
    { number:"03", label:"Living",     tag:"Kayo Properties — Living",     title:"Designed Around Daily Life.",desc:"Modern residences created for comfort, privacy, elegance, and the rhythm of contemporary living.", btn:"Explore Living", link:"#living", angle:-30 },
    { number:"04", label:"Cabins",     tag:"Kayo Properties — Cabins",     title:"Retreats With Purpose.",    desc:"Beautiful escape spaces that combine nature, design, and commercial potential.", btn:"Explore Cabins", link:"#cabins", angle:-90 },
    { number:"05", label:"Workshop",   tag:"Kayo Properties — Workshop",   title:"Built Through Craft.",      desc:"A practical approach to design, planning, and development that turns ideas into real spaces.", btn:"Explore Workshop", link:"#workshop", angle:-150 },
    { number:"06", label:"Studio",     tag:"Kayo Properties — Studio",     title:"Ideas Made Visible.",       desc:"Creative direction, concept development, and visual storytelling for property-led brands.", btn:"Explore Studio", link:"#studio", angle:150 }
  ];

  var defaultContent = {
    tag:   "Kayo Properties — Development",
    title: "Development With Vision.",
    desc:  "Thoughtfully positioned residential and mixed-use developments designed for modern urban growth, enduring functionality, and long-term investment value.",
    btn:   "View Developments",
    link:  "#developments"
  };

  var SVG_NS = "http://www.w3.org/2000/svg";
  var CX = 450, CY = 450;
  var NODE_R = 365;
  var TICK_IN = 270, TICK_OUT = 315;

  var wheelG = document.getElementById("orbit-wheel");
  var nodesG = document.getElementById("orbit-nodes");
  var linesG = document.getElementById("orbit-lines");
  var cBox   = document.getElementById("hc-center");
  var cTag   = document.getElementById("hc-center-tag");
  var cTitle = document.getElementById("hc-center-title");
  var cDesc  = document.getElementById("hc-center-desc");
  var cBtn   = document.getElementById("hc-center-btn");

  var activeIdx = -1;
  var curRot    = 0;
  var raf       = null;

  function polar(angle, dist) {
    var r = angle * Math.PI / 180;
    return { x: CX + dist * Math.cos(r), y: CY - dist * Math.sin(r) };
  }

  function build() {
    nodesG.innerHTML = "";
    linesG.innerHTML = "";

    for (var i = 0; i < items.length; i++) {
      (function(idx) {
        var it = items[idx];
        var np = polar(it.angle, NODE_R);
        var lp = polar(it.angle, NODE_R + 58);
        var ts = polar(it.angle, TICK_IN);
        var te = polar(it.angle, TICK_OUT);

        // tick line
        var line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", ts.x); line.setAttribute("y1", ts.y);
        line.setAttribute("x2", te.x); line.setAttribute("y2", te.y);
        linesG.appendChild(line);

        // node group
        var g = document.createElementNS(SVG_NS, "g");
        g.setAttribute("class", "orbit-node");
        g.setAttribute("data-index", idx);

        var circ = document.createElementNS(SVG_NS, "circle");
        circ.setAttribute("class", "node-circle");
        circ.setAttribute("cx", np.x);
        circ.setAttribute("cy", np.y);
        circ.setAttribute("r", 41);

        var num = document.createElementNS(SVG_NS, "text");
        num.setAttribute("class", "node-num");
        num.setAttribute("x", np.x);
        num.setAttribute("y", np.y);
        num.textContent = it.number;

        var lbl = document.createElementNS(SVG_NS, "text");
        lbl.setAttribute("class", "node-label");
        lbl.setAttribute("x", lp.x);
        lbl.setAttribute("y", lp.y);
        lbl.textContent = it.label;

        g.appendChild(circ);
        g.appendChild(num);
        g.appendChild(lbl);

        g.addEventListener("click", function() { activate(idx); });
        nodesG.appendChild(g);
      })(i);
    }
  }

  function activate(idx) {
    activeIdx = idx;
    var data = (idx === -1) ? defaultContent : items[idx];

    // clear active states
    var allNodes = document.querySelectorAll(".orbit-node");
    for (var n = 0; n < allNodes.length; n++) {
      allNodes[n].setAttribute("class", "orbit-node");
    }

    // highlight chosen node
    if (idx !== -1) {
      var target = document.querySelector('.orbit-node[data-index="' + idx + '"]');
      if (target) target.setAttribute("class", "orbit-node active");
    }

    // animate center text swap
    cBox.classList.add("fading");

    setTimeout(function() {
      cTag.textContent   = data.tag;
      cTitle.textContent = data.title;
      cDesc.textContent  = data.desc;
      cBtn.setAttribute("href", data.link);
      cBtn.innerHTML = data.btn + ' <span class="btn-dot">↗</span>';
      cBox.classList.remove("fading");
    }, 250);

    // rotate wheel
    if (idx !== -1) {
      var dest = 90 - items[idx].angle;
      animateRotation(curRot, dest, 900);
      curRot = dest;
    }
  }

  function animateRotation(from, to, dur) {
    if (raf) cancelAnimationFrame(raf);
    var t0 = performance.now();

    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(now) {
      var p = Math.min((now - t0) / dur, 1);
      var rot = from + (to - from) * ease(p);

      // USE SVG transform attribute directly — no CSS transform-origin needed
      wheelG.setAttribute("transform", "rotate(" + rot + " " + CX + " " + CY + ")");

      // counter-rotate text so it stays readable
      var nodes = document.querySelectorAll(".orbit-node");
      for (var i = 0; i < nodes.length; i++) {
        var nm = nodes[i].querySelector(".node-num");
        var lb = nodes[i].querySelector(".node-label");
        if (nm) {
          var nx = nm.getAttribute("x"), ny = nm.getAttribute("y");
          nm.setAttribute("transform", "rotate(" + (-rot) + " " + nx + " " + ny + ")");
        }
        if (lb) {
          var lx = lb.getAttribute("x"), ly = lb.getAttribute("y");
          lb.setAttribute("transform", "rotate(" + (-rot) + " " + lx + " " + ly + ")");
        }
      }

      if (p < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
  }

  // ── GO ── (only run when the ecosystem wheel exists on this page)
  if (nodesG && linesG && cBox) {
    build();
    activate(-1);
  }

});
/* ══════════════════════════════════════
   KAYO PROPERTIES — Contact Page JS
   app.js
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. MOBILE MENU TOGGLE ── */
  const hambBtn   = document.getElementById('hambBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hambBtn && mobileMenu) {
    hambBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hambBtn.setAttribute('aria-expanded', isOpen);
      hambBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Close menu when a link is tapped
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hambBtn.setAttribute('aria-expanded', false);
        hambBtn.textContent = '☰';
      });
    });
  }


  /* ── 2. SCROLL REVEAL (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .stagger'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target); // fire once only
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => io.observe(el));


  /* ── 3. HERO GHOST TEXT PARALLAX ── */
  const ghost = document.querySelector('.hero-ghost');

  if (ghost) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      ghost.style.transform = `translateY(${y * 0.18}px)`;
    }, { passive: true });
  }


  /* ── 4. CONTACT FORM SUBMIT ── */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation — highlight empty required fields
      const required = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
      let valid = true;

      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = 'rgba(220,80,80,0.6)';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) return;

      // Show success state
      contactForm.style.display = 'none';
      formSuccess.style.display = 'flex';

      // ↓ Replace this block with your real form submission, e.g.:
      // fetch('/api/contact', { method: 'POST', body: new FormData(contactForm) })
      //   .then(res => res.json())
      //   .then(() => { contactForm.style.display = 'none'; formSuccess.style.display = 'flex'; })
      //   .catch(err => console.error(err));
    });

    // Clear red border on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }


  /* ── 5. ACTIVE NAV LINK ── */
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

});

document.addEventListener('DOMContentLoaded',()=>{
 const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const hamb=$('#hambBtn'), menu=$('#mobileMenu');
 if(hamb&&menu){hamb.addEventListener('click',()=>{const open=menu.classList.toggle('open');hamb.setAttribute('aria-expanded',open);hamb.innerHTML=open?'×':'☰'});$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');hamb.innerHTML='☰';hamb.setAttribute('aria-expanded','false')}));}
 const reveal=$$('.reveal'); const obs=new IntersectionObserver((entries,o)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}})},{threshold:.08,rootMargin:'0px 0px -30px 0px'}); reveal.forEach((el,i)=>{el.style.transitionDelay=Math.min(i*35,180)+'ms';obs.observe(el)});
 const count=$$('.stat-num[data-count]'); const cobs=new IntersectionObserver((entries,o)=>{entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=parseInt(el.dataset.count,10);let st=null;function step(ts){if(!st)st=ts;let p=Math.min((ts-st)/950,1);el.textContent=Math.floor((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(step);else el.textContent=target}requestAnimationFrame(step);o.unobserve(el)})},{threshold:.7});count.forEach(el=>cobs.observe(el));
 const thumbs=$$('.index-thumb'), entries=$$('.index-entry');let current=0;function show(i){current=Math.max(0,Math.min(i,entries.length-1));entries.forEach((e,k)=>e.classList.toggle('hidden',k!==current));thumbs.forEach((t,k)=>t.classList.toggle('active',k===current));}thumbs.forEach((t,i)=>{t.addEventListener('click',()=>show(i));t.setAttribute('tabindex','0');t.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1)})});show(0);
 $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=$(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}}));
 const navLinks=$$('.nav a[href^="#"]'), sections=$$('main section[id]'); const sobs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}})},{threshold:.35});sections.forEach(s=>sobs.observe(s));
 // Close the mobile menu when clicking outside of it
 document.addEventListener('click',e=>{if(menu&&hamb&&menu.classList.contains('open')&&!hamb.contains(e.target)&&!menu.contains(e.target)){menu.classList.remove('open');hamb.innerHTML='☰';hamb.setAttribute('aria-expanded','false');}});
});


  const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
 
  const SYSTEM_PROMPT = `You are a knowledgeable and warm real estate advisor for Kayo Properties, 
a premium property company based in Kampala, Uganda. Your role is to help clients find their 
ideal property, whether buying, renting, or investing.
 
Guidelines:
- Be concise (2-4 sentences per reply unless detail is truly needed)
- Use a warm, professional tone — not salesy, but genuinely helpful
- Focus on Kampala and Uganda real estate context (neighbourhoods like Kololo, Naguru, Muyenga, Bugolobi, Ntinda, Bukoto, Entebbe Road corridor)
- Give practical guidance on the local market, pricing norms, legal steps (title deeds, Mailo land, lease hold), and neighbourhoods
- If asked to book/schedule, say you'll connect them with a human advisor and ask for their name and preferred time
- Never invent specific listing prices — say prices vary and offer to connect with the team
- Keep replies friendly and brief; avoid bullet-heavy walls of text`;
 
  let chatOpen = false;
  let conversationHistory = [];
  let greeted = false;
 
  function toggleChat() {
    chatOpen = !chatOpen;
    const chat = document.getElementById('kayo-chat');
    const cta  = document.getElementById('kayo-cta');
    chat.classList.toggle('open', chatOpen);
    if (chatOpen) {
      cta.style.display = 'none';
      if (!greeted) { greet(); greeted = true; }
      setTimeout(() => document.getElementById('chat-input').focus(), 300);
    } else {
      cta.style.display = 'flex';
    }
  }
 
  function greet() {
    appendBot("Hello! I'm Kayo's property advisor. Whether you're looking to buy, rent, or invest in Kampala — I'm here to help. What can I assist you with today?");
  }
 
  function appendBot(text) {
    const div = document.createElement('div');
    div.className = 'msg bot';
    div.textContent = text;
    getMessages().appendChild(div);
    scrollBottom();
  }
 
  function appendUser(text) {
    const div = document.createElement('div');
    div.className = 'msg user';
    div.textContent = text;
    getMessages().appendChild(div);
    hideQuickReplies();
    scrollBottom();
  }
 
  function showTyping() {
    const div = document.createElement('div');
    div.className = 'msg typing';
    div.id = 'typing-indicator';
    div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
    getMessages().appendChild(div);
    scrollBottom();
    return div;
  }
 
  function removeTyping() {
    const el = document.getElementById('typing-indicator');
    if (el) el.remove();
  }
 
  function hideQuickReplies() {
    document.getElementById('quick-replies').style.display = 'none';
  }
 
  function getMessages() {
    return document.getElementById('chat-messages');
  }
 
  function scrollBottom() {
    const el = getMessages();
    el.scrollTop = el.scrollHeight;
  }
 
  async function sendQuick(text) {
    await send(text);
  }
 
  async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    await send(text);
  }
 
  async function send(userText) {
    appendUser(userText);
    conversationHistory.push({ role: 'user', content: userText });
 
    const typing = showTyping();
 
    try {
      const response = await fetch(ANTHROPIC_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: conversationHistory
        })
      });
 
      const data = await response.json();
      removeTyping();
 
      const reply = data?.content?.[0]?.text || "I'm sorry, I couldn't process that. Please try again.";
      conversationHistory.push({ role: 'assistant', content: reply });
      appendBot(reply);
 
    } catch (err) {
      removeTyping();
      appendBot("I'm having trouble connecting right now. Please try again in a moment, or contact us directly.");
      console.error('Kayo chatbot error:', err);
    }
  }
