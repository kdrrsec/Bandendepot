import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="bg-neutral-light w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary border-opacity-20">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4 text-primary">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

