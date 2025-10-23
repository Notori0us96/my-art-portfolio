import React, { useEffect, useRef } from 'react'

export default function App() {
  const yearRef = useRef()

  useEffect(() => {
    if (yearRef.current) yearRef.current.textContent = new Date().getFullYear()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    )

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))

    // Smooth scroll
    document.querySelectorAll('.site-nav a').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault()
        const id = a.getAttribute('href').slice(1)
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })

    return () => observer.disconnect()
  }, [])

  // Lightbox helper
  const openLightbox = src => {
    if (window.__elina_lightbox?.open) window.__elina_lightbox.open(src)
  }

  return (
    <div>
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
              <img
                src={`/images/${file}`}
                alt={`Artwork ${idx + 1}`}
                onClick={() => openLightbox(`/images/${file}`)}
                style={{ cursor: 'zoom-in' }}
              />
              <h2>{['Cuppies!', 'Sweet me!', 'Abstract Lines'][idx]}</h2>
              <p className="meta">
                {['Cuppies — 2024', 'Fucking awesome Cuppies! — 2024', 'Artsy Fancy - WOWOWOW! — 2025'][idx]}
              </p>
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

      <Lightbox />
    </div>
  )
}

// Lightbox component
function Lightbox() {
  const nodeRef = useRef(null)

  useEffect(() => {
    window.__elina_lightbox = {
      open: src => {
        if (!nodeRef.current) return
        const img = nodeRef.current.querySelector('img')
        img.src = src
        nodeRef.current.classList.add('open')
        document.body.style.overflow = 'hidden'
      },
      close: () => {
        if (!nodeRef.current) return
        nodeRef.current.classList.remove('open')
        document.body.style.overflow = ''
      }
    }
    return () => delete window.__elina_lightbox
  }, [])

  return (
    <div
      ref={nodeRef}
      className="lightbox"
      onClick={e => {
        if (e.target === nodeRef.current) window.__elina_lightbox.close()
      }}
    >
      <img alt="expanded artwork" />
    </div>
  )
}
