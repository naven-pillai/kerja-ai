'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'

import type { Editor as TinyMCEEditorType } from 'tinymce'

// TinyMCE touches window on import, so it must not render on the server.
// next/dynamic states that declaratively; the old `mounted` flag did it with
// a setState inside an effect, which re-rendered every mount for nothing.
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((m) => m.Editor), {
  ssr: false,
  loading: () => <div className="text-muted text-sm">Loading editor...</div>,
})

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function TinyMCEEditor({ value, onChange }: Props) {
  const editorRef = useRef<TinyMCEEditorType | null>(null)

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
