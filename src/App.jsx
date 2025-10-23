import React, { useEffect, useRef } from 'react';

export default function App() {
  const yearRef = useRef();

  useEffect(() => {
    if (yearRef.current) yearRef.current.textContent = new Date().getFullYear();

    // Scroll reveal: observe elements with data-reveal attribute
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            // optionally unobserve to reveal once
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );

    const targets = document.querySelectorAll('[data-reveal]');
    targets.forEach((t) => observer.observe(t));

    // Smooth scroll for nav links
    const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
    navLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Inject CSS so you can paste this file alone */}
      <style>{`
        :root{--max-width:1200px;--gap:20px;--bg:#fafafa;--accent:#111}
        *{box-sizing:border-box}
        body,html,#root{height:100%}
        body{margin:0;background:var(--bg);color:var(--accent);font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}
        .site-header{position:sticky;top:0;backdrop-filter:blur(6px);background:rgba(255,255,255,0.6);display:flex;justify-content:space-between;align-items:center;padding:18px;max-width:var(--max-width);margin:0 auto;gap:12px;z-index:50}
        .site-title{margin:0;font-weight:900;font-size:3rem;line-height:1}
        .site-nav a{margin-left:14px;text-decoration:none;color:inherit;cursor:pointer}
        @media (max-width:420px){.site-title{font-size:2rem;text-align:center;width:100%}}
        @media (max-width:600px){.site-header{flex-direction:column;gap:8px}.site-nav{order:2}.site-title{order:1}}
        main{max-width:var(--max-width);margin:18px auto;padding:0 18px}
        .gallery{display:grid;gap:var(--gap);grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
        .card{background:white;border-radius:8px;padding:12px;box-shadow:0 6px 16px rgba(0,0,0,0.06);transform:translateY(12px);opacity:0;transition:transform .6s cubic-bezier(.2,.9,.2,1),opacity .6s ease}
        .card img{width:100%;height:auto;display:block;border-radius:4px}
        .about,.contact{margin-top:28px;background:white;padding:18px;border-radius:8px;transform:translateY(12px);opacity:0;transition:transform .6s cubic-bezier(.2,.9,.2,1),opacity .6s ease}
        .site-footer{padding:18px;text-align:center;color:#666}
        /* reveal styles */
        [data-reveal]{will-change:transform,opacity}
        .reveal-visible{transform:none;opacity:1}
        /* stagger children for nicer effect */
        .gallery .card.reveal-visible{transition-delay:calc(var(--i,0) * 70ms)}
        /* simple image hover */
        .card:hover{transform:translateY(-6px);box-shadow:0 10px 24px rgba(0,0,0,0.12)}
        /* lightbox overlay */
        .lightbox{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.75);z-index:120;opacity:0;pointer-events:none;transition:opacity .2s}
        .lightbox.open{opacity:1;pointer-events:auto}
        .lightbox img{max-width:92vw;max-height:92vh;border-radius:6px}
      `}</style>

      <header className="site-header">
        <h1 className="site-title">Elina Wetzel</h1>
        <nav className="site-nav">
          <a href="#gallery">Gallery</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section id="gallery" className="gallery">
          {['img_1.JPG', 'img_2.jpg', 'img_3.jpg'].map((file, idx) => (
            <article
              key={file}
              className="card"
              data-reveal
              style={{ ['--i']: idx }}
            >
              {/* click to open larger */}
              <img
                src={`/images/${file}`}
                alt={`Artwork ${idx + 1}`}
                onClick={() => openLightbox(`/images/${file}`)}
                style={{ cursor: 'zoom-in' }}
              />
              <h2>{['Cuppies!', 'Sweet me!', 'Abstract Lines'][idx]}</h2>
              <p className="meta">{['Cuppies — 2024', 'Fucking awesome Cuppies! — 2024', 'Artsy Fancy - WOWOWOW! — 2025'][idx]}</p>
            </article>
          ))}
        </section>

        <section id="about" className="about" data-reveal>
          <h2>About</h2>
          <p>I am an awesome Ceramics Artist you bitches!</p>
        </section>

        <section id="contact" className="contact" data-reveal>
          <h2>Contact</h2>
          <p>Email: <a href="mailto:elinawetzel@gmail.com">elinawetzel@gmail.com</a></p>
        </section>
      </main>

      <footer className="site-footer">
        <p>© <span ref={yearRef}></span> Elina Uschbalis - Fine Details</p>
      </footer>

      {/* Lightbox portal (simple) */}
      <Lightbox />
    </div>
  );
}

/* Lightbox implementation uses a tiny global so it can be opened from the img onClick.
   This keeps the example file simpler (no state lifting). In a larger app you'd lift state.
*/
function Lightbox() {
  // use a ref for the DOM node and local state via a class on body
  const nodeRef = useRef(null);

  useEffect(() => {
    // attach to window so openLightbox can call it
    window.__elina_lightbox = {
      open: (src) => {
        if (!nodeRef.current) return;
        const img = nodeRef.current.querySelector('img');
        img.src = src;
        nodeRef.current.classList.add('open');
        document.body.style.overflow = 'hidden';
      },
      close: () => {
        if (!nodeRef.current) return;
        nodeRef.current.classList.remove('open');
        document.body.style.overflow = '';
      },
    };
    return () => {
      delete window.__elina_lightbox;
    };
  }, []);

  return (
    <div
      ref={nodeRef}
      className="lightbox"
      onClick={(e) => {
        // close when clicked background
        if (e.target === nodeRef.current) window.__elina_lightbox.close();
      }}
    >
      <img alt="expanded artwork" />
    </div>
  );
}

function openLightbox(src) {
  if (window && window.__elina_lightbox && window.__elina_lightbox.open) {
    window.__elina_lightbox.open(src);
  }
}
