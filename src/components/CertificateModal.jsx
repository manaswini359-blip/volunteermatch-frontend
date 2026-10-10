import React from 'react';
import { Award, Download, Printer, X, ShieldCheck, CheckCircle } from 'lucide-react';

export default function CertificateModal({ certificate, onClose }) {
  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-800">Certificate of Appreciation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div id="printable-certificate" className="p-8 sm:p-12 bg-white flex flex-col items-center text-center">
          <div className="w-full border-8 border-double border-amber-600/30 p-8 sm:p-10 rounded-lg relative bg-radial from-amber-50/20 to-white">
            {/* Top Seal / Badge */}
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-600 mb-4 shadow-inner">
              <Award className="w-9 h-9" />
            </div>

            <p className="text-xs font-bold tracking-widest text-amber-700 uppercase mb-1">
              VolunteerMatch Official Recognition
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-slate-900 mb-2">
              CERTIFICATE OF APPRECIATION
            </h1>
            <p className="text-xs text-slate-500 italic mb-6">
              This certificate is proudly awarded to
            </p>

            {/* Recipient Name */}
            <div className="border-b-2 border-slate-300 max-w-md mx-auto pb-2 mb-4">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                {certificate.volunteerName}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
              In grateful recognition and highest appreciation for valuable volunteer contribution and exemplary social service as{' '}
              <strong className="text-slate-800 font-semibold">{certificate.roleTask || 'Community Volunteer'}</strong>{' '}
              during the event{' '}
              <strong className="text-slate-800 font-semibold">{certificate.eventTitle}</strong>.
            </p>

            {/* Event & Org details */}
            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto text-left py-4 border-t border-slate-200 mb-6 text-xs text-slate-600">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Issued By</p>
                <p className="font-semibold text-slate-800">{certificate.organizationName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Event Date</p>
                <p className="font-semibold text-slate-800">{certificate.eventDate}</p>
              </div>
            </div>

            {/* Bottom Verification & ID */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 mb-2 sm:mb-0">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified by VolunteerMatch System</span>
              </div>
              <div className="font-mono text-slate-500 font-semibold">
                ID: {certificate.certificateId}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
