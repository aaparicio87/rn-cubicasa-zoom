import {
  DocumentDirectoryPath,
  copyFile,
  stat,
  unlink,
  mkdir,
  exists,
} from '@dr.pogodin/react-native-fs';

// Constants
export const SCANS_FOLDER = `${DocumentDirectoryPath}/scans`;

/**
 * Ensure the scans folder exists
 */
export async function ensureScansFolderExists(): Promise<void> {
  const folderExists = await exists(SCANS_FOLDER);
  if (!folderExists) {
    await mkdir(SCANS_FOLDER);
    console.log('✅ Scans folder created:', SCANS_FOLDER);
  }
}

/**
 * Copy a ZIP file from cache to the scans folder
 * @param sourcePath - Path of the original ZIP (from the SDK)
 * @param timestamp - Timestamp for the file name
 * @returns Path of the copied file
 */
export async function copyScanToDocuments(
  sourcePath: string,
  timestamp: number,
): Promise<string> {
  // Ensure the folder exists
  await ensureScansFolderExists();

  // Generate file name
  const fileName = `tela_scan_${timestamp}.zip`;
  const destPath = `${SCANS_FOLDER}/${fileName}`;

  // Copy file
  await copyFile(sourcePath, destPath);
  console.log('✅ ZIP copied to:', destPath);

  return destPath;
}

/**
 * Get the size of a file in bytes
 * @param filePath - Path of the file
 * @returns Size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  const fileStat = await stat(filePath);
  return fileStat.size;
}

/**
 * Delete a file
 * @param filePath - Path of the file to delete
 */
export async function deleteScanFile(filePath: string): Promise<void> {
  await unlink(filePath);
  console.log('🗑️ File deleted:', filePath);
}

/**
 * Format bytes to readable format (MB, KB, etc)
 * @param bytes - Size in bytes
 * @returns Formatted string (example: "45.6 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Checks if a file exists
 * @param filePath - Path
 * @returns boolean - True if the file exists, false otherwise
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    return await exists(filePath);
  } catch (error) {
    console.error('❌ Error verifying file:', error);
    return false;
  }
}