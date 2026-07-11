// components/common/TaxonomyIntro.tsx
type Props = {
    title: string;
    description: string;
  };
  
  export default function TaxonomyIntro({ title, description }: Props) {
    return (
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-600">{description}</p>
      </div>
    );
  }
  