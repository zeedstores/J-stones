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
        'id, title, location, category, completed_at, image_url, published'
      )
      .order('completed_at', { ascending: false, nullsFirst: false })
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
          : item
      )
    )
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm(
      'Delete this project permanently?'
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
      current.filter(project => project.id !== id)
    )
  }

  return (
    <AdminLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 400,
              fontSize: '1.8rem',
              color: '#f2ede6',
              margin: 0,
            }}
          >
            Projects
          </h1>

          <p
            style={{
              color: '#8a8489',
              fontSize: '0.8rem',
              marginTop: '0.4rem',
            }}
          >
            Manage the projects displayed on the website.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          style={{
            background: '#c49a26',
            color: '#09080a',
            padding: '0.75rem 1rem',
            textDecoration: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          + Add Project
        </Link>
      </div>

      {error && (
        <div
          style={{
            border: '1px solid #7f1d1d',
            background: '#1a0d0d',
            color: '#f87171',
            padding: '0.9rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.8rem',
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <p
          style={{
            color: '#8a8489',
            fontSize: '0.85rem',
          }}
        >
          Loading projects…
        </p>
      ) : projects.length === 0 ? (
        <div
          style={{
            border: '1px solid #2a2630',
            background: '#131113',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: '#f2ede6',
              margin: 0,
              fontFamily: "'Fraunces', serif",
              fontSize: '1.3rem',
            }}
          >
            No projects yet.
          </p>

          <p
            style={{
              color: '#8a8489',
              fontSize: '0.8rem',
              margin: '0.6rem 0 1.25rem',
            }}
          >
            Add the first Nasal Holdings project.
          </p>

          <Link
            to="/admin/projects/new"
            style={{
              color: '#c49a26',
              textDecoration: 'none',
              fontSize: '0.8rem',
            }}
          >
            Add project →
          </Link>
        </div>
      ) : (
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
                gridTemplateColumns: '110px 1fr auto',
                gap: '1.25rem',
                alignItems: 'center',
                background: '#131113',
                border: '1px solid #2a2630',
                padding: '0.9rem',
              }}
            >
              <div
                style={{
                  width: 110,
                  height: 75,
                  background: '#09080a',
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
                      color: '#625e62',
                      fontSize: '0.65rem',
                    }}
                  >
                    No image
                  </div>
                )}
              </div>

              <div>
                <h2
                  style={{
                    color: '#f2ede6',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    margin: 0,
                  }}
                >
                  {project.title}
                </h2>

                <p
                  style={{
                    color: '#8a8489',
                    fontSize: '0.72rem',
                    margin: '0.35rem 0 0',
                  }}
                >
                  {project.location || 'No location'}
                  {project.category
                    ? ` · ${project.category}`
                    : ''}
                </p>

                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '0.55rem',
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: project.published
                      ? '#4ade80'
                      : '#8a8489',
                  }}
                >
                  {project.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                }}
              >
                <Link
                  to={`/admin/projects/${project.id}/preview`}
                  style={{
                    border: '1px solid #2a2630',
                    color: '#8a8489',
                    padding: '0.55rem 0.75rem',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                  }}
                >
                  Preview
                </Link>

                <Link
                  to={`/admin/projects/${project.id}/edit`}
                  style={{
                    border: '1px solid #2a2630',
                    color: '#f2ede6',
                    padding: '0.55rem 0.75rem',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                  }}
                >
                  Edit
                </Link>

                <button
                  onClick={() => togglePublished(project)}
                  style={{
                    border: '1px solid #2a2630',
                    background: 'transparent',
                    color: '#c49a26',
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                  }}
                >
                  {project.published ? 'Unpublish' : 'Publish'}
                </button>

                <button
                  onClick={() => deleteProject(project.id)}
                  style={{
                    border: '1px solid #2a2630',
                    background: 'transparent',
                    color: '#f87171',
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
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