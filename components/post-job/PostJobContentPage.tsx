import PostJobForm from '@/components/post-job/PostJobForm';

type Props = {
  isPaid: boolean;
  isFeatured: boolean;
  stripeSessionId?: string;
};

export default function PostJobContentPage({ isPaid, isFeatured, stripeSessionId }: Props) {
  return (
    <main className="bg-white py-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Post an AI or Data Job
        </h1>
        <PostJobForm
          isPaid={isPaid}
          isFeatured={isFeatured}
          stripeSessionId={stripeSessionId}
        />
      </div>
    </main>
  );
}
