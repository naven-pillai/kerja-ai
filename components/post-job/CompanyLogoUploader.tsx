'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

type Props = {
  file: File | null;
  existingLogoUrl?: string | null;
  onChange: (file: File | null, cleared?: boolean) => void;
};

export default function CompanyLogoUploader({
  file,
  existingLogoUrl,
  onChange,
}: Props) {
  const supabase = createSupabaseBrowserClient();
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
        setDeleted(false); // reset if re-upload
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleDeleteLogo = async () => {
    if (!existingLogoUrl) return;

    const path = existingLogoUrl.split('/storage/v1/object/public/company-logos/')[1];
    if (!path) return;

    setDeleting(true);

    const { error } = await supabase.storage
      .from('company-logos')
      .remove([path]);

    if (error) {
      alert('Failed to delete logo.');
    } else {
      onChange(null, true);
      setDeleted(true);
    }

    setDeleting(false);
  };

  const renderPreview = () => {
    if (file) {
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-700">Preview:</p>
          <Image
            src={URL.createObjectURL(file)}
            alt="Company Logo"
            width={120}
            height={120}
            className="rounded-lg object-contain"
          />
        </div>
      );
    }

    if (existingLogoUrl && !deleted) {
      return (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-700">Current Logo:</p>
          <Image
            src={existingLogoUrl}
            alt="Current Logo"
            width={120}
            height={120}
            className="rounded-lg object-contain"
          />
          <button
            onClick={handleDeleteLogo}
            disabled={deleting}
            className="text-red-600 text-xs underline mt-2 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete Logo'}
          </button>
        </div>
      );
    }

    return isDragActive ? (
      <p>Drop your logo here...</p>
    ) : (
      <p>Drag and drop logo here, or click to upload</p>
    );
  };

  return (
    <div
      {...getRootProps()}
      className="mt-4 p-6 border-2 border-dashed rounded-lg cursor-pointer text-center text-sm text-gray-500 hover:border-[#1D4ED8] transition"
    >
      <input {...getInputProps()} />
      {renderPreview()}
    </div>
  );
}
