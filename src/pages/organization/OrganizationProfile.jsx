import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { organizationService } from '../../services/organizationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Building2, MapPin, Check, Save } from 'lucide-react';

export default function OrganizationProfile() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [organizationName, setOrganizationName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await organizationService.getMyProfile();
        setProfile(data);
        setOrganizationName(data.organizationName || '');
        setDescription(data.description || '');
        setLocation(data.location || '');
        setProfileImage(data.profileImage || '');
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
      const updated = await organizationService.updateProfile(profile.id, {
        organizationName,
        description,
        location,
        profileImage,
      });

      setProfile(updated);
      updateUser({ name: organizationName, profileImage });
      setMessage('Organization details updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update organization details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading organization profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary" />
          <span>Organization Profile</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your organization brand, mission statement, and contact location.
        </p>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={organizationName} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <div className="flex-1 w-full space-y-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Logo / Banner URL</label>
              <input
                type="url"
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Provide a direct image URL representing your foundation or NGO logo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Organization Name</label>
            <input
              type="text"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Headquarters / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, Maharashtra"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mission & About Organization</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell prospective volunteers about your ongoing missions and impact stories..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
          />
        </div>

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
