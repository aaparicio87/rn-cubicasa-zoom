import { View, Text, StyleSheet } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

const LoadingScans = () => {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading scans...</Text>
        </View>
    </SafeAreaView>
  )
}

export default LoadingScans

const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#666',
    },
})