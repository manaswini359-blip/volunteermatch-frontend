import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { certificateService } from '../../services/certificateService';
import CertificateModal from '../../components/CertificateModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Award, Download, Calendar, Building2, ShieldCheck, Eye } from 'lucide-react';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const profile = await volunteerService.getMyProfile();
        const list = await certificateService.getVolunteerCertificates(profile.id);
        setCertificates(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading earned certificates..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <span>My Verified Certificates</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official certificates of appreciation issued by organizations for your completed social service.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">No Certificates Issued Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Attend your selected events and complete your assigned roles to receive verified certificates of appreciation!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Verified Certificate</span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-400">
                    {cert.certificateId}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{cert.eventTitle}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> Issued by {cert.organizationName}
                </p>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p>
                    Role: <strong className="text-slate-800">{cert.roleTask || 'Community Volunteer'}</strong>
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" /> Event Date: {cert.eventDate}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Tamper-proof record
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCert(cert)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View & Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          certificate={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
