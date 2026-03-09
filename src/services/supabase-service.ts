
import { RepositoryFile } from '../types';
import westflow from './westflow-client';

const SUPABASE_URL = 'https://ldzzlndsspkyohvzfiiu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenpsbmRzc3BreW9odnpmaWl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTEzMDUsImV4cCI6MjA3NzI4NzMwNX0.SK2Y7XMzeGQoVMq9KAmEN1vwy7RjtbIXZf6TyNneFnI';

export const supabaseService = {
  
  /**
   * Upload an image or document to Supabase Storage
   * Buckets: 'vault' or 'scans'
   */
  async uploadFile(file: File | Blob, assetId: string, folder: 'vault' | 'scans' = 'vault'): Promise<RepositoryFile> {
    const fileName = file instanceof File ? file.name : `scan_${Date.now()}.jpg`;
    const filePath = `${assetId}/${fileName}`;
    
    // Direct upload to Supabase Storage API
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${folder}/${filePath}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Content-Type': file.type || 'image/jpeg'
      },
      body: file
    });

    if (!response.ok && response.status !== 409) { // 409 is conflict (already exists)
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    // Register the entry in the WestFlow Orchestrator DB
    await westflow.call('CRICKET', 'record_document_entry', {
      asset_id: assetId,
      file_name: fileName,
      file_type: file.type,
      storage_path: filePath,
      bucket: folder
    });

    return {
      id: `sb-${Date.now()}`,
      name: fileName,
      type: file.type.includes('pdf') ? 'PDF' : 'IMAGE',
      size: `${(file.size / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: 'Mobile App',
      cloudPath: `${folder}/${filePath}`
    };
  },

  /**
   * List files for an asset from Supabase via Orchestrator
   */
  async listFiles(assetId: string): Promise<RepositoryFile[]> {
    const res = await westflow.call('CRICKET', 'get_asset_documents', { asset_id: assetId });
    if (res.success && Array.isArray(res.data)) {
        return res.data;
    }
    // Fallback if DB is empty - return some logical defaults for the demo
    return [];
  }
};
