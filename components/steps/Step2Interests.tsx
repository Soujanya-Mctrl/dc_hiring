import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { Input } from '../ui/Input';
import { SelectCard } from '../ui/SelectCard';
import { Calendar, FileText, Users, Code, PenTool, Sparkles } from 'lucide-react';

const interestsList = [
  { id: 'events', title: 'Events', description: 'Meetups, hackathons, IRL gatherings', icon: <Calendar size={20} /> },
  { id: 'content', title: 'Content', description: 'Articles, videos, threads', icon: <FileText size={20} /> },
  { id: 'community', title: 'Community', description: 'Engage and support members', icon: <Users size={20} /> },
  { id: 'development', title: 'Development', description: 'Frontend, backend, APIs, systems, and more', icon: <Code size={20} /> },
  { id: 'design', title: 'Design', description: 'Visual identity and assets', icon: <PenTool size={20} /> },
  { id: 'other', title: 'Something else', description: 'Tell us in the field below', icon: <Sparkles size={20} /> },
];

interface Step2InterestsProps {
  interests: string[];
  setInterests: (interests: string[]) => void;
  otherInterest: string;
  setOtherInterest: (value: string) => void;
  developmentSelections: string[];
  setDevelopmentSelections: (value: string[]) => void;
  onValidate?: (isValid: boolean) => void;
}

const developmentOptions = [
  'Frontend',
  'Backend',
  'Full Stack',
  'Mobile',
  'DevOps',
  'AI / ML',
  'Blockchain',
  'System Design',
  'Cybersecurity',
  'Cloud Computing',
];

export function Step2Interests({
  interests,
  setInterests,
  otherInterest,
  setOtherInterest,
  developmentSelections,
  setDevelopmentSelections,
  onValidate,
}: Step2InterestsProps) {
  const [error, setError] = useState('');

  const toggleSelection = (id: string) => {
    const nextInterests = interests.includes(id)
      ? interests.filter(item => item !== id)
      : [...interests, id];

    setInterests(nextInterests);

    if (id === 'other' && !nextInterests.includes('other')) {
      setOtherInterest('');
    }

    if (id === 'development' && !nextInterests.includes('development')) {
      setDevelopmentSelections([]);
    }

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

    if (interests.includes('other') && !otherInterest.trim()) {
      setError('Please describe what you would like to do');
      onValidate?.(false);
      return false;
    }

    if (interests.includes('development') && developmentSelections.length === 0) {
      setError('Please select at least one type of development');
      onValidate?.(false);
      return false;
    }

    if (developmentSelections.length > 3) {
      setError('Please select up to 3 types of development');
      onValidate?.(false);
      return false;
    }

    setError('');
    onValidate?.(true);
    return true;
  };

  React.useEffect(() => {
    (window as any).__step2Validate = validate;
  }, [interests, error, developmentSelections]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">What would you like to contribute?</h2>
        <p className="text-text-secondary">Pick wherever you&apos;d like to show up. You can do as many as you want.</p>
      </div>

      <div className="bg-surface border border-border rounded-none p-8 shadow-xl shadow-black/50 relative overflow-hidden group">
        {/* Bracket Corners (Cyberpunk Motif) */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />

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

        {interests.includes('other') && (
          <div className="mt-6">
            <Input
              label="Describe what else you'd like to do"
              isRequired
              placeholder="Tell us your idea"
              value={otherInterest}
              onChange={(e) => setOtherInterest((e.target as HTMLInputElement).value)}
              error={error && !otherInterest.trim() ? error : undefined}
            />
          </div>
        )}

        {interests.includes('development') && (
          <div className="mt-6">
            <div className="mb-3 text-sm font-bold text-white">
              What type of development? <span className="text-text-secondary font-normal">(Choose up to 3)</span> <span className="text-accent">*</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {developmentOptions.map((type) => {
                const isSelected = developmentSelections.includes(type);

                return (
                <label
                  key={type}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${isSelected
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-input hover:border-accent/40'
                    }`}
                >
                  <input
                    type="checkbox"
                    name="developmentSelections"
                    value={type}
                    checked={isSelected}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const nextSelections = checked
                        ? [...developmentSelections, e.target.value]
                        : developmentSelections.filter((item) => item !== e.target.value);

                      if (checked && developmentSelections.length >= 3) {
                        setError('Please select up to 3 types of development');
                        onValidate?.(false);
                        return;
                      }

                      setDevelopmentSelections(nextSelections);
                      if (error) setError('');
                    }}
                    className="h-4 w-4 accent-accent"
                  />
                  <span className="text-sm text-white">{type}</span>
                </label>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              It&apos;s okay if you&apos;re still learning (or want to learn)— we would be happy to help you grow.
            </p>
            {error && interests.includes('development') && developmentSelections.length === 0 && (
              <span className="mt-2 block text-xs text-red-500">{error}</span>
            )}
            {error && developmentSelections.length > 3 && (
              <span className="mt-2 block text-xs text-red-500">{error}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
