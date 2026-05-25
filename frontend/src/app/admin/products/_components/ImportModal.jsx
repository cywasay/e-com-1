"use client";
import { useState } from "react";
import { Upload, Loader2, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ImportModal({ isOpen, onClose, onImport, isImporting, result, onDownloadTemplate }) {
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) onImport(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted">
          <DialogTitle className="text-sm uppercase tracking-widest">Bulk Product Import</DialogTitle>
        </DialogHeader>
        <div className="p-8 space-y-6">
          {!result ? (
            <ImportForm file={file} setFile={setFile} isImporting={isImporting} onDownload={onDownloadTemplate} onSubmit={handleSubmit} />
          ) : (
            <ImportResult result={result} onClose={onClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImportForm({ file, setFile, isImporting, onDownload, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Button type="button" variant="link" onClick={onDownload} className="text-xs uppercase tracking-wider h-auto p-0">
          <ExternalLink size={12} /> Download Template
        </Button>
      </div>
      <div className="border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center bg-muted">
        <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="bulk-file-input" />
        <label htmlFor="bulk-file-input" className="cursor-pointer flex flex-col items-center">
          <Upload className="text-muted-foreground mb-2" size={24} />
          <span className="text-xs font-medium text-muted-foreground">{file ? file.name : "Select file"}</span>
        </label>
      </div>
      <Button type="submit" disabled={!file || isImporting} className="w-full uppercase tracking-widest">
        {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
        {isImporting ? "Importing..." : "Import Products"}
      </Button>
    </form>
  );
}

function ImportResult({ result, onClose }) {
  return (
    <div className="space-y-6">
      <Alert>
        <Check size={18} className="text-green-700" />
        <AlertDescription className="text-sm font-bold text-green-700">
          {result.data.imported} products imported
        </AlertDescription>
      </Alert>
      {result.data.failed > 0 && (
        <Alert variant="destructive">
          <AlertDescription className="text-sm font-bold">
            {result.data.failed} rows failed
          </AlertDescription>
        </Alert>
      )}
      <Button onClick={onClose} className="w-full uppercase tracking-widest">Close</Button>
    </div>
  );
}
