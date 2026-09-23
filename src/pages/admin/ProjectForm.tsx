import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { supabase } from '../../lib/supabase'

const categories = [
  'Residential',
  'Commercial',
  'Estate Development',
  'Renovation',
  'Land Sales',
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
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

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
    value: string | boolean
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

    const fileExt = coverFile.name.split('.').pop()?.toLowerCase() || 'jpg'
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
    if (!form.title.trim()) {
      setMessage('Project name is required.')
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
        <p style={{ color: '#8a8489' }}>Loading project…</p>
      </AdminLayout>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#09080a',
    border: '1px solid #2a2630',
    color: '#f2ede6',
    padding: '0.8rem 1rem',
    fontSize: '0.88rem',
    outline: 'none',
    fontFamily: "'Work Sans', sans-serif",
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.45rem',
    fontSize: '0.62rem',
    letterSpacing: '0.16em',
    color: '#c49a26',
    textTransform: 'uppercase',
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
            {mode === 'new' ? 'Add Project' : 'Edit Project'}
          </h1>

          {mode === 'edit' && id && (
            <p
              style={{
                color: '#8a8489',
                fontSize: '0.75rem',
                marginTop: '0.4rem',
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
              background: 'none',
              border: '1px solid #2a2630',
              color: '#f87171',
              padding: '0.6rem 1rem',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        )}
      </div>

      <div
        style={{
          maxWidth: 760,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        {/* Project details */}
        <div
          style={{
            background: '#131113',
            border: '1px solid #2a2630',
            padding: '1.75rem',
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
              placeholder="e.g. Karaye Residence"
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            <div>
              <label style={labelStyle}>Category</label>

              <select
                style={inputStyle}
                value={form.category}
                onChange={e => handleChange('category', e.target.value)}
              >
                <option value="">Select category</option>

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
                onChange={e => handleChange('location', e.target.value)}
                placeholder="Awka, Anambra State"
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
            <label style={labelStyle}>Description</label>

            <textarea
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
              rows={5}
              value={form.description}
              onChange={e =>
                handleChange('description', e.target.value)
              }
              placeholder="Describe the project…"
            />
          </div>
        </div>

        {/* Cover image */}
        <div
          style={{
            background: '#131113',
            border: '1px solid #2a2630',
            padding: '1.75rem',
          }}
        >
          <label style={labelStyle}>Cover Image</label>

          <div
            onClick={() => coverInputRef.current?.click()}
            style={{
              border: '1px dashed #2a2630',
              background: '#09080a',
              minHeight: 220,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
            }}
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Project cover preview"
                style={{
                  width: '100%',
                  height: 260,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  color: '#8a8489',
                  padding: '2rem',
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  ↑
                </div>

                <div style={{ fontSize: '0.82rem' }}>
                  Click to choose project cover image
                </div>

                <div
                  style={{
                    fontSize: '0.68rem',
                    marginTop: '0.4rem',
                    color: '#625e62',
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
            background: '#131113',
            border: '1px solid #2a2630',
            padding: '1.5rem',
          }}
        >
          <label style={labelStyle}>Visibility</label>

          <select
            style={inputStyle}
            value={form.published ? 'published' : 'draft'}
            onChange={e =>
              handleChange(
                'published',
                e.target.value === 'published'
              )
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <p
            style={{
              color: '#8a8489',
              fontSize: '0.78rem',
              lineHeight: 1.6,
              marginTop: '0.75rem',
            }}
          >
            {form.published
              ? 'This project will be visible on the public website.'
              : 'This project will remain hidden from the public website.'}
          </p>
        </div>

        {/* Message */}
        {message && (
          <p
            style={{
              color:
                message.includes('required') ||
                message.toLowerCase().includes('error') ||
                message.toLowerCase().includes('policy')
                  ? '#f87171'
                  : '#4ade80',
              fontSize: '0.8rem',
              margin: 0,
            }}
          >
            {message}
          </p>
        )}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            style={{
              background: 'transparent',
              color: '#f2ede6',
              border: '1px solid #2a2630',
              padding: '0.75rem 1.25rem',
              cursor: saving ? 'default' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : 'Save Draft'}
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            style={{
              background: '#c49a26',
              color: '#09080a',
              border: 'none',
              padding: '0.75rem 1.25rem',
              cursor: saving ? 'default' : 'pointer',
              fontWeight: 600,
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
            background: '#09080acc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#131113',
              border: '1px solid #2a2630',
              padding: '2rem',
              maxWidth: 400,
              width: '100%',
            }}
          >
            <h2
              style={{
                color: '#f2ede6',
                fontFamily: "'Fraunces', serif",
                fontWeight: 400,
                marginTop: 0,
              }}
            >
              Delete project?
            </h2>

            <p
              style={{
                color: '#8a8489',
                lineHeight: 1.6,
                margin: '0.75rem 0 1.5rem',
              }}
            >
              This will permanently remove this project from the
              database.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
              }}
            >
              <button
                onClick={handleDelete}
                disabled={saving}
                style={{
                  flex: 1,
                  background: '#7f1d1d',
                  color: '#f87171',
                  border: 'none',
                  padding: '0.7rem',
                  cursor: saving ? 'default' : 'pointer',
                }}
              >
                {saving ? 'Deleting…' : 'Delete'}
              </button>

              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={saving}
                style={{
                  flex: 1,
                  background: 'transparent',
                  color: '#f2ede6',
                  border: '1px solid #2a2630',
                  padding: '0.7rem',
                  cursor: 'pointer',
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