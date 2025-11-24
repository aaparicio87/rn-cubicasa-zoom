import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import NativeCubiCasa from './specs/NativeCubiCasa';
import { MainNavigation } from './src/navigation/MainNavigation';

function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    try {
      const version = NativeCubiCasa.getSDKVersion();
      console.log('✅ SDK Version:', version);
      //NativeCubiCasa.getPropertyTypes();
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <PaperProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />
          <MainNavigation />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
