import React from 'react';
import { Upload, X, FileText } from 'lucide-react';

interface FileDropZoneProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview?: string | null;
  fileName?: string | null;
  accept?: string;
  label?: string;
  hint?: string;
  onRemove?: () => void;
}

export default function FileDropZone({
  onChange,
  preview,
  fileName,
  accept = 'image/jpeg,image/png',
  label = 'Glissez votre fichier ou cliquez ici',
  hint = 'Formats acceptés : JPG, PNG',
  onRemove,
}: FileDropZoneProps) {
  const isPdf = preview === 'pdf' || fileName?.toLowerCase().endsWith('.pdf');

  return (
    <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-[#1D63ED] rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
      {preview ? (
        <div className="relative w-full flex flex-col items-center justify-center p-2">
          {isPdf ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                <FileText className="w-10 h-10" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 max-w-[#200px] truncate">
                {fileName || 'Document PDF sélectionné'}
              </span>
            </div>
          ) : (
            <img
              src={preview}
              alt="Aperçu"
              className="h-40 w-auto object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-600"
            />
          )}

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-blue-50 text-[#1D63ED] rounded-full group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>

          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{hint}</span>

          <input
            type="file"
            accept={accept}
            onChange={onChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
