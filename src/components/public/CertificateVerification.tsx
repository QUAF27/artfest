import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { ShieldCheck, Search, CheckCircle2, XCircle, Printer, Award } from 'lucide-react';
import { QRCodeView } from '../common/QRCodeView';

export const CertificateVerification: React.FC = () => {
  const { currentFestival, verifyCertificate, language } = useFest();
  const [code, setCode] = useState('');
  const [result, setResult] = useState<ReturnType<typeof verifyCertificate> | null>(null);
  const [searched, setSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const cert = verifyCertificate(code.trim());
    setResult(cert);
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
          Official Certificate Authenticity Verification
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Verify the authenticity of digital certificates issued by the Arts Festival Governing Council.
        </p>
      </div>

      {/* Verification Input Box */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter Certificate No. (e.g. AFP-2026-0081) or QR Hash"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            Verify Record
          </button>
        </form>

        <div className="mt-3 text-xs text-neutral-400 flex items-center gap-2">
          <span>Test with valid codes:</span>
          {['AFP-2026-0081', 'VRF-9810-FAYIZ-101', 'AFP-2026-0083'].map(sample => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setCode(sample);
                const cert = verifyCertificate(sample);
                setResult(cert);
                setSearched(true);
              }}
              className="text-emerald-700 font-mono hover:underline"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Result Output */}
      {searched && (
        <div>
          {result ? (
            <div className="bg-white rounded-2xl border-2 border-emerald-500/50 p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-neutral-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      OFFICIALLY VERIFIED & VALID
                    </span>
                    <h3 className="text-xl font-extrabold text-neutral-900 mt-0.5">
                      {result.participantName}
                    </h3>
                  </div>
                </div>

                <QRCodeView value={result.verificationCode} size={64} />
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-neutral-400">Certificate ID:</span>
                  <div className="font-mono font-bold text-neutral-900 text-sm mt-0.5">
                    {result.certificateNumber}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400">Competition:</span>
                  <div className="font-bold text-neutral-900 text-sm mt-0.5">
                    {result.programmeTitle}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400">House / Team:</span>
                  <div className="font-bold text-neutral-900 text-sm mt-0.5">
                    {result.teamName}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400">Merit Award / Rank:</span>
                  <div className="font-bold text-amber-600 text-sm mt-0.5">
                    {result.rank ? `Rank ${result.rank}` : 'Merit Certificate'}
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400">Awarded Grade:</span>
                  <div className="font-bold text-emerald-600 text-sm mt-0.5">
                    {result.grade || 'A'} Grade
                  </div>
                </div>

                <div>
                  <span className="text-neutral-400">Date of Issue:</span>
                  <div className="font-medium text-neutral-900 text-sm mt-0.5">
                    {result.issueDate}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <div>
                  Festival: <span className="font-semibold text-neutral-700">{currentFestival.name}</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-neutral-700 hover:text-neutral-900 font-medium"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Record</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-center space-y-2">
              <XCircle className="w-10 h-10 text-red-500 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900">Certificate Record Not Found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No official record matched the identifier "{code}". Please verify the code printed at the base of the certificate or scan the QR code again.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
