import { VideoAspect, ZoomView } from '@zoom/react-native-videosdk';
import { View, Text, Alert } from 'react-native';
import { styles } from '../utils/styles';
import { MuteButtons } from './MuteButtons';
import Button from '../utils/lib';
import { useZoomEvents } from '../hooks/useZoomEvents';

export const VideoCallSimple = () => {
  const {
    users,
    isInSession,
    isAudioMuted,
    isVideoMuted,
    isSharing,
    joinSession,
    leaveSession,
    startShareScreen,
    stopShareScreen,
  } = useZoomEvents();

  return isInSession ? (
    <View style={styles.container}>
      {users.map(user => (
        <View style={styles.container} key={user.userId}>
          <ZoomView
            style={styles.container}
            userId={user.userId}
            fullScreen
            videoAspect={VideoAspect.PanAndScan}
          />
        </View>
      ))}
      <MuteButtons isAudioMuted={isAudioMuted} isVideoMuted={isVideoMuted} />
      <Button
        title={isSharing ? 'Stop Sharing' : 'Share Screen'}
        onPress={isSharing ? stopShareScreen : startShareScreen}
      />
      <Button title="Leave Session" color={'#f01040'} onPress={leaveSession} />
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.heading}>Zoom Video SDK</Text>
      <Text style={styles.heading}>React Native Quickstart</Text>
      <View style={styles.spacer} />
      <Button title="Join Session" onPress={joinSession} />
    </View>
  );
};
