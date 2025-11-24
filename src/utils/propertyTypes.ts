/**
 * Formats from snake_case to Title Case
 * @param type - Property type in snake_case (e.g.: "single_unit_residential")
 * @returns Formatted string (e.g.: "Single Unit Residential")
 */
export function formatPropertyType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns the emoji corresponding to each property type
 * @param type - Property type
 * @returns Emoji
 */
export function getPropertyTypeEmoji(type: string): string {
  switch (type) {
    case 'single_unit_residential':
      return '🏠';
    case 'townhouse':
      return '🏘️';
    case 'apartment':
      return '🏢';
    case 'other':
    default:
      return '📦';
  }
}

/**
 * Gets the default property type
 */
export const DEFAULT_PROPERTY_TYPE = 'other';
