'use client'

import { useEffect, useRef, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditorType } from 'tinymce'

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function TinyMCEEditor({ value, onChange }: Props) {
  const editorRef = useRef<TinyMCEEditorType | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="text-muted text-sm">Loading editor...</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(_, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic underline forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
            'link image media table | removeformat | preview code | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; }',
        }}
      />
    </div>
  )
}
