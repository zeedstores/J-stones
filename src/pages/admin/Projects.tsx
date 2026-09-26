import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

type Project = {
  id: string
  title: string
  location: string | null
  category: string | null
  completed_at: string | null
  image_url: string | null
  published: boolean
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadProjects() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('projects')
      .select(
        'id, title, location, category, completed_at, image_url, published',
      )
      .order('completed_at', {
        ascending: false,
        nullsFirst: false,
      })
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      setError(error.message)
      setLoading(false)
      return
    }

    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  async function togglePublished(project: Project) {
    const { error } = await supabase
      .from('projects')
      .update({
        published: !project.published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', project.id)

    if (error) {
      console.error(error)
      setError(error.message)
      return
    }

    setProjects(current =>
      current.map(item =>
        item.id === project.id
          ? { ...item, published: !item.published }
          : item,
      ),
    )
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm(
      'Delete this project permanently?',
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      setError(error.message)
      return
    }

    setProjects(current =>
      current.filter(project => project.id !== id),
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span
            style={{
              display: 'block',
              color: '#D97924',
              fontSize: '0.62rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '0.65rem',
            }}
          >
            J-STONES / Projects
          </span>

          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              color: '#101820',
              lineHeight: 1,
              margin: 0,
              letterSpacing: '-0.03em',
            }}
          >
            Projects
          </h1>

          <p
            style={{
              color: '#66717C',
              fontSize: '0.75rem',
              marginTop: '0.55rem',
            }}
          >
            Manage the projects displayed on the J-STONES website.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          style={{
            background: '#0B3768',
            color: '#FFFFFF',
            padding: '0.75rem 1rem',
            textDecoration: 'none',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          + Add Project
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            border: '1px solid #E2BABA',
            background: '#F9EEEE',
            color: '#9B3434',
            padding: '0.9rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.78rem',
            lineHeight: 1.5,
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #C7CED6',
            padding: '3rem 1.5rem',
            textAlign: 'center',
            color: '#66717C',
            fontSize: '0.8rem',
          }}
        >
          Loading projects…
        </div>
      ) : projects.length === 0 ? (
        /* Empty state */
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #C7CED6',
            padding: '4rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'block',
              color: '#D97924',
              fontSize: '0.62rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '0.7rem',
            }}
          >
            Portfolio
          </span>

          <p
            style={{
              color: '#101820',
              margin: 0,
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontSize: '1.7rem',
            }}
          >
            No projects yet.
          </p>

          <p
            style={{
              color: '#66717C',
              fontSize: '0.76rem',
              margin: '0.6rem 0 1.4rem',
            }}
          >
            Add the first J-STONES construction project.
          </p>

          <Link
            to="/admin/projects/new"
            style={{
              color: '#0B3768',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            Add project →
          </Link>
        </div>
      ) : (
        /* Project list */
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {projects.map(project => (
            <div
              key={project.id}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '120px minmax(0, 1fr) auto',
                gap: '1.25rem',
                alignItems: 'center',
                background: '#FFFFFF',
                border: '1px solid #C7CED6',
                padding: '0.9rem',
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: 120,
                  height: 82,
                  background: '#E8EEF4',
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
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#66717C',
                      fontSize: '0.62rem',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              {/* Project information */}
              <div
                style={{
                  minWidth: 0,
                }}
              >
                <h2
                  style={{
                    color: '#101820',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {project.title}
                </h2>

                <p
                  style={{
                    color: '#66717C',
                    fontSize: '0.7rem',
                    margin: '0.4rem 0 0',
                    lineHeight: 1.5,
                  }}
                >
                  {project.location || 'No location'}
                  {project.category
                    ? ` · ${project.category}`
                    : ''}
                </p>

                {project.completed_at && (
                  <p
                    style={{
                      color: '#89939D',
                      fontSize: '0.64rem',
                      margin: '0.3rem 0 0',
                    }}
                  >
                    Completed{' '}
                    {new Date(
                      `${project.completed_at}T00:00:00`,
                    ).getFullYear()}
                  </p>
                )}

                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '0.55rem',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.56rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    color: project.published
                      ? '#176B3A'
                      : '#66717C',
                    backgroundColor: project.published
                      ? '#E8F2EC'
                      : '#F5F3EE',
                    border: `1px solid ${
                      project.published
                        ? '#B8D8C3'
                        : '#D9DEE3'
                    }`,
                  }}
                >
                  {project.published
                    ? 'Published'
                    : 'Draft'}
                </span>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.45rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}
              >
                <Link
                  to={`/admin/projects/${project.id}/preview`}
                  style={{
                    border: '1px solid #C7CED6',
                    color: '#66717C',
                    background: '#FFFFFF',
                    padding: '0.55rem 0.7rem',
                    textDecoration: 'none',
                    fontSize: '0.66rem',
                    fontWeight: 600,
                  }}
                >
                  Preview
                </Link>

                <Link
                  to={`/admin/projects/${project.id}/edit`}
                  style={{
                    border: '1px solid #C7CED6',
                    color: '#101820',
                    background: '#FFFFFF',
                    padding: '0.55rem 0.7rem',
                    textDecoration: 'none',
                    fontSize: '0.66rem',
                    fontWeight: 600,
                  }}
                >
                  Edit
                </Link>

                <button
                  onClick={() => togglePublished(project)}
                  style={{
                    border: '1px solid #B7C5D3',
                    background: '#F2F6FA',
                    color: '#0B3768',
                    padding: '0.55rem 0.7rem',
                    cursor: 'pointer',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {project.published
                    ? 'Unpublish'
                    : 'Publish'}
                </button>

                <button
                  onClick={() =>
                    deleteProject(project.id)
                  }
                  style={{
                    border: '1px solid #E2BABA',
                    background: '#FFFFFF',
                    color: '#9B3434',
                    padding: '0.55rem 0.7rem',
                    cursor: 'pointer',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}