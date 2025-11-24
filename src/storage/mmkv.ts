import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
export const storage = new MMKV();

// Storage keys
export const STORAGE_KEYS = {
  SCANS: 'scans',
  LAST_PROPERTY_TYPE: 'lastPropertyType',
};
