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
          backgroundColor: '#09080a',
          color: '#f2ede6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        Loading project...
      </div>
    )
  }

  if (error || !project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#09080a',
          color: '#f2ede6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        <p style={{ color: '#f87171' }}>
          {error || 'Project not found.'}
        </p>

        <button
          onClick={() => navigate('/admin/projects')}
          style={{
            background: 'none',
            border: '1px solid #2a2630',
            color: '#f2ede6',
            padding: '0.6rem 1.2rem',
            cursor: 'pointer',
            fontFamily: "'Work Sans', sans-serif",
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
        backgroundColor: '#09080a',
        fontFamily: "'Work Sans', sans-serif",
        color: '#f2ede6',
      }}
    >
      {/* Preview bar */}
      <div
        style={{
          backgroundColor: '#1a1510',
          borderBottom: '1px solid #c49a2640',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: '#c49a26',
              textTransform: 'uppercase',
              backgroundColor: '#c49a2620',
              border: '1px solid #c49a2640',
              padding: '0.25rem 0.6rem',
            }}
          >
            Preview Mode
          </span>

          <span
            style={{
              color: '#8a8489',
              fontSize: '0.8rem',
            }}
          >
            This is how the project will appear publicly
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={() => navigate(`/admin/projects/${id}/edit`)}
            style={{
              background: 'none',
              border: '1px solid #2a2630',
              color: '#f2ede6',
              padding: '0.5rem 1.1rem',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Work Sans', sans-serif",
            }}
          >
            ← Back to Editor
          </button>

          <button
            onClick={togglePublished}
            disabled={actionLoading}
            style={{
              backgroundColor: '#c49a26',
              color: '#09080a',
              border: 'none',
              padding: '0.5rem 1.1rem',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: actionLoading ? 'wait' : 'pointer',
              fontFamily: "'Work Sans', sans-serif",
              opacity: actionLoading ? 0.7 : 1,
            }}
          >
            {actionLoading
              ? 'Updating...'
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
            backgroundColor: '#1a0d0d',
            borderBottom: '1px solid #7f1d1d',
            color: '#f87171',
            fontSize: '0.8rem',
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
          minHeight: 360,
          backgroundColor: '#131113',
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
              opacity: 0.6,
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1a181b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8a8489',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
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
              'linear-gradient(to top, #09080a 0%, transparent 60%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: 'clamp(1.5rem, 6vw, 5rem)',
            right: 'clamp(1.5rem, 6vw, 5rem)',
          }}
        >
          <span
            style={{
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              color: '#c49a26',
              textTransform: 'uppercase',
            }}
          >
            {project.category || 'Project'}
          </span>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: '#f2ede6',
              lineHeight: 1.1,
              marginTop: 8,
            }}
          >
            {project.title}
          </h1>
        </div>
      </div>

      {/* Meta + description */}
      <div
        style={{
          padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,6vw,5rem)',
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
            borderBottom: '1px solid #2a2630',
            paddingBottom: '2rem',
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
              label: 'Category',
              val: project.category || '—',
            },
            {
              label: 'Status',
              val: status,
            },
          ].map(meta => (
            <div key={meta.label}>
              <p
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.2em',
                  color: '#c49a26',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                {meta.label}
              </p>

              <p
                style={{
                  color: '#f2ede6',
                  fontSize: '0.92rem',
                  textTransform: 'capitalize',
                }}
              >
                {meta.val}
              </p>
            </div>
          ))}
        </div>

        <p
          style={{
            color: '#8a8489',
            fontSize: '1rem',
            lineHeight: 1.8,
          }}
        >
          {project.description || 'No project description added yet.'}
        </p>
      </div>
    </div>
  )
}