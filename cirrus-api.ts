
import { RepositoryFile } from '../types';

// Mock implementation of Cirrus File Server (TierFive) API
// In production, this would use fetch/axios to hit the real Cirrus endpoints.

export const cirrusApi = {
  
  // List files for a specific Asset context
  async listFiles(assetId: string): Promise<RepositoryFile[]> {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
      {
        id: 'file-001',
        name: 'Service_Manual_v2.5.pdf',
        type: 'PDF',
        size: '4.2 MB',
        uploadedAt: '2024-12-10 09:30 AM',
        uploadedBy: 'System (OEM)',
        cloudPath: `/repo/manuals/${assetId}/`
      },
      {
        id: 'file-002',
        name: 'debug_dump_crash.log',
        type: 'LOG',
        size: '128 KB',
        uploadedAt: '2025-02-14 08:15 AM',
        uploadedBy: 'DCA Automation',
        cloudPath: `/repo/logs/${assetId}/`
      },
      {
        id: 'file-003',
        name: 'Quasi_Firmware_3.0.1.bin',
        type: 'FIRMWARE',
        size: '150 MB',
        uploadedAt: '2025-02-01 14:00 PM',
        uploadedBy: 'Admin',
        cloudPath: `/repo/firmware/${assetId}/`
      },
      {
        id: 'file-004',
        name: 'Install_Site_Photo.jpg',
        type: 'IMAGE',
        size: '2.1 MB',
        uploadedAt: '2024-11-05 11:20 AM',
        uploadedBy: 'Field Tech App',
        cloudPath: `/repo/photos/${assetId}/`
      }
    ];
  },

  async uploadFile(file: File, assetId: string): Promise<RepositoryFile> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
        id: `file-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: 'LOG', // simplified
        size: `${(file.size / 1024).toFixed(2)} KB`,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy: 'User (Dashboard)',
        cloudPath: `/repo/uploads/${assetId}/`
    };
  }
};
