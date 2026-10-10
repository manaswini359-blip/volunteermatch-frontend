import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerService } from '../../services/volunteerService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Sparkles,
  Heart,
  Clock,
  Briefcase,
  FileText,
  Save,
  ArrowRight,
  Plus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'Communication',
  'Teaching',
  'Event Management',
  'First Aid',
  'Photography',
  'Technical Skills',
  'Leadership',
  'Crowd Management',
  'Registration Desk',
  'Donor Guidance',
  'Refreshment Support',
  'Logistics',
  'Social Media',
  'Healthcare/Medical Support'
];

const SUGGESTED_INTERESTS = [
  'Education',
  'Health & Blood Donation',
  'Environment & Nature',
  'Disaster Relief',
  'Community Service',
  'Animal Welfare',
  'Elderly Care',
  'Women & Child Welfare',
  'Youth Empowerment',
  'Arts & Culture'
];

const SUGGESTED_AVAILABILITY = [
  'Weekends',
  'Weekdays',
  'Flexible',
  'Mornings',
  'Evenings'
];

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileId, setProfileId] = useState(null);

  // Form states
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [interests, setInterests] = useState([]);
  const [customInterest, setCustomInterest] = useState('');
  const [experience, setExperience] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        const data = await volunteerService.getMyProfile();
        if (data) {
          setProfileId(data.id);
          if (data.bio) setBio(data.bio);
          if (data.skills) {
            const list = data.skills.split(',').map((s) => s.trim()).filter(Boolean);
            setSkills(list);
          }
          if (data.interests) {
            const list = data.interests.split(',').map((s) => s.trim()).filter(Boolean);
            setInterests(list);
          }
          if (data.experience) setExperience(data.experience);
          if (data.experienceLevel) setExperienceLevel(data.experienceLevel);
          if (data.availability) setAvailability(data.availability);
          if (data.location) setLocation(data.location);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingProfile();
  }, []);

  const toggleSkill = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter((s) => s !== skill));
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleAddCustomSkill = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = customSkill.trim();
      if (val && !skills.includes(val)) {
        setSkills([...skills, val]);
        setCustomSkill('');
      }
    }
  };

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleAddCustomInterest = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = customInterest.trim();
      if (val && !interests.includes(val)) {
        setInterests([...interests, val]);
        setCustomInterest('');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        name: user?.name,
        bio: bio.trim() || null,
        skills: skills.length > 0 ? skills.join(', ') : null,
        interests: interests.length > 0 ? interests.join(', ') : null,
        experience: experience.trim() || null,
        experienceLevel,
        availability: availability.trim() || null,
        location: location.trim() || null
      };

      if (profileId) {
        await volunteerService.updateProfile(profileId, payload);
      }
      navigate('/volunteer/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save profile. You can continue to the dashboard.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    navigate('/volunteer/dashboard');
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile setup..." />;
  }

  return (
    <div className="min-h-screen bg-surface py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to VolunteerMatch
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Your Volunteer Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Tell us about your skills, interests, and availability so organizations can find you. 
            All fields below are optional and you can edit them anytime.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Form Card */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* 1. Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" /> Short Description (Bio)
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell organizations about yourself, your background, or why you are passionate about volunteering..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          {/* 2. Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Skills
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Optional — click to select multiple</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {SUGGESTED_SKILLS.map((skill) => {
                const isSelected = skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>
            {/* Custom skill input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={handleAddCustomSkill}
                placeholder="Add other skill (e.g. Graphic Design, Counseling)..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[11px] text-slate-500 font-medium py-1">Selected:</span>
                {skills.map((s) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-primary font-bold text-xs rounded-lg">
                    {s}
                    <button type="button" onClick={() => toggleSkill(s)} className="text-indigo-400 hover:text-rose-600">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 3. Interests */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Areas of Interest
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Optional</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {SUGGESTED_INTERESTS.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? `✓ ${interest}` : `+ ${interest}`}
                  </button>
                );
              })}
            </div>
            {/* Custom interest input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={handleAddCustomInterest}
                placeholder="Add other interest (e.g. Tech for Good)..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="text-[11px] text-slate-500 font-medium py-1">Selected:</span>
                {interests.map((i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs rounded-lg">
                    {i}
                    <button type="button" onClick={() => toggleInterest(i)} className="text-rose-400 hover:text-rose-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 4. Experience & Experience Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" /> Previous Experience (Optional)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Optional</span>
              </label>
              <textarea
                rows={2}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Describe any past volunteering activities, student club initiatives, or relevant roles..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              >
                <option value="Beginner">Beginner (New volunteer)</option>
                <option value="Intermediate">Intermediate (1-3 events)</option>
                <option value="Experienced">Experienced (Regular lead)</option>
              </select>
            </div>
          </div>

          {/* 5. Availability & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Availability (Optional)
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Weekends, Saturdays 9am-1pm"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {SUGGESTED_AVAILABILITY.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvailability(opt)}
                    className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md font-medium"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                City / Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, Pune, Bangalore"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
            </div>
          </div>

          {/* Buttons: Save Profile and Skip for Now */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Skip for Now
            </button>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-md shadow-primary/20 transition-all disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Profile...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
