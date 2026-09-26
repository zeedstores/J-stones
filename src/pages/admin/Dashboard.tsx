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
      backgroundColor: '#E8F2EC',
      color: '#176B3A',
      border: '1px solid #B8D8C3',
    },
    draft: {
      backgroundColor: '#FFF3E7',
      color: '#A9570B',
      border: '1px solid #E8C9A5',
    },
    archived: {
      backgroundColor: '#F5EAEA',
      color: '#9B3434',
      border: '1px solid #E2BABA',
    },
  }

  return (
    <span
      style={{
        ...styles[status] ?? styles.draft,
        display: 'inline-block',
        fontSize: '0.62rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '0.3rem 0.65rem',
        fontWeight: 700,
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
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <span
            style={{
              display: 'block',
              color: '#D97924',
              fontSize: '0.65rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: 700,
              marginBottom: '0.7rem',
            }}
          >
            J-STONES / Admin
          </span>

          <h1
            style={{
              margin: 0,
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1,
              color: '#101820',
              letterSpacing: '-0.03em',
            }}
          >
            Project overview
          </h1>

          <p
            style={{
              color: '#66717C',
              fontSize: '0.82rem',
              marginTop: '0.7rem',
              lineHeight: 1.6,
            }}
          >
            Manage J-STONES projects and keep the portfolio up to date.
          </p>
        </div>

        <Link
          to="/admin/projects/new"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: '#D97924',
            color: '#FFFFFF',
            padding: '0.75rem 1.15rem',
            fontSize: '0.7rem',
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#B96118'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#D97924'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
          Add Project
        </Link>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          {
            label: 'Total Projects',
            value: loading ? '—' : totalProjects,
            detail: 'All project records',
          },
          {
            label: 'Published',
            value: loading ? '—' : publishedProjects,
            detail: 'Visible on website',
          },
          {
            label: 'Drafts',
            value: loading ? '—' : draftProjects,
            detail: 'Not yet published',
          },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #C7CED6',
              padding: '1.35rem 1.4rem',
              minHeight: 125,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontSize: '2.5rem',
                fontWeight: 400,
                color: '#0B3768',
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>

            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  color: '#101820',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                {stat.label}
              </span>

              <span
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  color: '#66717C',
                  marginTop: '0.25rem',
                }}
              >
                {stat.detail}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #C7CED6',
        }}
      >
        <div
          style={{
            padding: '1.2rem 1.4rem',
            borderBottom: '1px solid #C7CED6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: '1.35rem',
                color: '#101820',
              }}
            >
              Recent projects
            </h2>

            <p
              style={{
                margin: '0.3rem 0 0',
                color: '#66717C',
                fontSize: '0.72rem',
              }}
            >
              The latest project updates
            </p>
          </div>

          <Link
            to="/admin/projects"
            style={{
              color: '#0B3768',
              fontSize: '0.7rem',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              fontWeight: 700,
              whiteSpace: 'nowrap',
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
                color: '#9B3434',
                fontSize: '0.82rem',
              }}
            >
              {error}
            </div>
          ) : loading ? (
            <div
              style={{
                padding: '2rem 1.5rem',
                color: '#66717C',
                fontSize: '0.82rem',
              }}
            >
              Loading projects...
            </div>
          ) : recentProjects.length === 0 ? (
            <div
              style={{
                padding: '2.5rem 1.5rem',
                color: '#66717C',
                fontSize: '0.82rem',
              }}
            >
              No projects yet. Add your first J-STONES project to get
              started.
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 760,
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid #C7CED6',
                    backgroundColor: '#F5F3EE',
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
                        padding: '0.75rem 1.2rem',
                        textAlign: 'left',
                        fontSize: '0.6rem',
                        letterSpacing: '0.13em',
                        textTransform: 'uppercase',
                        color: '#66717C',
                        fontWeight: 700,
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
                            ? '1px solid #E1E5E9'
                            : 'none',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.backgroundColor =
                          '#F8F9FA')
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.backgroundColor =
                          'transparent')
                      }
                    >
                      <td
                        style={{
                          padding: '1rem 1.2rem',
                          color: '#101820',
                          fontSize: '0.84rem',
                          fontWeight: 600,
                        }}
                      >
                        {project.title}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.2rem',
                          color: '#66717C',
                          fontSize: '0.78rem',
                        }}
                      >
                        {project.category || '—'}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.2rem',
                          color: '#66717C',
                          fontSize: '0.78rem',
                        }}
                      >
                        {project.location || '—'}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.2rem',
                        }}
                      >
                        <StatusBadge status={status} />
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.2rem',
                          color: '#66717C',
                          fontSize: '0.78rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatDate(project.updated_at)}
                      </td>

                      <td
                        style={{
                          padding: '1rem 1.2rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          style={{
                            color: '#0B3768',
                            fontSize: '0.75rem',
                            textDecoration: 'none',
                            marginRight: '1rem',
                            fontWeight: 700,
                          }}
                        >
                          Edit
                        </Link>

                        <Link
                          to={`/admin/projects/${project.id}/preview`}
                          style={{
                            color: '#66717C',
                            fontSize: '0.75rem',
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
