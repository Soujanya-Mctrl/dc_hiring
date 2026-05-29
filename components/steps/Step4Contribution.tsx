import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectCard } from '../ui/SelectCard';
import { Textarea } from '../ui/Input';

const timeCommitmentList = [
  { id: 'few', title: 'A few hours', description: '1–3 hrs/week' },
  { id: 'quite', title: 'Quite a bit', description: '3–5 hrs/week' },
  { id: 'significant', title: 'Significant time', description: '5–10 hrs/week' },
  { id: 'allin', title: 'I\'m all in', description: '10+ hrs/week' },
];

// URL validation
const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

interface Step4ContributionProps {
  contribution: {
    proud: string;
    timeCommit: string;
  };
  setContribution: (contribution: any) => void;
  onValidate?: (isValid: boolean) => void;
}

export function Step4Contribution({ contribution, setContribution, onValidate }: Step4ContributionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setContribution((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const isValidUrl = (str: string): boolean => {
    if (!str.trim()) return false;
    // Check if it's a URL or just text
    if (str.startsWith('http://') || str.startsWith('https://')) {
      return validateUrl(str);
    }
    // If it looks like a URL but doesn't have protocol, check if it's valid with https
    if (str.includes('.') && !str.includes(' ')) {
      return validateUrl(`https://${str}`);
    }
    return true; // Accept as description
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!contribution.proud.trim()) {
      newErrors.proud = 'This field is required';
    } else if (!isValidUrl(contribution.proud)) {
      newErrors.proud = 'Please enter a valid link or description';
    }

    if (!contribution.timeCommit) {
      newErrors.timeCommit = 'Please select a time commitment';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidate?.(isValid);
    return isValid;
  };

  React.useEffect(() => {
    (window as any).__step4Validate = validate;
  }, [contribution, errors]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">How involved do you want to be?</h2>
        <p className="text-text-secondary">Tell us what you bring and how much time you can commit.</p>
      </div>

      <div className="bg-surface border border-border rounded-none p-8 shadow-xl shadow-black/50 relative overflow-hidden group flex flex-col gap-10">
        {/* Bracket Corners (Cyberpunk Motif) */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />

        <div>
          <SectionHeader
            title="Share something you're proud of"
            subtitle="A blog post, side project, event, design, community — paste a link or just describe it."
          />
          <Textarea
            label="Link or description"
            isRequired
            placeholder="Paste a link, or tell us about something you're proud of..."
            value={contribution.proud}
            onChange={(e) => handleChange('proud', (e.target as HTMLTextAreaElement).value)}
            error={errors.proud}
            className="min-h-[150px]"
          />
        </div>

        <div>
          <SectionHeader
            title="Time you can commit"
            subtitle="Be honest — there's room for every level."
          />
          {errors.timeCommit && <div className="mb-3 p-2 bg-red-500/10 border border-red-500 rounded text-red-500 text-xs">{errors.timeCommit}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeCommitmentList.map((item) => (
              <SelectCard
                key={item.id}
                title={item.title}
                description={item.description}
                selected={contribution.timeCommit === item.id}
                onClick={() => handleChange('timeCommit', item.id)}
                type="radio"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
