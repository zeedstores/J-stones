import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const images = {
  hero:
    'https://upload.wikimedia.org/wikipedia/commons/f/fe/Building_construction_in_Abuja.jpg',

  construction:
    'https://upload.wikimedia.org/wikipedia/commons/f/f4/Building_construction_in_Abuja_01.jpg',

  workers:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Bricklayers_on_site%2C_Kwara_State%2C_Nigeria.jpg/1280px-Bricklayers_on_site%2C_Kwara_State%2C_Nigeria.jpg',
}

const services = [
  {
    number: '01',
    title: 'Building Construction',
    text: 'Residential and commercial construction managed from groundwork through completion.',
  },
  {
    number: '02',
    title: 'Property Development',
    text: 'Development of practical properties designed around how people actually live and work.',
  },
  {
    number: '03',
    title: 'Architectural Design',
    text: 'Planning and design solutions that balance function, structure and local context.',
  },
  {
    number: '04',
    title: 'Project Management',
    text: 'Coordinating people, materials, timelines and construction activity on site.',
  },
  {
    number: '05',
    title: 'Property Investment',
    text: 'Identifying and developing property opportunities with long-term value in mind.',
  },
  {
    number: '06',
    title: 'Land & Development',
    text: 'Land acquisition and development opportunities across carefully selected locations.',
  },
]

const faqs = [
  {
    question: 'What type of projects do you handle?',
    answer:
      'We work across residential, commercial and property-development projects, depending on the requirements of each client.',
  },
  {
    question: 'Where do you operate?',
    answer:
      'Nasal Holdings is based in Nigeria, with its work and development interests focused on Nigerian property and construction opportunities.',
  },
  {
    question: 'Can I discuss a project before making a commitment?',
    answer:
      'Yes. The first step is simply to discuss the project, requirements, location and intended scope so the appropriate next steps can be established.',
  },
  {
    question: 'Do you work with individual property owners?',
    answer:
      'Yes. Projects can be discussed with individual property owners as well as businesses and development partners.',
  },
]

type Project = {
  id: string
  title: string
  location: string | null
  category: string | null
  description: string | null
  completed_at: string | null
  image_url: string | null
}

