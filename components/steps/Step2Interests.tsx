import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectCard } from '../ui/SelectCard';
import { Calendar, FileText, Users, Code, PenTool, BookOpen, TrendingUp, Sparkles } from 'lucide-react';

const interestsList = [
  { id: 'events', title: 'Events', description: 'Meetups, hackathons, IRL gatherings', icon: <Calendar size={20} /> },
  { id: 'content', title: 'Content', description: 'Articles, videos, threads', icon: <FileText size={20} /> },
  { id: 'community', title: 'Community', description: 'Engage and support members', icon: <Users size={20} /> },
  { id: 'development', title: 'Development', description: 'Tools, bots, dApps', icon: <Code size={20} /> },
  { id: 'design', title: 'Design', description: 'Visual identity and assets', icon: <PenTool size={20} /> },
  { id: 'research', title: 'Research', description: 'Cover projects and ecosystem news', icon: <BookOpen size={20} /> },
  { id: 'growth', title: 'Growth', description: 'Marketing and social campaigns', icon: <TrendingUp size={20} /> },
  { id: 'other', title: 'Something else', description: 'Tell us in the field below', icon: <Sparkles size={20} /> },
];

interface Step2InterestsProps {
  interests: string[];
  setInterests: (interests: string[]) => void;
  onValidate?: (isValid: boolean) => void;
}

export function Step2Interests({ interests, setInterests, onValidate }: Step2InterestsProps) {
  const [error, setError] = useState('');

  const toggleSelection = (id: string) => {
    setInterests(
      interests.includes(id) ? interests.filter(item => item !== id) : [...interests, id]
    );
    // Clear error when user makes a selection
    if (error) {
      setError('');
    }
  };

  const validate = () => {
    if (interests.length === 0) {
      setError('Please select at least one interest');
      onValidate?.(false);
      return false;
    }
    setError('');
    onValidate?.(true);
    return true;
  };

  React.useEffect(() => {
    (window as any).__step2Validate = validate;
  }, [interests, error]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">What would you like to contribute?</h2>
        <p className="text-[#A3A3A3]">Pick wherever you&apos;d like to show up. You can do as many as you want.</p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-xl shadow-black/50">
        <SectionHeader
          title="What you&apos;d like to do"
          subtitle="Pick as many as you want — nothing is locked in."
        />

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interestsList.map((interest) => (
            <SelectCard
              key={interest.id}
              title={interest.title}
              description={interest.description}
              icon={interest.icon}
              selected={interests.includes(interest.id)}
              onClick={() => toggleSelection(interest.id)}
              type="checkbox"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
