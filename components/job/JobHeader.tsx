'use client';

type Props = {
  title: string;
};

export default function JobHeader({ title }: Props) {
  return (
    <div className="pb-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
        {title}
      </h1>
    </div>
  );
}
