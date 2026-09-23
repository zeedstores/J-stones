
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

type Project = {
  id: string
  title: string
  category: string | null
  location: string | null
  published: boolean
  updated_at: string
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    published: {
      backgroundColor: '#0d2b1a',
      color: '#4ade80',
      border: '1px solid #166534',
    },
    draft: {
      backgroundColor: '#1a1a0d',
      color: '#facc15',
      border: '1px solid #854d0e',
    },
    archived: {
      backgroundColor: '#1a0d0d',
      color: '#f87171',
      border: '1px solid #7f1d1d',
    },
  }

  return (
    <span
      style={{
        ...styles[status] ?? styles.draft,
        fontSize: '0.62rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '0.2rem 0.6rem',
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select(
          'id, title, category, location, published, updated_at',
        )
        .order('updated_at', { ascending: false })

      if (error) {
        console.error('Could not load dashboard projects:', error)
        setError('Could not load project data.')
        setProjects([])
      } else {
        setProjects(data ?? [])
      }

      setLoading(false)
    }

    loadProjects()
  }, [])

  const totalProjects = projects.length
  const publishedProjects = projects.filter(
    project => project.published,
  ).length
  const draftProjects = projects.filter(
    project => !project.published,
  ).length

  const recentProjects = projects.slice(0, 5)

  return (
    <AdminLayout>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          gap: '1rem',
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
            }}
          >
            Overview
          </h1>

          <p
            style={{
              color: '#8a8489',
              fontSize: '0.85rem',
              marginTop: 4,
            }}
          >
            Welcome back. Here's what's happening.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          style={{
            backgroundColor: '#c49a26',
            color: '#09080a',
            padding: '0.65rem 1.4rem',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e =>
            (e.currentTarget.style.opacity = '0.85')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.opacity = '1')
          }
        >
          + Add Project
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          backgroundColor: '#2a2630',
          marginBottom: '2rem',
        }}
      >
        {[
          {
            label: 'Total Projects',
            value: loading ? '—' : totalProjects,
          },
          {
            label: 'Published',
            value: loading ? '—' : publishedProjects,
          },
          {
            label: 'Drafts',
            value: loading ? '—' : draftProjects,
          },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#131113',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: '2.4rem',
                fontWeight: 300,
                color: '#c49a26',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>

            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: '#8a8489',
                textTransform: 'uppercase',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div
        style={{
          backgroundColor: '#131113',
          border: '1px solid #2a2630',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #2a2630',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 400,
              fontSize: '1.1rem',
              color: '#f2ede6',
            }}
          >
            Recent Projects
          </h2>

          <Link
            to="/admin/projects"
            style={{
              color: '#c49a26',
              fontSize: '0.75rem',
              textDecoration: 'none',
            }}
          >
            View all →
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {error ? (
            <div
              style={{
                padding: '2rem 1.5rem',
                color: '#f87171',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          ) : loading ? (
            <div
              style={{
                padding: '2rem 1.5rem',
                color: '#8a8489',
                fontSize: '0.85rem',
              }}
            >
              Loading projects...
            </div>
          ) : recentProjects.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1.5rem',
                color: '#8a8489',
                fontSize: '0.85rem',
              }}
            >
              No projects yet. Add your first project to get started.
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid #2a2630',
                  }}
                >
                  {[
                    'Project',
                    'Category',
                    'Location',
                    'Status',
                    'Last Updated',
                    'Actions',
                  ].map(header => (
                    <th
                      key={header}
                      style={{
                        padding: '0.75rem 1.5rem',
                        textAlign: 'left',
                        fontSize: '0.62rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#8a8489',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {recentProjects.map((project, index) => {
                  const status = project.published
                    ? 'published'
                    : 'draft'

                  return (
                    <tr
                      key={project.id}
                      style={{
                        borderBottom:
                          index < recentProjects.length - 1
                            ? '1px solid #1d1b1e'
                            : 'none',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor =
                          '#1a181b')
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor =
                          'transparent')
                      }
                    >
                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          color: '#f2ede6',
                          fontSize: '0.88rem',
                          fontWeight: 500,
                        }}
                      >
                        {project.title}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          color: '#8a8489',
                          fontSize: '0.82rem',
                        }}
                      >
                        {project.category || '—'}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          color: '#8a8489',
                          fontSize: '0.82rem',
                        }}
                      >
                        {project.location || '—'}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.5rem',
                        }}
                      >
                        <StatusBadge status={status} />
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.5rem',
                          color: '#8a8489',
                          fontSize: '0.82rem',
                        }}
                      >
                        {formatDate(project.updated_at)}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.5rem',
                        }}
                      >
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          style={{
                            color: '#c49a26',
                            fontSize: '0.78rem',
                            textDecoration: 'none',
                            marginRight: '1rem',
                          }}
                        >
                          Edit
                        </Link>

                        <Link
                          to={`/admin/projects/${project.id}/preview`}
                          style={{
                            color: '#8a8489',
                            fontSize: '0.78rem',
                            textDecoration: 'none',
                          }}
                        >
                          Preview
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

