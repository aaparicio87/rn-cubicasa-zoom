import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper';

export default function EmptyListScan() {
  return (
    <View style={styles.emptyContainer}>
        <Text variant="headlineSmall" style={styles.emptyTitle}>
            No scans
        </Text>
        <Text variant="bodyMedium" style={styles.emptyText}>
            Press the 📸 button to start your first scan
        </Text>
    </View>
  )
}


const styles =  StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyTitle: {
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
  },
})