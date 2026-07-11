'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState, useEffect } from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownEditor({ value, onChange }: Props) {
  const editorRef = useRef<Editor['editor'] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Only mount TinyMCE on the client side
  }, []);

  if (!mounted) {
    return <div>Loading editor...</div>; // Optional loading fallback
  }

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
