'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TipTapEditor from './TipTapEditor'
import { Sparkles, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { toast } from '@/components/ToastContainer'

interface ArticleEditorProps {
  initialData?: any
  isEdit?: boolean
}

export default function ArticleEditor({ initialData, isEdit }: ArticleEditorProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    coverImage: initialData?.coverImage || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
    published: initialData?.published || false,
    authorId: initialData?.authorId || 'temp_admin_id',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingMeta, setIsGeneratingMeta] = useState(false)

  useEffect(() => {
    if (!isEdit && !formData.slug && formData.title) {
      const timer = setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          slug: prev.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
        }))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [formData.title, isEdit, formData.slug])

  const handleSave = async (publishStatus: boolean) => {
    setIsSaving(true)
    const payload = { ...formData, published: publishStatus, authorId: formData.authorId || 'cm0test' }

    try {
      const url = isEdit ? `/api/articles/${initialData.id}` : '/api/articles'
      const method = isEdit ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast({ type: 'success', message: `Article ${publishStatus ? 'published' : 'saved as draft'}` })
        router.push('/admin/articles')
        router.refresh()
      } else {
        const errorData = await res.json().catch(() => ({}))
        toast({ type: 'error', message: errorData.error || `Server error (${res.status})` })
      }
    } catch (err: any) {
      toast({ type: 'error', message: err?.message || 'Network error' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!formData.title || !formData.content) {
      toast({ type: 'error', message: 'Title and content are required for AI generation' })
      return
    }
    setIsGeneratingMeta(true)
    try {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = formData.content
      const excerpt = tempDiv.textContent || tempDiv.innerText || ''
      const limitedExcerpt = excerpt.substring(0, 1000)

      const res = await fetch('/api/ai/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, excerpt: limitedExcerpt })
      })
      
      if (res.ok) {
        const data = await res.json()
        setFormData(prev => ({
          ...prev,
          metaDescription: data.metaDescription || prev.metaDescription,
          slug: isEdit ? prev.slug : (data.slug || prev.slug)
        }))
        toast({ type: 'success', message: 'AI Meta generated' })
      } else {
        toast({ type: 'error', message: 'AI generation failed' })
      }
    } catch (err) {
      toast({ type: 'error', message: 'AI request failed' })
    } finally {
      setIsGeneratingMeta(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setFormData(prev => ({ ...prev, coverImage: data.url }))
    } catch (err) {
      toast({ type: 'error', message: 'Image upload failed' })
    }
  }

  return (
    <div style={{ padding: '2rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/admin/articles" className="btn btn-ghost" style={{ paddingLeft: 0 }}>
          <ArrowLeft size={16} /> Back to Articles
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => handleSave(false)} className="btn btn-secondary" disabled={isSaving}>Save Draft</button>
          <button onClick={() => handleSave(true)} className="btn btn-primary" disabled={isSaving}>Publish</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: 12, border: '1px solid var(--ink-border)' }}>
            <input
              type="text"
              placeholder="Article Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', fontSize: '2.5rem', fontFamily: 'var(--font-display)', border: 'none', outline: 'none', marginBottom: '1.5rem', color: 'var(--ink-text-heading)' }}
            />
            
            <TipTapEditor content={formData.content} onChange={(html) => setFormData({ ...formData, content: html })} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--ink-border)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Details</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">URL Slug</label>
              <input type="text" className="form-input" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Cover Image</label>
              {formData.coverImage ? (
                <div style={{ position: 'relative', marginBottom: '0.5rem', borderRadius: 8, overflow: 'hidden', aspectRatio: '16/9' }}>
                  <img src={formData.coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={() => setFormData({ ...formData, coverImage: '' })} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>Remove</button>
                </div>
              ) : (
                <div style={{ border: '1px dashed var(--ink-border)', borderRadius: 8, padding: '1.5rem', textAlign: 'center' }}>
                  <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--ink-text-muted)' }}>
                    <ImageIcon size={24} />
                    <span style={{ fontSize: '0.875rem' }}>Click to upload cover image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--ink-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>SEO Settings</h3>
              <button onClick={handleGenerateAI} disabled={isGeneratingMeta} className="btn btn-ghost btn-sm" style={{ color: 'var(--ink-primary)', padding: '0.25rem 0.5rem' }}>
                <Sparkles size={14} /> {isGeneratingMeta ? 'Generating...' : 'AI Generate'}
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Meta Title</label>
              <input type="text" className="form-input" value={formData.metaTitle} onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })} placeholder="Falls back to article title" />
              <div className={`char-counter ${formData.metaTitle.length > 55 ? 'warn' : ''} ${formData.metaTitle.length > 60 ? 'error' : ''}`}>
                {formData.metaTitle.length}/60
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Meta Description</label>
              <textarea className="form-textarea" value={formData.metaDescription} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} />
              <div className={`char-counter ${formData.metaDescription.length > 150 ? 'warn' : ''} ${formData.metaDescription.length > 160 ? 'error' : ''}`}>
                {formData.metaDescription.length}/160
              </div>
            </div>

            <div className="serp-preview">
              <div className="serp-url">inkwell.com › articles › {formData.slug || 'slug'}</div>
              <div className="serp-title">{formData.metaTitle || formData.title || 'Your Article Title'}</div>
              <div className="serp-desc">{formData.metaDescription || 'Your auto-generated or manual meta description will appear here in search engine results.'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
