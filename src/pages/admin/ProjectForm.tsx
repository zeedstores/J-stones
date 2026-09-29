import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

const categories = [
  'Architectural Designs',
  'Project Management',
  'Building Construction',
  'Concrete Floor Concepts',
  'Landscaping',
  'Interlocking Paving Stones',
  'Modern Tyrolean',
  'Managerial Consultancy',
]

type ProjectFormData = {
  title: string
  category: string
  location: string
  completed_at: string
  description: string
  published: boolean
}

const emptyForm: ProjectFormData = {
  title: '',
  category: '',
  location: '',
  completed_at: '',
  description: '',
  published: false,
}

export default function ProjectForm({ mode }: { mode: 'new' | 'edit' }) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState<ProjectFormData>(emptyForm)
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
    null,
  )

  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (mode !== 'edit' || !id) return

    async function loadProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
        setMessage('Could not load project.')
        setLoading(false)
        return
      }

      setForm({
        title: data.title ?? '',
        category: data.category ?? '',
        location: data.location ?? '',
        completed_at: data.completed_at ?? '',
        description: data.description ?? '',
        published: data.published ?? false,
      })

      if (data.image_url) {
        setExistingImageUrl(data.image_url)
        setCoverPreview(data.image_url)
      }

      setLoading(false)
    }

    loadProject()
  }, [mode, id])

  function handleChange(
    field: keyof ProjectFormData,
    value: string | boolean,
  ) {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setMessage('Please choose an image file.')
      return
    }

    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setMessage('')
  }

  async function uploadCoverImage() {
    if (!coverFile) return existingImageUrl

    const fileExt =
      coverFile.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(fileName, coverFile)

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage
      .from('project-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  async function handleSave(publish: boolean) {
  if (!coverFile && !existingImageUrl) {
    setMessage('Project cover image is required.')
    return
  }

  setSaving(true)
  setMessage('')

    try {
      const imageUrl = await uploadCoverImage()

      const projectData = {
        title: form.title.trim(),
        category: form.category || null,
        location: form.location.trim() || null,
        completed_at: form.completed_at || null,
        description: form.description.trim() || null,
        published: publish,
        updated_at: new Date().toISOString(),
        ...(imageUrl ? { image_url: imageUrl } : {}),
      }

      if (mode === 'edit' && id) {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert(projectData)

        if (error) throw error
      }

      setMessage(publish ? 'Project published.' : 'Draft saved.')

      setTimeout(() => {
        navigate('/admin/projects')
      }, 700)
    } catch (error) {
      console.error(error)

      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong while saving the project.'

      setMessage(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) return

    setSaving(true)

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      setMessage(error.message)
      setSaving(false)
      setShowDeleteModal(false)
      return
    }

    navigate('/admin/projects')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            color: '#66717C',
            fontSize: '0.82rem',
          }}
        >
          Loading project…
        </div>
      </AdminLayout>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#F5F3EE',
    border: '1px solid #C7CED6',
    color: '#101820',
    padding: '0.8rem 0.9rem',
    fontSize: '0.82rem',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.45rem',
    fontSize: '0.62rem',
    letterSpacing: '0.14em',
    color: '#66717C',
    textTransform: 'uppercase',
    fontWeight: 700,
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
            {mode === 'new' ? 'Add project' : 'Edit project'}
          </h1>

          {mode === 'edit' && id && (
            <p
              style={{
                color: '#66717C',
                fontSize: '0.7rem',
                marginTop: '0.55rem',
              }}
            >
              Project ID: {id}
            </p>
          )}
        </div>

        {mode === 'edit' && (
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={saving}
            style={{
              background: 'transparent',
              border: '1px solid #D8B6B6',
              color: '#9B3434',
              padding: '0.6rem 1rem',
              cursor: saving ? 'default' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            Delete project
          </button>
        )}
      </div>

      <div
        style={{
          maxWidth: 820,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Project details */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #C7CED6',
            padding: '1.6rem',
          }}
        >
          <div
            style={{
              borderBottom: '1px solid #E1E5E9',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: '1.35rem',
                color: '#101820',
              }}
            >
              Project details
            </h2>

            <p
              style={{
                margin: '0.3rem 0 0',
                color: '#66717C',
                fontSize: '0.72rem',
              }}
            >
              Basic information about the construction project.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
            }}
          >
            <div>
              <label style={labelStyle}>Project Name</label>

              <input
                style={inputStyle}
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                placeholder="e.g. Architectural Design & Project Management"
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(2, minmax(0, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <label style={labelStyle}>Service / Category</label>

                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={e =>
                    handleChange('category', e.target.value)
                  }
                >
                  <option value="">Select service</option>

                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Location</label>

                <input
                  style={inputStyle}
                  value={form.location}
                  onChange={e =>
                    handleChange('location', e.target.value)
                  }
                  placeholder="Asaba, Delta State"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Completion Date</label>

              <input
                style={inputStyle}
                type="date"
                value={form.completed_at}
                onChange={e =>
                  handleChange('completed_at', e.target.value)
                }
              />
            </div>

            <div>
              <label style={labelStyle}>Project Description</label>

              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: 140,
                  lineHeight: 1.6,
                }}
                rows={5}
                value={form.description}
                onChange={e =>
                  handleChange('description', e.target.value)
                }
                placeholder="Describe the project, work completed, scope or key details…"
              />
            </div>
          </div>
        </div>

        {/* Cover image */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #C7CED6',
            padding: '1.6rem',
          }}
        >
          <div
            style={{
              marginBottom: '1rem',
            }}
          >
            <label style={labelStyle}>Project Cover Image</label>

            <p
              style={{
                color: '#66717C',
                fontSize: '0.72rem',
                margin: '0.25rem 0 0',
              }}
            >
              Use a clear image that represents the completed work.
            </p>
          </div>

          <div
            onClick={() => coverInputRef.current?.click()}
            style={{
              border: '1px dashed #AEB8C2',
              background: '#F5F3EE',
              minHeight: 260,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Project cover preview"
                style={{
                  width: '100%',
                  height: 320,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: '#66717C',
                  padding: '2rem',
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    border: '1px solid #C7CED6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: '#0B3768',
                    fontSize: '1.2rem',
                  }}
                >
                  ↑
                </div>

                <div
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#101820',
                  }}
                >
                  Choose project cover image
                </div>

                <div
                  style={{
                    fontSize: '0.68rem',
                    marginTop: '0.4rem',
                    color: '#66717C',
                  }}
                >
                  JPG, PNG or WebP
                </div>
              </div>
            )}
          </div>

          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleCoverChange}
          />
        </div>

        {/* Visibility */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #C7CED6',
            padding: '1.6rem',
          }}
        >
          <label style={labelStyle}>Website Visibility</label>

          <select
            style={inputStyle}
            value={form.published ? 'published' : 'draft'}
            onChange={e =>
              handleChange(
                'published',
                e.target.value === 'published',
              )
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <div
            style={{
              marginTop: '0.8rem',
              padding: '0.8rem 0.9rem',
              backgroundColor: form.published
                ? '#E8F2EC'
                : '#F5F3EE',
              border: `1px solid ${
                form.published ? '#B8D8C3' : '#D9DEE3'
              }`,
              color: form.published ? '#176B3A' : '#66717C',
              fontSize: '0.72rem',
              lineHeight: 1.6,
            }}
          >
            {form.published
              ? 'This project will be visible on the public J-STONES website.'
              : 'This project will remain hidden from the public website until published.'}
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              padding: '0.8rem 0.9rem',
              backgroundColor:
                message.includes('required') ||
                message.toLowerCase().includes('error') ||
                message.toLowerCase().includes('policy') ||
                message.toLowerCase().includes('could not')
                  ? '#F9EEEE'
                  : '#E8F2EC',
              border: `1px solid ${
                message.includes('required') ||
                message.toLowerCase().includes('error') ||
                message.toLowerCase().includes('policy') ||
                message.toLowerCase().includes('could not')
                  ? '#E2BABA'
                  : '#B8D8C3'
              }`,
              color:
                message.includes('required') ||
                message.toLowerCase().includes('error') ||
                message.toLowerCase().includes('policy') ||
                message.toLowerCase().includes('could not')
                  ? '#9B3434'
                  : '#176B3A',
              fontSize: '0.76rem',
              lineHeight: 1.5,
            }}
          >
            {message}
          </div>
        )}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.65rem',
            flexWrap: 'wrap',
            paddingBottom: '1rem',
          }}
        >
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            style={{
              background: '#FFFFFF',
              color: '#101820',
              border: '1px solid #C7CED6',
              padding: '0.75rem 1.2rem',
              cursor: saving ? 'default' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            style={{
              background: saving ? '#7890A8' : '#0B3768',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.3rem',
              cursor: saving ? 'default' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            {saving ? 'Publishing…' : 'Publish Project'}
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16, 24, 32, 0.62)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #C7CED6',
              padding: '2rem',
              maxWidth: 420,
              width: '100%',
              boxSizing: 'border-box',
              boxShadow: '0 20px 60px rgba(16, 24, 32, 0.18)',
            }}
          >
            <span
              style={{
                display: 'block',
                color: '#9B3434',
                fontSize: '0.62rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '0.65rem',
              }}
            >
              Permanent action
            </span>

            <h2
              style={{
                color: '#101820',
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 400,
                fontSize: '1.7rem',
                margin: 0,
              }}
            >
              Delete project?
            </h2>

            <p
              style={{
                color: '#66717C',
                lineHeight: 1.6,
                fontSize: '0.8rem',
                margin: '0.75rem 0 1.5rem',
              }}
            >
              This will permanently remove this project from the
              database. This action cannot be undone.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.65rem',
              }}
            >
              <button
                onClick={handleDelete}
                disabled={saving}
                style={{
                  flex: 1,
                  background: '#9B3434',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem',
                  cursor: saving ? 'default' : 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {saving ? 'Deleting…' : 'Delete'}
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  color: '#101820',
                  border: '1px solid #C7CED6',
                  padding: '0.75rem',
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}