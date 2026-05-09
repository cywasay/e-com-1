"use client";
import { useState } from "react";
import { Upload, X, Loader2, Check, ExternalLink } from "lucide-react";

export default function ImportModal({ isOpen, onClose, onImport, isImporting, result, onDownloadTemplate }) {
  const [file, setFile] = useState(null);
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onImport(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Bulk Product Import</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
        <div className="p-8 space-y-6">
          {!result ? (
            <ImportForm file={file} setFile={setFile} isImporting={isImporting} onDownload={onDownloadTemplate} onSubmit={handleSubmit} />
          ) : (
            <ImportResult result={result} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

function ImportForm({ file, setFile, isImporting, onDownload, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <button type="button" onClick={onDownload} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 uppercase tracking-wider"><ExternalLink size={12} /> Download Template</button>
      </div>
      <div className="border-2 border-dashed border-slate-200 rounded-md p-6 flex flex-col items-center justify-center bg-slate-50">
        <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="bulk-file-input" />
        <label htmlFor="bulk-file-input" className="cursor-pointer flex flex-col items-center">
          <Upload className="text-slate-400 mb-2" size={24} />
          <span className="text-xs font-medium text-slate-600">{file ? file.name : "Select file"}</span>
        </label>
      </div>
      <button type="submit" disabled={!file || isImporting} className="w-full bg-blue-600 text-white py-3 text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
        {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {isImporting ? "Importing..." : "Import Products"}
      </button>
    </form>
  );
}

function ImportResult({ result, onClose }) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-md bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-green-700"><Check size={18} /><span>{result.data.imported} products imported</span></div>
        {result.data.failed > 0 && <div className="flex items-center gap-2 text-sm font-bold text-red-600"><X size={18} /><span>{result.data.failed} rows failed</span></div>}
      </div>
      <button onClick={onClose} className="w-full bg-slate-900 text-white py-3 text-xs font-bold uppercase tracking-widest rounded">Close</button>
    </div>
  );
}
