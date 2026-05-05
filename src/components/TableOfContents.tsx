'use client'
import { useEffect, useRef, useState } from 'react'

interface Heading { id: string; text: string; level: number }

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const els = doc.querySelectorAll('h2, h3')
    const extracted: Heading[] = []
    els.forEach((el) => {
      const id = el.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || ''
      extracted.push({ id, text: el.textContent || '', level: parseInt(el.tagName[1]) })
    })
    setHeadings(extracted)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id) })
      },
      { rootMargin: '-20% 0% -60% 0%' }
    )
    document.querySelectorAll('h2, h3').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside aria-label="Table of contents" className="toc-sidebar">
      <p className="toc-title">On this page</p>
      <nav>
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`toc-link ${activeId === h.id ? 'active' : ''}`}
            style={{ paddingLeft: h.level === 3 ? '1.5rem' : '0.75rem' }}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}