function NHLLogo() {
  return (
    <svg
      className="nhl-logo"
      viewBox="0 0 80 80"
      aria-label="Nasal Holdings"
      role="img"
    >
      <path
        d="M40 5L69 21.5V55L40 72L11 55V21.5L40 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M27 54V27L53 53V26"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
      />
    </svg>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 40)
  }

  window.addEventListener('scroll', handleScroll)

  const revealElements = document.querySelectorAll('[data-reveal]')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px',
    },
  )

  revealElements.forEach((element) => observer.observe(element))

  return () => {
    window.removeEventListener('scroll', handleScroll)
    observer.disconnect()
  }
}, [projects])

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select(
          'id, title, location, category, description, completed_at, image_url',
        )
        .eq('published', true)
        .order('completed_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Could not load projects:', error)
        setProjects([])
      } else {
        setProjects(data ?? [])
      }

      setProjectsLoading(false)
    }

    loadProjects()
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="site-shell">
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <a className="brand" href="#home" onClick={() => setMenuOpen(false)}>
          <NHLLogo />
          <span className="brand-name">NASAL HOLDINGS</span>
        </a>

        <nav className="desktop-nav">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#services">Services</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="header-cta" href="#contact">
          Start a conversation
        </a>

        <button
          className={menuOpen ? 'menu-button is-open' : 'menu-button'}
          type="button"
          aria-label="Open navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#projects" onClick={() => setMenuOpen(false)}>
            Projects
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#faq" onClick={() => setMenuOpen(false)}>
            FAQ
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </div>
      )}

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow hero-reveal hero-reveal-one">
            <span className="eyebrow-line" />
            Property • Construction • Development
          </div>

          <h1 className="hero-title">
            <span className="hero-line hero-reveal hero-reveal-two">
              Built for
            </span>
            <span className="hero-line hero-reveal hero-reveal-three">
              <em>where we are.</em>
            </span>
          </h1>

          <p className="hero-description hero-reveal hero-reveal-four">
            Nasal Holdings Limited develops, builds and manages property
            projects with a focus on practical Nigerian spaces and long-term
            value.
          </p>

          <div className="hero-actions hero-reveal hero-reveal-five">
            <a className="button button-dark" href="#projects">
              View our work
              <span>↗</span>
            </a>

            <a className="text-link" href="#contact">
              Discuss a project
              <span>→</span>
            </a>
          </div>

          <div className="hero-location hero-reveal hero-reveal-six">
            <span>Based in Nigeria</span>
            <span className="location-dot" />
            <span>Building locally. Thinking long-term.</span>
          </div>
        </div>

        <div className="hero-visual hero-reveal hero-reveal-image">
          <div className="hero-image-wrap">
            <img
              src={images.hero}
              alt="Construction site in Abuja, Nigeria"
            />

            <div className="hero-image-label">
              <span>01</span>
              <span>Construction / Nigeria</span>
            </div>
          </div>

          <div className="hero-side-note">
            <span>01 — 04</span>
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      <section className="intro-strip">
        <div className="container intro-grid">
          <div className="intro-number">01</div>

          <p className="intro-statement">
            Construction is more than putting up walls. It is about creating
            places that remain useful long after the work is finished.
          </p>

          <div className="intro-rule" />
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="container about-grid">
          <div className="section-heading reveal" data-reveal>
            <span className="section-number">02 / About</span>

            <h2>
              We build with
              <em> context.</em>
            </h2>
          </div>

          <div className="about-content">
            <p className="large-copy reveal" data-reveal>
              Nigerian cities are changing quickly. The buildings we create
              should respond to that reality — not copy somewhere else.
            </p>

            <p className="body-copy reveal" data-reveal>
              Nasal Holdings Limited brings together construction, property
              development, design and investment under one direction. Our
              approach is straightforward: understand the site, understand the
              people and build something that makes sense.
            </p>

            <a className="text-link reveal" data-reveal href="#services">
              What we do
              <span>→</span>
            </a>
          </div>
        </div>

        <div className="container about-image-wrap reveal" data-reveal>
          <img
            src={images.construction}
            alt="Building construction in Abuja, Nigeria"
          />

          <div className="image-caption">
            <span>Construction in Nigeria</span>
            <span>Site / Structure / Progress</span>
          </div>
        </div>
      </section>

      <section className="section projects-section" id="projects">
  <div className="container">
    <div className="section-top reveal" data-reveal>
      <div>
        <span className="section-number">03 / Projects</span>

        <h2>
          Work worth
          <em> showing.</em>
        </h2>
      </div>

      <p>
        {projects.length > 0
          ? 'A selection of completed and approved Nasal Holdings projects.'
          : 'Places we have built, developed and continue to build are documented here.'}
      </p>
    </div>

    {projectsLoading ? (
      <div className="projects-loading reveal is-visible" data-reveal>
        <div className="projects-loading-line" />
        <span>Loading projects</span>
      </div>
    ) : projects.length === 0 ? (
      <div className="projects-placeholder reveal" data-reveal>
        <div className="projects-placeholder-image">
          <img
            src={images.workers}
            alt="Construction workers building on site in Nigeria"
          />

          <div className="projects-placeholder-image-label">
            <span>03</span>
            <span>Work in progress</span>
          </div>
        </div>

        <div className="projects-placeholder-content">
          <div>
            <span className="projects-placeholder-kicker">
              Our work
            </span>

            <h3>
              Projects take
              <em> shape here.</em>
            </h3>

            <p>
              As Nasal Holdings completes and approves projects, this
              collection will become a record of the places we have built and
              developed across Nigeria.
            </p>
          </div>

          <div className="projects-placeholder-footer">
            <span>Construction / Development / Property</span>

            <a className="text-link" href="#contact">
              Discuss a project
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    ) : (
      <div className="projects-grid">
        {projects.map((project, index) => (
          <article
            className="project-card reveal"
            data-reveal
            key={project.id}
            style={{ transitionDelay: `${index * 70}ms` }}
          >
            <div className="project-card-image">
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                />
              ) : (
                <img
                  src={images.workers}
                  alt="Construction workers on site in Nigeria"
                />
              )}

              <span className="project-card-number">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <div className="project-card-content">
              <div className="project-card-meta">
                <span>{project.category || 'Project'}</span>
                <span>{project.location || 'Nigeria'}</span>
              </div>

              <h3>{project.title}</h3>

              {project.description && (
                <p>{project.description}</p>
              )}

              {project.completed_at && (
                <span className="project-card-date">
                  Completed{' '}
                  {new Date(
                    `${project.completed_at}T00:00:00`,
                  ).toLocaleDateString('en-NG', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
</section>

      <section className="services-section" id="services">
        <div className="container">
          <div className="services-header reveal" data-reveal>
            <div>
              <span className="section-number light-number">
                04 / Services
              </span>

              <h2>
                From ground
                <em> to completion.</em>
              </h2>
            </div>

            <p>
              A practical range of services covering the different stages of
              property development and construction.
            </p>
          </div>

          <div className="services-list">
            {services.map((service, index) => (
              <article
                className="service-row reveal"
                data-reveal
                key={service.number}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <span className="service-number">{service.number}</span>

                <h3>{service.title}</h3>

                <p>{service.text}</p>

                <span className="service-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="statement-section">
        <div className="container statement-inner reveal" data-reveal>
          <span className="section-number">05 / Approach</span>

          <h2>
            Good buildings start with
            <em> good thinking.</em>
          </h2>

          <p>
            We look at the land, the people, the purpose and the future before
            thinking about the finished building.
          </p>
        </div>
      </section>

      <section className="faq-section section" id="faq">
        <div className="container faq-grid">
          <div className="faq-intro reveal" data-reveal>
            <span className="section-number">06 / FAQ</span>

            <h2>
              Before we
              <em> build.</em>
            </h2>

            <p>
              A few things clients commonly want to know before starting a
              conversation.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index

              return (
                <div
                  className={isOpen ? 'faq-item is-open' : 'faq-item'}
                  key={faq.question}
                >
                  <button
                    className="faq-question"
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>

                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy reveal" data-reveal>
            <span className="section-number light-number">
              07 / Contact
            </span>

            <h2>
              Have something
              <em> in mind?</em>
            </h2>

            <p>
              Tell us what you are building, developing or considering. Start
              with the basics and we can take it from there.
            </p>

            <div className="contact-details">
              <a href="tel:+2340000000000">+234 000 000 0000</a>

              <a href="mailto:info@nasalholdings.com">
                info@nasalholdings.com
              </a>

              <span>Nigeria</span>
            </div>
          </div>

          <div className="contact-form-wrap reveal" data-reveal>
            {submitted ? (
              <div className="form-success">
                <span>✓</span>

                <h3>Thank you.</h3>

                <p>
                  Your message has been received. We will get back to you.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <input type="text" name="name" required />
                </label>

                <label>
                  <span>Email</span>
                  <input type="email" name="email" required />
                </label>

                <label>
                  <span>Project type</span>

                  <select name="projectType" defaultValue="">
                    <option value="" disabled>
                      Select one
                    </option>

                    <option value="construction">
                      Construction
                    </option>

                    <option value="development">
                      Property development
                    </option>

                    <option value="design">
                      Architectural design
                    </option>

                    <option value="investment">
                      Property investment
                    </option>

                    <option value="other">Other</option>
                  </select>
                </label>

                <label>
                  <span>Tell us about it</span>

                  <textarea
                    name="message"
                    rows={5}
                    required
                  />
                </label>

                <button className="form-submit" type="submit">
                  Send enquiry
                  <span>→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <NHLLogo />

            <div>
              <strong>NASAL HOLDINGS LIMITED</strong>
              <span>Property • Construction • Development</span>
            </div>
          </div>

          <div className="footer-links">
            <a href="#home">Back to top ↑</a>
            <Link to="/admin">Admin</Link>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Nasal Holdings Limited</span>
          <span>Built in Nigeria</span>
        </div>
      </footer>
    </main>
  )
}