'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Minus, Link as LinkIcon, Image as ImageIcon } from 'lucide-react'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null

  const addLink = () => {
    const url = window.prompt('URL')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      
      const formData = new FormData()
      formData.append('file', file)
      
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url }).run()
        }
      } catch (err) {
        alert('Image upload failed')
      }
    }
    input.click()
  }

  return (
    <div className="tiptap-toolbar">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''} type="button"><Bold size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''} type="button"><Italic size={16} /></button>
      <div className="divider" />
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} type="button"><Heading2 size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''} type="button"><Heading3 size={16} /></button>
      <div className="divider" />
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''} type="button"><List size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} type="button"><ListOrdered size={16} /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''} type="button"><Quote size={16} /></button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} type="button"><Minus size={16} /></button>
      <div className="divider" />
      <button onClick={addLink} className={editor.isActive('link') ? 'is-active' : ''} type="button"><LinkIcon size={16} /></button>
      <button onClick={addImage} type="button"><ImageIcon size={16} /></button>
    </div>
  )
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,   // fix SSR hydration mismatch
    extensions: [
      StarterKit.configure({
        heading: false,
        // disable StarterKit's bundled link — we add our own below
        // (avoids "Duplicate extension names: ['link']" warning)
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Write your story...' }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
