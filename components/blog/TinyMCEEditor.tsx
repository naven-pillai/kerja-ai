'use client';

import { Editor } from '@tinymce/tinymce-react';
import { useRef, useState, useEffect } from 'react';
import type { Editor as TinyMCEEditorType } from 'tinymce';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TinyMCEEditor({ value, onChange }: Props) {
  const editorRef = useRef<TinyMCEEditorType | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        init={{
          height: 500,
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

          // ✅ This adds options inside the "Insert/Edit Link" dialog
          rel_list: [
            { title: 'DoFollow (default)', value: '' },
            { title: 'NoFollow', value: 'nofollow' },
            { title: 'Sponsored', value: 'sponsored' }
          ],

          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; }',
        }}
        onEditorChange={(content) => {
          onChange(content);
        }}
      />
    </div>
  );
}
