'use client';

import dynamic from 'next/dynamic';

import { useRef } from 'react';
import type { Editor as TinyMCEEditorType } from 'tinymce';

// TinyMCE touches window on import, so it must not render on the server.
// next/dynamic states that declaratively; the old `mounted` flag did it with
// a setState inside an effect, which re-rendered every mount for nothing.
const Editor = dynamic(() => import('@tinymce/tinymce-react').then((m) => m.Editor), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function TinyMCEEditor({ value, onChange }: Props) {
  const editorRef = useRef<TinyMCEEditorType | null>(null);

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
