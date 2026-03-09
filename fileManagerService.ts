
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ldzzlndsspkyohvzfiiu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenpsbmRzc3BreW9odnpmaWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTEzMDUsImV4cCI6MjA3NzI4NzMwNX0.SK2Y7XMzeGQoVMq9KAmEN1vwy7RjtbIXZf6TyNneFnI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const APP_BUCKETS: Record<string, string[]> = {
  'katie': ['katie-photos', 'katie-reports', 'service-manuals'],
  'flowview': ['flowview-exports'],
  'aiva': ['aiva-documents'],
  'cricket': ['cricket-telemetry'],
  'flowhub': ['flowhub-uploads', 'flowhub-processed'],
  'acs-therapyhub': ['therapyhub-patient-files'],
  'storyscribe': ['gemynd-files', 'storyscribe-videos'],
  'wissum': ['dan-ai-lab', 'gemynd-files'],
  'gemynd-portal': ['client-documents', 'documents']
};

export interface FileMetadata {
  id: string;
  file_name: string;
  storage_path: string;
  bucket: string;
  file_type: string;
  file_size: number;
  public_url: string;
  created_at: string;
}

export async function uploadFile(file: File, bucketName: string) {
  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${cleanName}`;
  
  const { data, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (uploadError) throw uploadError;
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
  
  const { error: dbError } = await supabase.from('file_metadata').insert({
    file_name: file.name,
    storage_path: fileName,
    bucket: bucketName,
    file_type: file.type,
    file_size: file.size,
    public_url: publicUrl,
    created_at: new Date().toISOString()
  });

  // If file_metadata table doesn't exist yet, we still return the url for UI purposes
  if (dbError) console.warn("Metadata persistence failed, bucket upload successful:", dbError.message);
  
  return { fileName, publicUrl };
}

export async function loadFiles(bucketName: string, limit = 50): Promise<FileMetadata[]> {
  const { data: files, error } = await supabase
    .from('file_metadata')
    .select('*')
    .eq('bucket', bucketName)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    // Fallback: List directly from storage if metadata table is missing/empty
    const { data: bucketFiles, error: bucketError } = await supabase.storage
      .from(bucketName)
      .list('', { limit, sortBy: { column: 'created_at', order: 'desc' } });
      
    if (bucketError) return [];
    
    return bucketFiles.map(f => ({
      id: f.id,
      file_name: f.name,
      storage_path: f.name,
      bucket: bucketName,
      file_type: f.metadata?.mimetype || 'application/octet-stream',
      file_size: f.metadata?.size || 0,
      public_url: supabase.storage.from(bucketName).getPublicUrl(f.name).data.publicUrl,
      created_at: f.created_at
    }));
  }
  
  return files || [];
}

export async function deleteFile(fileName: string, bucketName: string, fileId?: string) {
  const { error: storageError } = await supabase.storage
    .from(bucketName)
    .remove([fileName]);
  
  if (storageError) throw storageError;
  
  if (fileId) {
    await supabase.from('file_metadata').delete().eq('id', fileId);
  }
  
  return { success: true };
}
