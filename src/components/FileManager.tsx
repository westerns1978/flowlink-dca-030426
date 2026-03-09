
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, Eye, Loader2, Image as ImageIcon, Video, FileSpreadsheet, File as FileIcon, X } from 'lucide-react';
import { uploadFile, loadFiles, deleteFile, FileMetadata } from '../services/fileManagerService';

interface FileManagerProps {
  bucketName: string;
  appName: string;
}

export const FileManager: React.FC<FileManagerProps> = ({ bucketName, appName }) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{name: string, progress: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refreshFiles();
  }, [bucketName]);

  async function refreshFiles() {
    setLoading(true);
    try {
      const data = await loadFiles(bucketName);
      setFiles(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
    }
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  }

  async function uploadFiles(filesToUpload: File[]) {
    setUploading(true);
    setUploadQueue(filesToUpload.map(f => ({ name: f.name, progress: 0 })));

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      setUploadQueue(prev => prev.map((item, idx) => idx === i ? { ...item, progress: 50 } : item));
      
      try {
        await uploadFile(file, bucketName);
        setUploadQueue(prev => prev.map((item, idx) => idx === i ? { ...item, progress: 100 } : item));
      } catch (err) {
        console.error("Upload failed for", file.name, err);
      }
    }

    setTimeout(() => {
      setUploading(false);
      setUploadQueue([]);
      refreshFiles();
    }, 1000);
  }

  async function handleDelete(file: FileMetadata) {
    if (!confirm(`Delete ${file.file_name}?`)) return;
    try {
      await deleteFile(file.storage_path, bucketName, file.id);
      refreshFiles();
    } catch (err) {
      alert("Delete failed");
    }
  }

  function getFileIcon(mimeType: string) {
    if (mimeType?.startsWith('image/')) return <ImageIcon size={24} className="text-sky-400" />;
    if (mimeType?.startsWith('video/')) return <Video size={24} className="text-purple-400" />;
    if (mimeType === 'application/pdf') return <FileText size={24} className="text-red-400" />;
    if (mimeType?.includes('spreadsheet') || mimeType?.includes('csv')) return <FileSpreadsheet size={24} className="text-emerald-400" />;
    return <FileIcon size={24} className="text-slate-400" />;
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-solaris-gold animate-pulse"></div>
            {appName} Asset Storage
        </h3>
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
            Bucket: {bucketName}
        </span>
      </div>

      {/* Upload Zone */}
      <div 
        className="border-2 border-dashed border-sky-500/30 dark:border-sky-500/20 rounded-3xl p-10 
                   hover:border-sky-500 hover:bg-sky-500/5 transition-all duration-500
                   cursor-pointer bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group shadow-inner"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="text-center">
          <div className="p-4 bg-sky-500/10 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform duration-500">
            <UploadCloud size={40} className="text-sky-500" />
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-black">
            Images, PDFs, Documents supported
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {uploadQueue.map((file, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-slate-900/90 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-bold text-slate-200 truncate max-w-[200px]">{file.name}</p>
                    <span className="text-[10px] font-mono text-sky-400">{file.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-sky-500 h-full transition-all duration-500 shadow-[0_0_10px_#0ea5e9]"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {loading ? (
            [...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
            ))
        ) : files.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/20 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <FileIcon size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">No assets found in storage</p>
            </div>
        ) : (
            files.map((file) => (
                <div 
                    key={file.id}
                    className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden 
                               border border-slate-200 dark:border-slate-800 hover:border-sky-500 transition-all duration-500 shadow-lg hover:shadow-sky-500/10"
                >
                    <div className="aspect-square relative overflow-hidden">
                    {file.file_type?.startsWith('image/') ? (
                        <img
                        src={file.public_url}
                        alt={file.file_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700">
                                {getFileIcon(file.file_type)}
                            </div>
                        </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 
                                    group-hover:opacity-100 transition-all duration-300
                                    flex items-center justify-center gap-3 backdrop-blur-sm">
                        <a 
                            href={file.public_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-3 bg-white text-slate-900 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                        >
                            <Eye size={18} />
                        </a>
                        <button 
                            onClick={() => handleDelete(file)}
                            className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-xl"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                    </div>
                    
                    <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-100 dark:border-white/5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {file.file_name}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                        <p className="text-[10px] text-slate-400 font-mono">
                            {formatFileSize(file.file_size)}
                        </p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">
                            {new Date(file.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
