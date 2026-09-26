import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

type Project = {
  id: string
  title: string
  category: string | null
  location: string | null
  description: string | null
  completed_at: string | null
  image_url: string | null
  published: boolean
}

export default function ProjectPreview() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProject() {
      if (!id) {
        setError('Project not found.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('projects')
        .select(
          'id, title, category, location, description, completed_at, image_url, published',
        )
        .eq('id', id)
        .single()

      if (error) {
        console.error('Could not load project:', error)
        setError('Could not load this project.')
      } else {
        setProject(data)
      }

      setLoading(false)
    }

    loadProject()
  }, [id])

  async function togglePublished() {
    if (!project) return

    setActionLoading(true)
    setError('')

    const nextPublished = !project.published

    const { error } = await supabase
      .from('projects')
      .update({
        published: nextPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id)

    if (error) {
      console.error('Could not update project:', error)
      setError('Could not update the project status.')
    } else {
      setProject({
        ...project,
        published: nextPublished,
      })
    }

    setActionLoading(false)
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F3EE',
          color: '#101820',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.8rem',
        }}
      >
        Loading project…
      </div>
    )
  }

  if (error || !project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F3EE',
          color: '#101820',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <p
          style={{
            color: '#9B3434',
            fontSize: '0.82rem',
          }}
        >
          {error || 'Project not found.'}
        </p>

        <button
          onClick={() => navigate('/admin/projects')}
          style={{
            background: '#FFFFFF',
            border: '1px solid #C7CED6',
            color: '#101820',
            padding: '0.65rem 1.2rem',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 700,
          }}
        >
          ← Back to Projects
        </button>
      </div>
    )
  }

  const year = project.completed_at
    ? new Date(`${project.completed_at}T00:00:00`).getFullYear()
    : '—'

  const status = project.published ? 'published' : 'draft'

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F3EE',
        fontFamily: "'DM Sans', sans-serif",
        color: '#101820',
      }}
    >
      {/* Preview bar */}
      <div
        style={{
          backgroundColor: '#0B3768',
          color: '#FFFFFF',
          padding: '0.7rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 2px 12px rgba(16, 24, 32, 0.12)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: '0.6rem',
              letterSpacing: '0.16em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              backgroundColor: '#D97924',
              padding: '0.3rem 0.6rem',
              fontWeight: 700,
            }}
          >
            Preview Mode
          </span>

          <span
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.72rem',
            }}
          >
            This is how the project will appear publicly.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate(`/admin/projects/${id}/edit`)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#FFFFFF',
              padding: '0.5rem 1rem',
              fontSize: '0.68rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
            }}
          >
            ← Edit
          </button>

          <button
            onClick={togglePublished}
            disabled={actionLoading}
            style={{
              backgroundColor: actionLoading
                ? '#7890A8'
                : '#D97924',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.68rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontWeight: 700,
              cursor: actionLoading ? 'wait' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {actionLoading
              ? 'Updating…'
              : project.published
                ? 'Unpublish'
                : 'Publish'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#F9EEEE',
            borderBottom: '1px solid #E2BABA',
            color: '#9B3434',
            fontSize: '0.78rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: '60vh',
          minHeight: 380,
          backgroundColor: '#0B3768',
          overflow: 'hidden',
        }}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#174A7F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            No cover image
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(16,24,32,0.9) 0%, rgba(16,24,32,0.1) 65%, rgba(16,24,32,0.05) 100%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(2rem, 5vw, 4rem)',
            left: 'clamp(1.5rem, 7vw, 6rem)',
            right: 'clamp(1.5rem, 7vw, 6rem)',
            maxWidth: 1000,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.62rem',
              letterSpacing: '0.18em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              backgroundColor: '#D97924',
              padding: '0.35rem 0.65rem',
              fontWeight: 700,
            }}
          >
            {project.category || 'Project'}
          </span>

          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
              color: '#FFFFFF',
              lineHeight: 0.95,
              margin: '0.8rem 0 0',
              letterSpacing: '-0.04em',
              maxWidth: 900,
            }}
          >
            {project.title}
          </h1>
        </div>
      </div>

      {/* Project information */}
      <div
        style={{
          padding:
            'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 7vw, 6rem)',
          maxWidth: 1100,
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(0, 1fr))',
            borderTop: '1px solid #C7CED6',
            borderBottom: '1px solid #C7CED6',
            marginBottom: '3rem',
          }}
        >
          {[
            {
              label: 'Location',
              val: project.location || '—',
            },
            {
              label: 'Year',
              val: year,
            },
            {
              label: 'Service',
              val: project.category || '—',
            },
            {
              label: 'Status',
              val: status,
            },
          ].map((meta, index) => (
            <div
              key={meta.label}
              style={{
                padding: '1.25rem 1rem',
                borderRight:
                  index < 3
                    ? '1px solid #C7CED6'
                    : 'none',
              }}
            >
              <p
                style={{
                  fontSize: '0.58rem',
                  letterSpacing: '0.15em',
                  color: '#D97924',
                  textTransform: 'uppercase',
                  margin: 0,
                  fontWeight: 700,
                }}
              >
                {meta.label}
              </p>

              <p
                style={{
                  color: '#101820',
                  fontSize: '0.82rem',
                  margin: '0.45rem 0 0',
                  textTransform: 'capitalize',
                  lineHeight: 1.4,
                  fontWeight: 600,
                }}
              >
                {meta.val}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: 780,
          }}
        >
          <span
            style={{
              display: 'block',
              color: '#0B3768',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '0.8rem',
            }}
          >
            Project overview
          </span>

          <p
            style={{
              color: '#3E4A55',
              fontFamily:
                "'Instrument Serif', Georgia, serif",
              fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {project.description ||
              'No project description added yet.'}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid #C7CED6',
          padding:
            '1.25rem clamp(1.5rem, 7vw, 6rem)',
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          color: '#66717C',
          fontSize: '0.65rem',
          letterSpacing: '0.04em',
        }}
      >
        <span>J-STONES Construction Company Limited</span>
        <span>Project Preview</span>
      </footer>
    </div>
  )
}