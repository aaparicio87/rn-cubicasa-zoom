import { StyleSheet, View } from 'react-native'
import { Text, } from 'react-native-paper';
import { ScanMetadata } from '../../../types/scan';
import { useMemo } from 'react';

interface IHeaderList {
  scans: ScanMetadata[];
}

const HeaderList = ({ scans }: IHeaderList) => {

    const textDescription = useMemo(() => {
      if (scans.length === 0) {
        return 'No scans'
      }
      return `${scans.length} ${scans.length === 1 ? 'scan' : 'scans'}`
    }, [scans])

  return (
    <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Tela Scans
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {textDescription}
            </Text>
    </View>
  )
}

export default HeaderList

const styles =  StyleSheet.create({
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        color: '#666',
        marginTop: 4,
    },
})