import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { SectionHeader } from '../ui/SectionHeader';

interface Step1AboutProps {
  formData: {
    fullName: string;
    email: string;
    location: string;
    accommodation: string;
    twitter: string;
    discord: string;
    linkedin: string;
    github: string;
  };
  setFormData: (data: any) => void;
  onValidate?: (isValid: boolean) => void;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateTwitterHandle = (twitter: string): boolean => {
  const twitterRegex = /^@?[a-zA-Z0-9_]{1,15}$/;
  return twitterRegex.test(twitter);
};

const validateDiscordHandle = (discord: string): boolean => {
  // Discord username or username#discriminator format
  const discordRegex = /^[a-zA-Z0-9._-]{2,32}(#\d{4})?$/;
  return discordRegex.test(discord);
};

export function Step1About({ formData, setFormData, onValidate }: Step1AboutProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email format';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Where you live is required';
    }

    if (!formData.accommodation.trim()) {
      newErrors.accommodation = 'Accommodation type is required';
    }

    if (!formData.discord.trim()) {
      newErrors.discord = 'Discord handle is required';
    } else if (!validateDiscordHandle(formData.discord)) {
      newErrors.discord = 'Please enter a valid Discord handle (e.g., username or username#1234)';
    }

    if (!formData.twitter.trim()) {
      newErrors.twitter = 'Twitter handle is required';
    } else if (!validateTwitterHandle(formData.twitter)) {
      newErrors.twitter = 'Please enter a valid Twitter handle (e.g., @username)';
    }

    if (!formData.linkedin.trim()) {
      newErrors.linkedin = 'LinkedIn profile is required';
    } else if (!validateTwitterHandle(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn profile URL';
    }

    if (!formData.github.trim()) {
      newErrors.github = 'GitHub profile is required';
    } else if (!validateTwitterHandle(formData.github)) {
      newErrors.github = 'Please enter a valid GitHub profile URL';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValidate?.(isValid);
    return isValid;
  };

  React.useEffect(() => {
    // Expose validate function to parent if needed
    (window as any).__step1Validate = validate;
  }, [formData, errors]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-white mb-2">Apply to join Dev Community</h2>
        <p className="text-[#A3A3A3]">How should we reach you, and where can we find you online.</p>
      </div>

      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-8 shadow-xl shadow-black/50">

        {/* Personal info */}
        <SectionHeader title="Personal info" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Input
            label="Full name"
            isRequired
            placeholder="Your name"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', (e.target as HTMLInputElement).value)}
            error={errors.fullName}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
          />
          <Input
            label="Email"
            isRequired
            placeholder="you@example.com"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', (e.target as HTMLInputElement).value)}
            error={errors.email}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>}
          />
        </div>

        {/* Location */}
        <SectionHeader title="Location" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Input
            label="Where do you live?"
            isRequired
            placeholder="Your area or city"
            value={formData.location}
            onChange={(e) => handleChange('location', (e.target as HTMLInputElement).value)}
            error={errors.location}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>}
          />
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-bold text-white">
              Accommodation <span className="text-[#00C652]">*</span>
            </label>
            <div className="relative">
              <select
                className={`w-full bg-[#1A1A1A] border rounded-xl px-4 py-3.5 focus:outline-none transition-colors ${formData.accommodation ? 'text-white' : 'text-[#737373]'} ${errors.accommodation ? 'border-red-500 focus:border-red-500' : 'border-[#262626] focus:border-[#00C652]'}`}
                value={formData.accommodation}
                onChange={(e) => handleChange('accommodation', e.target.value)}
                required
              >
                <option value="" disabled>
                  Select DP / Mess / Hostel
                </option>
                <option value="DP">DP</option>
                <option value="Mess">Mess</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>
            {errors.accommodation && <span className="text-xs text-red-500 mt-1">{errors.accommodation}</span>}
          </div>
        </div>

        {/* Socials */}
        <SectionHeader title="Socials" subtitle="So we can find you in the community." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Discord"
            isRequired
            placeholder="username#1234"
            value={formData.discord}
            onChange={(e) => handleChange('discord', (e.target as HTMLInputElement).value)}
            error={errors.discord}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01M15 12h.01M7.5 7.5c3.5-1 5.5-1 9 0M7 16.5c-1.5 1.5-3 2-3 2C5 12 5 8 7.5 5.5c2.5-2.5 6.5-2.5 9 0C19 8 19 12 17 18.5c0 0-1.5-.5-3-2M12 16v3M12 2v2" /></svg>}
          />
          <Input
            label="X (Twitter)"
            isRequired
            placeholder="@handle"
            value={formData.twitter}
            onChange={(e) => handleChange('twitter', (e.target as HTMLInputElement).value)}
            error={errors.twitter}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>}
          />
          <Input
            label="LinkedIn"
            isRequired
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', (e.target as HTMLInputElement).value)}
            error={errors.linkedin}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>}
          />
          <Input
            label="GitHub"
            isRequired
            placeholder="https://github.com/username"   
            value={formData.github}
            onChange={(e) => handleChange('github', (e.target as HTMLInputElement).value)}
            error={errors.github}
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>}
          />
        </div>

      </div>
    </div>
  );
}
