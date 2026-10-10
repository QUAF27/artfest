import React, { useState } from 'react';
import { useFest } from '../../context/FestContext';
import { FileText, Printer, Search, Download, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { QRCodeView } from '../common/QRCodeView';
import { Certificate } from '../../types';

interface CertificateGeneratorProps {
  initialCertId?: string;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ initialCertId }) => {
  const { currentFestival, certificates, issueCertificate, participants, programmes, teams } = useFest();
  const [search, setSearch] = useState('');
  const [selectedCertId, setSelectedCertId] = useState<string>(initialCertId || certificates[0]?.id || '');

  const festCertificates = certificates.filter(c => c.festivalId === currentFestival.id);
  const activeCert = festCertificates.find(c => c.id === selectedCertId) || festCertificates[0];

  const filtered = festCertificates.filter(c =>
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.certificateNumber.toLowerCase().includes(search.toLowerCase()) ||
    c.chestNumber.includes(search)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>Digital Certificate Desk & Document Engine</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cryptographically sealed merit certificates with tamper-proof QR code verification
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Certificate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Certificate Record Selector (Left side) */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs print:hidden">
          <div className="p-3.5 border-b border-neutral-200 bg-neutral-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search recipient or cert #..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-md"
              />
            </div>
          </div>

          <div className="divide-y divide-neutral-100 max-h-[500px] overflow-y-auto">
            {filtered.map(cert => {
              const isSelected = activeCert?.id === cert.id;

              return (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCertId(cert.id)}
                  className={`w-full text-left p-3.5 flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-amber-50 font-medium' : 'hover:bg-neutral-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-neutral-900">{cert.participantName}</div>
                    <div className="text-[11px] text-neutral-500">{cert.programmeTitle}</div>
                    <div className="text-[10px] font-mono text-neutral-400">{cert.certificateNumber}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-amber-700">
                      {cert.rank ? `Rank #${cert.rank}` : `Grade ${cert.grade}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Printable Canvas (Right side) */}
        <div className="lg:col-span-2">
          {activeCert ? (
            <div className="bg-white p-8 sm:p-12 rounded-2xl border-4 border-amber-600/40 shadow-xl relative overflow-hidden text-neutral-900 space-y-8 print:p-6 print:border-2 print:shadow-none">
              
              {/* Ornate Gold Border Inner Frame */}
              <div className="border-2 border-amber-500/50 p-6 sm:p-8 rounded-xl space-y-6 text-center relative bg-gradient-to-b from-amber-50/20 via-white to-amber-50/20">
                
                {/* Header */}
                <div className="space-y-1">
                  <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                    NATIONAL ARTS & CULTURAL COUNCIL
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 font-serif">
                    {currentFestival.name}
                  </h3>
                  <div className="text-xs font-semibold text-neutral-500">
                    {currentFestival.edition} · Academic Year {currentFestival.academicYear}
                  </div>
                </div>

                {/* Certificate Title Banner */}
                <div className="py-2">
                  <span className="text-sm font-extrabold tracking-widest uppercase bg-amber-100 text-amber-950 px-6 py-1.5 rounded-full border border-amber-300">
                    CERTIFICATE OF MERIT
                  </span>
                </div>

                {/* Recipient citation */}
                <div className="space-y-3 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed text-neutral-700">
                  <p>This is to officially certify that</p>
                  
                  <div className="text-xl sm:text-2xl font-black text-neutral-950 tracking-tight border-b-2 border-neutral-300 pb-1 max-w-md mx-auto">
                    {activeCert.participantName}
                  </div>
                  
                  <p className="text-xs text-neutral-600">
                    representing <strong>{activeCert.teamName}</strong> (Chest #{activeCert.chestNumber})
                  </p>

                  <p>
                    has distinguished themselves with outstanding artistic brilliance and achieved
                  </p>

                  <div className="text-lg font-bold text-amber-700 py-1">
                    {activeCert.rank ? `FIRST PLACE (RANK #${activeCert.rank})` : 'HONORABLE MERIT'}
                    {activeCert.grade && ` with ${activeCert.grade} Grade`}
                  </div>

                  <p>
                    in the competitive category of <strong>{activeCert.programmeTitle}</strong>.
                  </p>
                </div>

                {/* Signatures & Seal Section */}
                <div className="pt-8 border-t border-neutral-200 grid grid-cols-3 gap-4 items-end text-xs">
                  <div>
                    <div className="font-serif italic font-bold text-neutral-800 text-sm">
                      Dr. Rasheed C.H.
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 border-t border-neutral-300 pt-1">
                      Results Controller
                    </div>
                  </div>

                  {/* QR Security Verification Stamp */}
                  <div className="flex flex-col items-center">
                    <QRCodeView value={activeCert.verificationCode} size={64} />
                    <span className="text-[9px] font-mono text-neutral-400 mt-1">
                      {activeCert.certificateNumber}
                    </span>
                  </div>

                  <div>
                    <div className="font-serif italic font-bold text-neutral-800 text-sm">
                      Prof. Usman Ali
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 border-t border-neutral-300 pt-1">
                      Festival General Convener
                    </div>
                  </div>
                </div>

                {/* Authenticity Footer Note */}
                <div className="text-[9px] text-neutral-400 font-mono">
                  Issued on: {activeCert.issueDate} · Digital Hash: {activeCert.verificationCode}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-xl border border-neutral-200 text-center text-xs text-neutral-400">
              Select an issued certificate from the list to preview the document canvas.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
