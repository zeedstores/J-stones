
import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../imports/logo.png'
import heroImage from '../imports/hero-image.png'
import constructionImage from '../imports/image-construction.jpg'


const images = {
 hero: heroImage,

  construction:
    'https://upload.wikimedia.org/wikipedia/commons/f/f4/Building_construction_in_Abuja_01.jpg',

  workers:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Bricklayers_on_site%2C_Kwara_State%2C_Nigeria.jpg/1280px-Bricklayers_on_site%2C_Kwara_State%2C_Nigeria.jpg',
}

const services = [
  {
  number: '01',
  title: 'Architectural Designs',
  text: 'Architectural planning and design for residential and commercial projects.',
},
  {
  number: '02',
  title: 'Project Management',
  text: 'Professional coordination and management of construction projects.',
},

{
  number: '03',
  title: 'Building Construction',
  text: 'Building construction from foundation through completion.',
},

{
  number: '04',
  title: 'Concrete Floor Concepts',
  text: 'Durable concrete flooring solutions and finishes.',
},

{
  number: '05',
  title: 'Landscaping',
  text: 'Landscape design and finishing for outdoor spaces.',
},

{
  number: '06',
  title: 'Interlocking Paving Stones',
  text: 'Installation of interlocking paving for outdoor spaces.',
},
{
  number: '07',
  title: 'Modern Tyrolean',
  text: 'Modern textured finishes for clean, durable exterior surfaces.',
},

{
  number: '08',
  title: 'Managerial Consultancy',
  text: 'Professional consultancy for construction and project management.',
},
]

