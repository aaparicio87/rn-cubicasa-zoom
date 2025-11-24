import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';
import { VideoCallSimple } from './components/VideoCallSimple';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePermission } from './utils/lib';
import { styles } from './utils/styles';

const ZoomScreen = () => {
  usePermission();

  return (
    <ZoomVideoSdkProvider
      config={{
        appGroupId: 'group.org.reactjs.native.example.PocCubicasa',
        domain: 'zoom.us',
        enableLog: true,
      }}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <VideoCallSimple />
      </SafeAreaView>
    </ZoomVideoSdkProvider>
  );
};

export default ZoomScreen;
