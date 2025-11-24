
import { Text, Button } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Scan, Video } from 'lucide-react-native';

import styles from './styled';
import { useCallback } from 'react';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const navigateToScans = () => {
    navigation.navigate('Scans');
  };

  const navigateToZoom = () => {
    navigation.navigate('Zoom');
  };

  const renderIconScan = useCallback(() => (
      <Scan size={24} color={'#fff'} />
  ),[]);

  const renderIconZoom = useCallback(() => (
      <Video size={24} color={'#fff'} />
  ),[]);

  return (
    <SafeAreaView style={styles.container}>
      <Text variant='headlineMedium' style={styles.titleStyle}>HomeScreen</Text>
      <Button 
        mode="contained" 
        onPress={navigateToScans} 
        style={styles.button} 
        labelStyle={styles.labelButton}
        icon={renderIconScan}
      >
        Go to Scans
      </Button>
      <Button 
        mode="contained" 
        onPress={navigateToZoom} 
        style={styles.button} 
        labelStyle={styles.labelButton}
        icon={renderIconZoom}
      >
        Go to Zoom
      </Button>
    </SafeAreaView>
  )
}

export default HomeScreen