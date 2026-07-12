'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import type { Editor as EditorComponent } from '@tinymce/tinymce-react';

// TinyMCE touches window on import, so it must not render on the server.
// next/dynamic states that declaratively; the old `mounted` flag did it with a
// setState inside an effect, which re-rendered every mount for nothing.
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((m) => m.Editor), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownEditor({ value, onChange }: Props) {
  const editorRef = useRef<EditorComponent['editor'] | null>(null);

  return (
    <div>
      <label className="block font-medium mb-1">Content</label>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY} // ✅ Make sure you set your API Key
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(content) => onChange(content)}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic underline forecolor backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image media table | ' +
            'removeformat | preview code | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; }',
        }}
      />
    </div>
  );
}
