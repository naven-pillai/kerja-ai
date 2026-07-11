'use client';

import React from 'react';
import Image from 'next/image'; // ✅ Import Image

type Props = {
  label: string;
  imageUrl?: string;
  uploading: boolean;
  onUpload: (file: File) => void;
};

export default function FileUploadField({ label, imageUrl, uploading, onUpload }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block"
      />
      {imageUrl && (
        <div className="relative w-full h-40 mt-4 rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt="Uploaded Featured"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
