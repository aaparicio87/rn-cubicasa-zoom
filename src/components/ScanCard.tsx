import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { ScanMetadata } from '../types/scan';
import { formatFileSize } from '../utils/fileSystem';
import {
  formatPropertyType,
  getPropertyTypeEmoji,
} from '../utils/propertyTypes';
import { Share, Trash2 } from 'lucide-react-native';

interface ScanCardProps {
  scan: ScanMetadata;
  onShare: (scan: ScanMetadata) => void;
  onDelete: (scan: ScanMetadata) => void;
}

export function ScanCard({ scan, onShare, onDelete }: ScanCardProps) {
  // Format date
  const date = new Date(scan.timestamp);
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* File name */}
        <Text variant="titleMedium" numberOfLines={1} style={styles.fileName}>
          📦 {scan.fileName}
        </Text>

        {/* Property type and size */}
        <Text variant="bodyMedium" style={styles.info}>
          {getPropertyTypeEmoji(scan.propertyType)}{' '}
          {formatPropertyType(scan.propertyType)} •{' '}
          {formatFileSize(scan.fileSize)}
        </Text>

        {/* Date and time */}
        <Text variant="bodySmall" style={styles.date}>
          📅 {formattedDate} - {formattedTime}
        </Text>
      </Card.Content>

      {/* Action buttons */}
      <Card.Actions>
        <TouchableOpacity
          onPress={() => onShare(scan)}
          style={styles.iconButton}
        >
          <Share size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(scan)}
          style={styles.iconButton}
        >
          <Trash2 size={20} color="#fff" />
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  fileName: {
    marginBottom: 8,
  },
  info: {
    marginBottom: 4,
    color: '#666',
  },
  date: {
    color: '#999',
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 4,
  },
});
