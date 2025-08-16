'use client'
import { useCallback, useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import { TextStyle } from '@tiptap/extension-text-style'
import { createClient } from '@supabase/supabase-js'

type Props = {
  value: string
  onChange: (html: string) => void
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RichTextEditor({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      ListItem,
      TextStyle,
      Image.configure({ allowBase64: false }),
    ],
    content: value || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[240px] rounded border p-3 bg-white dark:bg-gray-900 prose dark:prose-invert max-w-none focus:outline-none text-left',
        dir: 'ltr'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  const triggerUpload = useCallback(() => {
    if (!editor) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return
      setUploading(true)
      try {
        // Store inline images under bucket: post-media, folder: images/
        const filePath = `images/${Date.now()}_${file.name}`
        const { error } = await supabase.storage
          .from('post-media')
          .upload(filePath, file, { upsert: true })
        if (error) throw error
        const { data } = supabase.storage.from('post-media').getPublicUrl(filePath)
        editor.chain().focus().setImage({ src: data.publicUrl, alt: '' }).run()
      } catch {
        // swallow
      } finally {
        setUploading(false)
      }
    }
    input.click()
  }, [editor])

  if (!editor) return null

  const isImageSelected = editor.isActive('image')
  const insideList = editor.isActive('bulletList') || editor.isActive('orderedList')
  const fontSizeToLevel: Record<string, number> = {
    '2em': 1,
    '1.5em': 2,
    '1.25em': 3,
    '1.125em': 4,
    '1em': 5,
    '0.875em': 6,
  }
  const levelToFontSize: Record<number, string> = {
    1: '2em',
    2: '1.5em',
    3: '1.25em',
    4: '1.125em',
    5: '1em',
    6: '0.875em',
  }
  const currentFontSize = editor.getAttributes('textStyle')?.fontSize as string | undefined
  const activeHeadingLevel = insideList
    ? (currentFontSize ? (fontSizeToLevel[currentFontSize] || 0) : 0)
    : ([1, 2, 3, 4, 5, 6].find((lvl) => editor.isActive('heading', { level: lvl })) || 0)

  const getActiveHeadingLevel = (): number | undefined => {
    return [1, 2, 3, 4, 5, 6].find((lvl) => editor.isActive('heading', { level: lvl }))
  }

  const handleToggleBulletList = () => {
    const chain = editor.chain().focus()
    const headingLvl = getActiveHeadingLevel()
    if (headingLvl) {
      chain.setParagraph().setMark('textStyle', { fontSize: levelToFontSize[headingLvl] }).toggleBulletList().run()
    } else {
      chain.toggleBulletList().run()
    }
  }

  const handleToggleOrderedList = () => {
    const chain = editor.chain().focus()
    const headingLvl = getActiveHeadingLevel()
    if (headingLvl) {
      chain.setParagraph().setMark('textStyle', { fontSize: levelToFontSize[headingLvl] }).toggleOrderedList().run()
    } else {
      chain.toggleOrderedList().run()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded border bg-gray-50 p-2 dark:bg-gray-800/40">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-black text-white' : 'bg-white dark:bg-gray-900'}`}>B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-black text-white' : 'bg-white dark:bg-gray-900'}`}>I</button>
        <button type="button" onClick={handleToggleBulletList} className={`px-2 py-1 rounded ${editor.isActive('bulletList') ? 'bg-black text-white' : 'bg-white dark:bg-gray-900'}`}>• List</button>
        <button type="button" onClick={handleToggleOrderedList} className={`px-2 py-1 rounded ${editor.isActive('orderedList') ? 'bg-black text-white' : 'bg-white dark:bg-gray-900'}`}>1. List</button>
        <div className="inline-flex items-center gap-1">
          <select
            aria-label="Başlık seviyesi"
            className={`px-2 py-1 rounded border bg-white dark:bg-gray-900 ${activeHeadingLevel ? 'border-black' : ''}`}
            value={activeHeadingLevel}
            onChange={(e) => {
              const lvl = Number(e.target.value)
              const chain = editor.chain().focus()
              if (insideList) {
                // Liste içinde heading yerine font-size mark uygula
                if (!lvl) {
                  chain.unsetMark('textStyle')
                } else {
                  chain.setMark('textStyle', { fontSize: levelToFontSize[lvl] })
                }
              } else {
                if (!lvl) chain.setParagraph()
                else chain.setHeading({ level: lvl as 1 | 2 | 3 | 4 | 5 | 6 })
              }
              chain.run()
            }}
          >
            <option value={0}>P</option>
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
            <option value={5}>H5</option>
            <option value={6}>H6</option>
          </select>
        </div>
        <span className="mx-2 h-4 w-px bg-gray-300" />
        <button type="button" onClick={triggerUpload} className="px-3 py-1 rounded border">{uploading ? 'Yükleniyor...' : 'Resim Ekle'}</button>
        {isImageSelected && (
          <button type="button" onClick={() => editor.chain().focus().deleteSelection().run()} className="px-3 py-1 rounded border">Resmi Sil</button>
        )}
        <span className="mx-2 h-4 w-px bg-gray-300" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className="px-2 py-1 rounded bg-white dark:bg-gray-900">Geri</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className="px-2 py-1 rounded bg-white dark:bg-gray-900">İleri</button>
      </div>
      <EditorContent editor={editor} className="tiptap" />
      <div className="text-xs text-gray-500">İpucu: Bir resmi seçip &quot;Resmi Sil&quot; ile kaldırabilirsiniz.</div>
    </div>
  )
}