const faqs = [
{
question: 'What services does J-STONES provide?',
answer:
'We provide architectural designs, project management, building construction, concrete floor concepts, landscaping, interlocking paving stones, modern Tyrolean finishes and managerial consultancy.',
},
{
question: 'What types of construction projects do you handle?',
answer:
'We handle construction and finishing projects based on the client’s requirements, scope, location and project objectives.',
},
{
question: 'Can I discuss my project before making a commitment?',
answer:
'Yes. You can discuss your project with us first so we can understand your requirements, provide guidance and determine the appropriate next steps.',
},
{
question: 'Do you work with individual property owners?',
answer:
'Yes. We work with individual property owners, businesses and other clients looking for professional construction, design, finishing or project management services.',
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

    handleScroll()

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
      <header
        className={
          scrolled ? 'site-header is-scrolled' : 'site-header'
        }
      >
        <a
          className="brand"
          href="#home"
          onClick={() => setMenuOpen(false)}
        >
          <img
  className={`nhl-logo ${scrolled ? 'is-dark' : ''}`}
  src={logo}
  alt="J-STONES Construction Company Limited"
/>

<span className="brand-name">J-STONES CONSTRUCTION</span>
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
    
    <h1 className="hero-title">
      <span className="hero-line hero-reveal hero-reveal-two">
        We build
      </span>

      <span className="hero-line hero-reveal hero-reveal-three">
        what <em>stands.</em>
      </span>
    </h1>

    <p className="hero-description hero-reveal hero-reveal-four">
      J-STONES Construction Company Limited delivers construction,
      development and project management solutions built around quality,
      precision and lasting value.
    </p>

    <div className="hero-actions hero-reveal hero-reveal-five">
      <a className="button button-dark" href="#projects">
        View our work
        <span>↗</span>
      </a>

      <a className="text-link" href="#contact">
        Start a project
        <span>→</span>
      </a>
    </div>
  </div>

  <div className="hero-visual hero-reveal hero-reveal-image">
    <div className="hero-image-wrap">
      <img
        src={images.hero}
        alt="J-STONES construction project in Nigeria"
      />

<div className="hero-image-label">
  <span className="ambassador-tag">BRAND AMBASSADOR</span>

  <span className="ambassador-name">
    Sir Comedian ONE ON ONE
    <small>(Woman Leader)</small>
  </span>
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
            From architectural design and building construction to concrete flooring, landscaping, interlocking paving and modern Tyrolean finishes, J-STONES handles the work from planning through execution.

          </p>

          <div className="intro-rule" />
        </div>
      </section>

     <section className="section about-section" id="about">
  <div className="container about-grid">
    <div className="section-heading reveal" data-reveal>
      <span className="section-number">02 / About</span>

      <h2>
        Built around
        <em> the work.</em>
      </h2>
    </div>

    <div className="about-content">
      <p className="large-copy reveal" data-reveal>
        From the first design to the final finish, J-STONES takes on the
        practical work required to bring a project together.
      </p>

      <p className="body-copy reveal" data-reveal>
        We provide architectural design, building construction, project
        management, concrete flooring, landscaping, interlocking paving,
        modern Tyrolean finishes and managerial consultancy.
      </p>

      <a
        className="text-link reveal"
        data-reveal
        href="#services"
      >
        Explore our services
        <span>→</span>
      </a>
    </div>
  </div>

  <div className="container about-image-wrap reveal" data-reveal>
    <img 
  src={constructionImage} 
  alt="J-STONES construction work" 
/>

    <div className="image-caption">
      <span>J-STONES Construction</span>
      <span>Design / Construction / Finishing</span>
    </div>
  </div>
</section>

<section className="section projects-section" id="projects">
  <div className="container">
    <div className="section-top reveal" data-reveal>
      <div>
        <span className="section-number">03 / Projects</span>

        <h2>
          See what we've
          <em> built.</em>
        </h2>
      </div>

      <p>
        A look at selected J-STONES projects, from construction and
        finishing works to completed developments.
      </p>
    </div>

    {projectsLoading ? (
      <div
        className="projects-loading reveal is-visible"
        data-reveal
      >
        <div className="projects-loading-line" />
        <span>Loading projects</span>
      </div>
    ) : projects.length === 0 ? (
      <div className="projects-placeholder reveal" data-reveal>
        <div className="projects-placeholder-image">
          <img
            src={images.workers}
            alt="Construction workers on site in Nigeria"
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
              This is where we document selected projects and completed
              works as they are added to the J-STONES portfolio.
            </p>
          </div>

          <div className="projects-placeholder-footer">
            <span>
              Construction / Finishing / External Works
            </span>

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
            style={{
              transitionDelay: `${index * 70}ms`,
            }}
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
                <span>
                  {project.location || 'Nigeria'}
                </span>
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
  Built with
  <em> purpose.</em>
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
                style={{
                  transitionDelay: `${index * 70}ms`,
                }}
              >
                <span className="service-number">
                  {service.number}
                </span>

                <h3>{service.title}</h3>

                <p>{service.text}</p>

                <span className="service-arrow">↗</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="statement-section">
        <div
          className="container statement-inner reveal"
          data-reveal
        >
          <span className="section-number">05 / Approach</span>

         <h2> We plan it. <em> We build it.</em> </h2>

          <p>
  From architectural design and project management to construction and finishing, we approach every project with careful planning, skilled execution and attention to detail.
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
                  className={
                    isOpen ? 'faq-item is-open' : 'faq-item'
                  }
                  key={faq.question}
                >
                  <button
                    className="faq-question"
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
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
    Have a project
    <em> in mind?</em>
  </h2>

  <p>
    Whether you are planning a new build, improving an existing space or
    looking for professional project support, tell us what you have in
    mind and let’s discuss how J-STONES can help.
  </p>

  <div className="contact-details">
    <a href="tel:+2349040126658">
      0904 012 6658
    </a>

    <a href="https://wa.me/2349067295196" target="_blank" rel="noreferrer">
      WhatsApp: 0906 729 5196
    </a>

    <a href="mailto:jstonesconstructioncompanyltd1@gmail.com">
      jstonesconstructioncompanyltd1@gmail.com
    </a>

    <span>
      No. 72 Chief John Okafor Road, Okpanam, Asaba, Delta State, Nigeria
    </span>
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
    <form
      className="contact-form"
      onSubmit={handleSubmit}
    >
      <label>
        <span>Name</span>
        <input type="text" name="name" required />
      </label>

      <label>
        <span>Email</span>
        <input type="email" name="email" required />
      </label>

      <label>
        <span>Service</span>

        <select
          name="projectType"
          defaultValue=""
        >
          <option value="" disabled>
            Select a service
          </option>

          <option value="architectural-design">
            Architectural Designs
          </option>

          <option value="project-management">
            Project Management
          </option>

          <option value="building-construction">
            Building Construction
          </option>

          <option value="concrete-floor-concepts">
            Concrete Floor Concepts
          </option>

          <option value="landscaping">
            Landscaping
          </option>

          <option value="interlocking-paving">
            Interlocking Paving Stones
          </option>

          <option value="modern-tyrolean">
            Modern Tyrolean
          </option>

          <option value="managerial-consultancy">
            Managerial Consultancy
          </option>

          <option value="other">
            Other
          </option>
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

      <button
        className="form-submit"
        type="submit"
      >
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
      <img
        className="nhl-logo"
        src={logo}
        alt="J-STONES Construction Company Limited"
      />


  <div>
    <strong>J-STONES CONSTRUCTION COMPANY LIMITED</strong>
    <span>
      Design • Construction • Finishing
    </span>
  </div>
</div>

<div className="footer-links">
  <a href="#home">Back to top ↑</a>
  <Link to="/admin">Admin</Link>
</div>


  </div>

  <div className="container footer-bottom">
    <span>
      © {new Date().getFullYear()} J-STONES Construction Company Limited
    </span>


<span>Built in Nigeria</span>


  </div>
</footer>

    </main>
  )
}

