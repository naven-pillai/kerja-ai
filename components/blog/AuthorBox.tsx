import Image from 'next/image';

export default function AuthorBox() {
  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-sm p-6 flex items-start gap-5">
      <Image
        src="/naven-pillai-bio-image.jpeg"
        alt="Naven Pillai"
        width={64}
        height={64}
        className="rounded-full object-cover shrink-0 ring-2 ring-white shadow"
      />
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">About the Author</p>
        <p className="text-base font-bold text-gray-900 leading-tight">Naven Pillai</p>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
          Founder of Kerja-AI, the job board for AI, machine learning and data careers in Malaysia and Singapore. Writes about how AI is reshaping work across the region, and where the real openings are.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <a
            href="https://linkedin.com/in/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            LinkedIn
          </a>
          <a
            href="https://twitter.com/navenpillai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Twitter
          </a>
          <a
            href="https://navenpillai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Website
          </a>
        </div>
      </div>
    </div>
  );
}
