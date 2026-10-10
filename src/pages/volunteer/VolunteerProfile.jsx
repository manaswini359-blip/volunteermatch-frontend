import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { volunteerService } from '../../services/volunteerService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Mail, MapPin, Clock, Sparkles, Check, Heart, Save } from 'lucide-react';

export default function VolunteerProfile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [experience, setExperience] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Beginner');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await volunteerService.getMyProfile();
        setProfile(data);
        setName(data.name || '');
        setBio(data.bio || '');
        setSkills(data.skills || '');
        setInterests(data.interests || '');
        setLocation(data.location || '');
        setAvailability(data.availability || '');
        setProfileImage(data.profileImage || '');
        setExperience(data.experience || '');
        setExperienceLevel(data.experienceLevel || 'Beginner');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updated = await volunteerService.updateProfile(profile.id, {
        name,
        bio,
        skills,
        interests,
        location,
        availability,
        profileImage,
        experience,
        experienceLevel,
      });

      setProfile(updated);
      updateUser({ name, profileImage });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading volunteer profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Volunteer Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Keep your skills, interests, and location up-to-date so AI can recommend relevant opportunities.
        </p>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Avatar & Basic details */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <div className="flex-1 w-full space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URL</label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Paste an image link from Unsplash, Gravatar, or your preferred hosting.
            </p>
          </div>
        </div>

        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Account ID)</label>
            <input
              type="email"
              disabled
              value={profile?.email || ''}
              className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Short Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Share a short summary about your background, volunteer experiences, and motivations..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
          />
        </div>

        {/* Skills & Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Communication, Registration, Event Management, First Aid"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">Used by AI matching algorithm for 50% score weight.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" /> Interests (Comma separated)
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Healthcare, Environment, Education, Hunger Relief"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">Used by AI matching algorithm for 25% score weight.</p>
          </div>
        </div>

        {/* Location & General Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> City / Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> General Availability
            </label>
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Weekends, Saturdays 9:00 AM - 1:00 PM"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
            <p className="text-[11px] text-slate-400 mt-1">General guideline. You will always be asked to confirm availability per event.</p>
          </div>
        </div>

        {/* Experience & Experience Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Previous Volunteering / Relevant Experience (Optional)
            </label>
            <textarea
              rows={2}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Describe previous social service projects, leadership roles, or student campaigns..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            >
              <option value="Beginner">Beginner (0-1 yrs)</option>
              <option value="Intermediate">Intermediate (1-3 yrs)</option>
              <option value="Experienced">Experienced (3+ yrs)</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
