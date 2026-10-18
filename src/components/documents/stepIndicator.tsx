import { Camera, FileText } from 'lucide-react';

interface StepIndicatorProps {
  step: number;
}

export default function StepIndicator({ step }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {/* Étape 1 */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step >= 1
              ? 'bg-[#1D63ED] text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          <Camera className="w-5 h-5" />
        </div>
        <span
          className={`text-xs font-bold ${
            step >= 1 ? 'text-slate-900' : 'text-slate-600'
          }`}
        >
          Photo de profil
        </span>
      </div>

      {/* Ligne de séparation */}
      <div
        className={`w-12 h-0.5 rounded transition-all ${
          step >= 2 ? 'bg-[#1D63ED]' : 'bg-slate-200'
        }`}
      />

      {/* Étape 2 */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step >= 2
              ? 'bg-[#1D63ED] text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          <FileText className="w-5 h-5" />
        </div>
        <span
          className={`text-xs font-bold ${
            step >= 2 ? 'text-slate-900' : 'text-slate-600'
          }`}
        >
          Pièce d'identité
        </span>
      </div>
    </div>
  );
}