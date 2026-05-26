import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { SelectCard } from '../ui/SelectCard';
import { Textarea } from '../ui/Input';
import { Sparkles, Compass, Hammer, Flame } from 'lucide-react';

const familiarityList = [
  { id: 'beginner', title: 'Beginner', description: 'Just getting started', icon: <Sparkles size={20} /> },
  { id: 'familiar', title: 'Familiar', description: 'Used or explored Dev Community', icon: <Compass size={20} /> },
  { id: 'builder', title: 'Builder', description: 'Actively building or contributing', icon: <Hammer size={20} /> },
  { id: 'deep', title: 'Deep Contributor', description: 'Highly active in ecosystem', icon: <Flame size={20} /> },
];

interface Step3ExperienceProps {
  experience: {
    familiarity: string;
    excites: string;
    whyJoin: string;
  };
  setExperience: (experience: any) => void;
  onValidate?: (isValid: boolean) => void;
}

export function Step3Experience({ experience, setExperience, onValidate }: Step3ExperienceProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setExperience((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!experience.familiarity) {
      newErrors.familiarity = 'Please select your familiarity level';
    }

    if (!experience.excites.trim()) {
      newErrors.excites = 'This field is required';
    } else if (experience.excites.length < 200) {
      newErrors.excites = `Please write at least 200 characters (currently ${experience.excites.length})`;
    }

    if (!experience.whyJoin.trim()) {
      newErrors.whyJoin = 'This field is required';
    } else if (experience.whyJoin.length < 200) {
      newErrors.whyJoin = `Please write at least 200 characters (currently ${experience.whyJoin.length})`;
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidate?.(isValid);
    return isValid;
  };

  React.useEffect(() => {
    (window as any).__step3Validate = validate;
  }, [experience, errors]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">Your Dev Community journey</h2>
        <p className="text-[#A3A3A3]">No wrong answers — we welcome every level of familiarity.</p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-xl shadow-black/50 flex flex-col gap-10">

        <div>
          <SectionHeader title="Familiarity with Dev Community" />
          {errors.familiarity && <div className="mb-3 p-2 bg-red-500/10 border border-red-500 rounded text-red-500 text-xs">{errors.familiarity}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familiarityList.map((item) => (
              <SelectCard
                key={item.id}
                title={item.title}
                description={item.description}
                icon={item.icon}
                selected={experience.familiarity === item.id}
                onClick={() => handleChange('familiarity', item.id)}
                type="radio"
              />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            title="What excites you about Dev Community or blockchain technology right now?"
            subtitle="A project, technology, community, or idea — anything goes."
          />
          <Textarea
            placeholder="e.g., I love how this Dev Community lets people build their own projects..."
            value={experience.excites}
            onChange={(e) => handleChange('excites', (e.target as HTMLTextAreaElement).value)}
            error={errors.excites}
            currentChars={experience.excites.length}
            minChars={200}
          />
        </div>

        <div>
          <SectionHeader
            title="Why do you want to be a part of Dev Community?"
            subtitle="Tell us what draws you to the community."
          />
          <Textarea
            placeholder="e.g., I want to grow with builders, run local events, and..."
            value={experience.whyJoin}
            onChange={(e) => handleChange('whyJoin', (e.target as HTMLTextAreaElement).value)}
            error={errors.whyJoin}
            currentChars={experience.whyJoin.length}
            minChars={200}
          />
        </div>

      </div>
    </div>
  );
}
