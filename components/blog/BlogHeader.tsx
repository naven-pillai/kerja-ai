'use client';

type Props = {
  title: string;
  datePosted: string;
};

export default function BlogHeader({ title, datePosted }: Props) {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500">Published {datePosted}</p>
    </div>
  );
}
