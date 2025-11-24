export interface ScanMetadata {
  id: string;              // timestamp as string (example: "1234567890")
  fileName: string;        // tela_scan_1234567890.zip
  filePath: string;        // /Documents/scans/tela_scan_1234567890.zip
  timestamp: number;       // 1234567890
  propertyType: 'house' | 'apartment' | 'townhouse' | 'other';
  fileSize: number;        // size in bytes
  createdAt: string;       // ISO date string for display (example: "2025-01-01T14:30:00Z")
}

export type PropertyType = ScanMetadata['propertyType'];