import {
  ChatMessageDeleteType,
  EventType,
  LiveStreamStatus,
  LiveTranscriptionStatus,
  MultiCameraStreamStatus,
  NetworkStatus,
  PhoneFailedReason,
  PhoneStatus,
  RecordingStatus,
  ShareAction,
  ShareStatus,
  SystemPermissionType,
  useZoom,
  ZoomVideoSdkChatMessageType,
  ZoomVideoSDKChatPrivilegeType,
  ZoomVideoSdkLiveTranscriptionMessageInfoType,
  ZoomVideoSDKTestMicStatus,
  ZoomVideoSdkUser,
  ZoomVideoSdkUserType,
} from '@zoom/react-native-videosdk';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { fetchToken } from '../utils/jwt';
import { config } from '../utils/config';

export const useZoomEvents = () => {
  const zoom = useZoom();
  const [users, setUsersInSession] = useState<ZoomVideoSdkUser[]>([]);
  const [isInSession, setIsInSession] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const joinSession = async () => {
    const token = await fetchToken({
      sessionName: config.sessionName,
      sessionKey: config.sessionPassword,
      userIdentity: config.displayName,
      role: config.roleType,
    });

    await zoom
      .joinSession({
        sessionName: config.sessionName,
        sessionPassword: config.sessionPassword,
        token: token,
        userName: config.displayName,
        audioOptions: {
          connect: true,
          mute: true,
          autoAdjustSpeakerVolume: false,
        },
        videoOptions: { localVideoOn: true },
        sessionIdleTimeoutMins: config.sessionIdleTimeoutMins,
      })
      .catch(e => {
        console.log(e);
      });
  };

  const leaveSession = () => {
    zoom.leaveSession(false);
  };

  const startShareScreen = async () => {
    try {
      console.log('Starting screen share...');
      const isOtherSharing = await zoom.shareHelper.isOtherSharing();
      const isShareLocked = await zoom.shareHelper.isShareLocked();
      if (isOtherSharing) {
        Alert.alert('Another user is currently sharing');
      } else if (isShareLocked) {
        Alert.alert('Share is locked by host');
      } else {
        zoom.shareHelper.shareScreen();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const stopShareScreen = async () => {
    try {
      await zoom.shareHelper.stopShare();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isInSession) {
      const isInSession = zoom.isInSession().then(inSession => {
        setIsInSession(inSession);
      });
    }
  }, [isInSession]);

  useEffect(() => {
    const sessionJoinListener = zoom.addListener(
      EventType.onSessionJoin,
      async (session: any) => {
        // setIsInSession(true);
        // toggleUI();
        // zoom.session.getSessionName().then(setSessionName);
        // const mySelf: ZoomVideoSdkUser = new ZoomVideoSdkUser(session.mySelf);
        // const remoteUsers: ZoomVideoSdkUser[] =
        //   await zoom.session.getRemoteUsers();
        // const muted = await mySelf?.audioStatus.isMuted();
        // const videoOn = await mySelf?.videoStatus.isOn();
        // const speakerOn = await zoom.audioHelper.getSpeakerStatus();
        // const originalAspectRatio = await zoom.videoHelper.isOriginalAspectRatioEnabled();
        // const videoMirrored = await zoom.videoHelper.isMyVideoMirrored();
        // const isReceiveSpokenLanguageContent = await zoom.liveTranscriptionHelper.isReceiveSpokenLanguageContentEnabled();

        // setUsersInSession([mySelf, ...remoteUsers]);
        // setIsMuted(muted);
        // setIsVideoOn(videoOn);
        // setIsSpeakerOn(speakerOn);
        // setFullScreenUser(mySelf);
        // setIsOriginalAspectRatio(originalAspectRatio);
        // setIsReceiveSpokenLanguageContentEnabled(isReceiveSpokenLanguageContent);
        console.log({ session });
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        const remoteUsers = await zoom.session.getRemoteUsers();
        setUsersInSession([mySelf, ...remoteUsers]);
        setIsInSession(true);
      },
    );

    const sessionLeaveListener = zoom.addListener(
      EventType.onSessionLeave,
      async (reason: any) => {
        // setIsInSession(false);
        // setUsersInSession([]);
        // navigation.goBack();
        console.log('Leave reason: ' + JSON.stringify(reason));
        setIsInSession(false);
        setUsersInSession([]);
        sessionLeaveListener.remove();
      },
    );

    const sessionNeedPasswordListener = zoom.addListener(
      EventType.onSessionNeedPassword,
      () => {
        // Alert.alert('SessionNeedPassword');
        console.log('SessionNeedPassword');
      },
    );

    const sessionPasswordWrongListener = zoom.addListener(
      EventType.onSessionPasswordWrong,
      () => {
        // Alert.alert('SessionPasswordWrong');
        console.log('SessionPasswordWrong');
      },
    );

    const userVideoStatusChangedListener = zoom.addListener(
      EventType.onUserVideoStatusChanged,
      async ({ changedUsers }: { changedUsers: ZoomVideoSdkUserType[] }) => {
        // const mySelf: ZoomVideoSdkUser = new ZoomVideoSdkUser(
        //   await zoom.session.getMySelf(),
        // );
        // changedUsers.map((u: ZoomVideoSdkUserType) => {
        //   if (mySelf?.userId === u.userId) {
        //     mySelf?.videoStatus.isOn().then(on => setIsVideoOn(on));
        //   }
        // });
        console.log(
          'onUserVideoStatusChanged: ' + JSON.stringify(changedUsers),
        );
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        changedUsers.find(user => user.userId === mySelf.userId) &&
          mySelf.videoStatus.isOn().then(on => setIsVideoMuted(!on));
      },
    );

    const userAudioStatusChangedListener = zoom.addListener(
      EventType.onUserAudioStatusChanged,
      async ({ changedUsers }: { changedUsers: ZoomVideoSdkUserType[] }) => {
        // const mySelf: ZoomVideoSdkUser = new ZoomVideoSdkUser(
        //   await zoom.session.getMySelf(),
        // );
        // changedUsers.map((u: ZoomVideoSdkUserType) => {
        //   if (mySelf?.userId === u.userId) {
        //     mySelf?.audioStatus.isMuted().then(muted => setIsMuted(muted));
        //   }
        // });
        console.log(
          'onUserAudioStatusChanged: ' + JSON.stringify(changedUsers),
        );
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        changedUsers.find(user => user.userId === mySelf.userId) &&
          mySelf.audioStatus.isMuted().then(muted => setIsAudioMuted(muted));
      },
    );

    const userJoinListener = zoom.addListener(
      EventType.onUserJoin,
      async ({ remoteUsers }: { remoteUsers: ZoomVideoSdkUserType[] }) => {
        // if (!isMounted()) return;
        // const mySelf: ZoomVideoSdkUser = await zoom.session.getMySelf();
        // const remote: ZoomVideoSdkUser[] = remoteUsers.map(
        //   (user: ZoomVideoSdkUserType) => new ZoomVideoSdkUser(user),
        // );
        // setUsersInSession([mySelf, ...remote]);
        console.log('onUserJoin: ' + JSON.stringify(remoteUsers));
        const mySelf = await zoom.session.getMySelf();
        const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
        setUsersInSession([mySelf, ...remote]);
      },
    );

    const userLeaveListener = zoom.addListener(
      EventType.onUserLeave,
      async ({
        remoteUsers,
        leftUsers,
      }: {
        remoteUsers: ZoomVideoSdkUserType[];
        leftUsers: ZoomVideoSdkUserType[];
      }) => {
        // if (!isMounted() || !isInSession) return;
        // const mySelf: ZoomVideoSdkUser = await zoom.session.getMySelf();
        // const remote: ZoomVideoSdkUser[] = await zoom.session.getRemoteUsers();
        // if (fullScreenUser) {
        //   remote.map((user: ZoomVideoSdkUserType) => {
        //     if (fullScreenUser.userId === user.userId) {
        //       setFullScreenUser(mySelf);
        //       return;
        //     }
        //   });
        // } else {
        //   setFullScreenUser(mySelf);
        // }
        // setUsersInSession([mySelf, ...remote]);
        console.log(
          'onUserLeave: ' + JSON.stringify({ leftUsers, remoteUsers }),
        );
        const mySelf = await zoom.session.getMySelf();
        const remote = remoteUsers.map(user => new ZoomVideoSdkUser(user));
        setUsersInSession([mySelf, ...remote]);
      },
    );

    const userNameChangedListener = zoom.addListener(
      EventType.onUserNameChanged,
      async ({ changedUser }) => {
        // setUsersInSession(
        //   users.map((u: ZoomVideoSdkUser) => {
        //     if (u && u.userId === changedUser.userId) {
        //       return new ZoomVideoSdkUser(changedUser);
        //     }
        //     return u;
        //   }),
        // );
        console.log('onUserNameChanged: ' + JSON.stringify({ changedUser }));
      },
    );

    const userShareStatusChangeListener = zoom.addListener(
      EventType.onUserShareStatusChanged,
      async ({
        user,
        shareAction,
      }: {
        user: ZoomVideoSdkUser;
        shareAction: ShareAction;
      }) => {
        // const mySelf: ZoomVideoSdkUserType = await zoom.session.getMySelf();

        // if (
        //   user.userId &&
        //   (shareAction.shareStatus === ShareStatus.Start ||
        //     shareAction.shareStatus === ShareStatus.Resume)
        // ) {
        //   setSharingUser(user);
        //   setFullScreenUser(user);
        //   setIsSharing(user.userId === mySelf?.userId);
        //   if (shareAction.shareType == ShareType.Camera) {
        //     setIsSharingCamera(true);
        //   }
        // } else {
        //   setSharingUser(undefined);
        //   setIsSharing(false);
        //   setIsSharingCamera(false);
        // }
        console.log(
          'onUserShareStatusChanged: ' + JSON.stringify({ user, shareAction }),
        );
        const mySelf = new ZoomVideoSdkUser(await zoom.session.getMySelf());
        if (user.userId === mySelf.userId) {
          setIsSharing(
            shareAction.shareStatus === ShareStatus.Start ||
              shareAction.shareStatus === ShareStatus.Resume,
          );
        }
      },
    );

    const userRecordingConsentListener = zoom.addListener(
      EventType.onUserRecordingConsent,
      async ({ user }: { user: ZoomVideoSdkUser }) => {
        console.log(`userRecordingConsentListener: user= ${user.userName}`);
      },
    );

    const commandReceived = zoom.addListener(
      EventType.onCommandReceived,
      (params: { sender: string; command: string }) => {
        console.log(
          'sender: ' + params.sender + ', command: ' + params.command,
        );

        if (params.command) {
          const command = JSON.parse(params.command);
          console.log(command);

          if (command.type === 'start-screen-share') {
            console.log('Command to start screen share received');
            startShareScreen();
          }
        }
      },
    );

    const chatNewMessageNotify = zoom.addListener(
      EventType.onChatNewMessageNotify,
      (newMessage: ZoomVideoSdkChatMessageType) => {
        // if (!isMounted()) return;
        // setChatMessages([
        //   new ZoomVideoSdkChatMessage(newMessage),
        //   ...chatMessages,
        // ]);
        console.log('onChatNewMessageNotify: ' + JSON.stringify(newMessage));
      },
    );

    const chatDeleteMessageNotify = zoom.addListener(
      EventType.onChatDeleteMessageNotify,
      (params: { messageID: string; deleteBy: ChatMessageDeleteType }) => {
        console.log(
          'onChatDeleteMessageNotify: messageID: ' +
            params.messageID +
            ', deleteBy: ' +
            params.deleteBy,
        );
      },
    );

    const liveStreamStatusChangeListener = zoom.addListener(
      EventType.onLiveStreamStatusChanged,
      ({ status }: { status: LiveStreamStatus }) => {
        console.log(`onLiveStreamStatusChanged: ${status}`);
      },
    );

    const liveTranscriptionStatusChangeListener = zoom.addListener(
      EventType.onLiveTranscriptionStatus,
      ({ status }: { status: LiveTranscriptionStatus }) => {
        console.log(`onLiveTranscriptionStatus: ${status}`);
      },
    );

    const liveTranscriptionMsgInfoReceivedListener = zoom.addListener(
      EventType.onLiveTranscriptionMsgInfoReceived,
      ({
        messageInfo,
      }: {
        messageInfo: ZoomVideoSdkLiveTranscriptionMessageInfoType;
      }) => {
        // console.log(messageInfo);
        // const message = new ZoomVideoSdkLiveTranscriptionMessageInfo(
        //   messageInfo,
        // );
        // console.log(
        //   `onLiveTranscriptionMsgInfoReceived: ${message.messageContent}`,
        // );
        console.log(
          `onLiveTranscriptionMsgInfoReceived: ${messageInfo.messageContent}`,
        );
      },
    );

    const originalLanguageMsgInfoReceivedListener = zoom.addListener(
      EventType.onOriginalLanguageMsgReceived,
      ({
        messageInfo,
      }: {
        messageInfo: ZoomVideoSdkLiveTranscriptionMessageInfoType;
      }) => {
        // console.log(messageInfo);
        // const message = new ZoomVideoSdkLiveTranscriptionMessageInfo(
        //   messageInfo,
        // );
        // console.log(`onOriginalLanguageMsgReceived: ${message.messageContent}`);
        console.log(
          `onOriginalLanguageMsgReceived: ${messageInfo.messageContent}`,
        );
      },
    );

    const cloudRecordingStatusListener = zoom.addListener(
      EventType.onCloudRecordingStatus,
      async ({ status }: { status: RecordingStatus }) => {
        // console.log(`cloudRecordingStatusListener: ${status}`);
        // const mySelf: ZoomVideoSdkUserType = await zoom.session.getMySelf();
        // if (status === RecordingStatus.Start) {
        //   if (!mySelf?.isHost) {
        //     const options = [
        //       {
        //         text: 'accept',
        //         onPress: async () => {
        //           await zoom.acceptRecordingConsent();
        //         },
        //       },
        //       {
        //         text: 'decline',
        //         onPress: async () => {
        //           const mySelf: ZoomVideoSdkUser =
        //             await zoom.session.getMySelf();
        //           const currentConsentType: ConsentType =
        //             await zoom.getRecordingConsentType();
        //           if (
        //             currentConsentType === ConsentType.ConsentType_Individual
        //           ) {
        //             await zoom.declineRecordingConsent();
        //           } else {
        //             await zoom.declineRecordingConsent();
        //             zoom.leaveSession(false);
        //             navigation.goBack();
        //           }
        //         },
        //       },
        //     ];
        //     Alert.alert('The session is being recorded.', '', options, {
        //       cancelable: true,
        //     });
        //   }
        //   setIsRecordingStarted(true);
        // } else {
        //   setIsRecordingStarted(false);
        // }
        console.log(`cloudRecordingStatusListener: ${status}`);
      },
    );

    const networkStatusChangeListener = zoom.addListener(
      EventType.onUserVideoNetworkStatusChanged,
      async ({
        user,
        status,
      }: {
        user: ZoomVideoSdkUser;
        status: NetworkStatus;
      }) => {
        // const networkUser: ZoomVideoSdkUser = new ZoomVideoSdkUser(user);
        // if (status == NetworkStatus.Bad) {
        //   console.log(
        //     `onUserVideoNetworkStatusChanged: status= ${status}, user= ${networkUser.userName}`,
        //   );
        // }
        console.log(
          `onUserVideoNetworkStatusChanged: status= ${status}, user= ${user.userName}`,
        );
      },
    );

    const inviteByPhoneStatusListener = zoom.addListener(
      EventType.onInviteByPhoneStatus,
      (params: { status: PhoneStatus; reason: PhoneFailedReason }) => {
        console.log(params);
        console.log('status: ' + params.status + ', reason: ' + params.reason);
      },
    );

    const multiCameraStreamStatusChangedListener = zoom.addListener(
      EventType.onMultiCameraStreamStatusChanged,
      ({
        status,
        changedUser,
      }: {
        status: MultiCameraStreamStatus;
        changedUser: ZoomVideoSdkUser;
      }) => {
        // users.map((u: ZoomVideoSdkUserType) => {
        //   if (changedUser.userId === u.userId) {
        //     if (status === MultiCameraStreamStatus.Joined) {
        //       u.hasMultiCamera = true;
        //     } else if (status === MultiCameraStreamStatus.Left) {
        //       u.hasMultiCamera = false;
        //     }
        //   }
        // });
        console.log(
          `onMultiCameraStreamStatusChanged: status= ${status}, user= ${changedUser.userName}`,
        );
      },
    );

    const requireSystemPermission = zoom.addListener(
      EventType.onRequireSystemPermission,
      ({ permissionType }: { permissionType: SystemPermissionType }) => {
        // switch (permissionType) {
        //   case SystemPermissionType.Camera:
        //     Alert.alert(
        //       "Can't Access Camera",
        //       'please turn on the toggle in system settings to grant permission',
        //     );
        //     break;
        //   case SystemPermissionType.Microphone:
        //     Alert.alert(
        //       "Can't Access Camera",
        //       'please turn on the toggle in system settings to grant permission',
        //     );
        //     break;
        // }
        console.log(`onRequireSystemPermission: ${permissionType}`);
      },
    );

    const eventErrorListener = zoom.addListener(
      EventType.onError,
      async (error: any) => {
        // console.log('Error: ' + JSON.stringify(error));
        // Alert.alert('Error: ' + error.error);
        // switch (error.errorType) {
        //   case Errors.SessionJoinFailed:
        //     // Alert.alert('Failed to join the session');
        //     setTimeout(() => navigation.goBack(), 1000);
        //     break;
        //   default:
        // }
        console.log('Error: ' + JSON.stringify(error));
      },
    );

    const callCRCDeviceStatusListener = zoom.addListener(
      EventType.onCallCRCDeviceStatusChanged,
      (params: { status: any }) => {
        console.log('callCRCDeviceStatus: ' + params.status);
      },
    );

    const chatPrivilegeChangedListener = zoom.addListener(
      EventType.onChatPrivilegeChanged,
      (params: { privilege: ZoomVideoSDKChatPrivilegeType }) => {
        console.log('ZoomVideoSdkCRCProtocolType: ' + params.privilege);
      },
    );
    const cameraControlRequestResultListener = zoom.addListener(
      EventType.onCameraControlRequestResult,
      ({ approved, user }: { approved: boolean; user: ZoomVideoSdkUser }) => {
        console.log(
          'onCameraControlRequestResult: ' + approved + user.userName,
        );
      },
    );

    const testMicStatusListener = zoom.addListener(
      EventType.onTestMicStatusChanged,
      (params: { status: ZoomVideoSDKTestMicStatus }) => {
        // console.log('ZoomVideoSDKTestMicStatus: ' + params.status);
        // if (params.status == ZoomVideoSDKTestMicStatus.CanPlay) {
        //   setCanPlayMicTest(true);
        // } else if (params.status == ZoomVideoSDKTestMicStatus.CanTest) {
        //   setCanPlayMicTest(false);
        // }
        console.log('ZoomVideoSDKTestMicStatus: ' + params.status);
      },
    );

    const callOutJoinSuccessListener = zoom.addListener(
      EventType.onCalloutJoinSuccess,
      ({
        phoneNumber,
        user,
      }: {
        phoneNumber: string;
        user: ZoomVideoSdkUser;
      }) => {
        console.log('callOutJoinSuccessListener: ' + phoneNumber);
      },
    );

    const shareContentChangedListener = zoom.addListener(
      EventType.onShareContentChanged,
      ({
        user,
        shareAction,
      }: {
        user: ZoomVideoSdkUser;
        shareAction: ShareAction;
      }) => {
        console.log(
          `shareContentChangedListener: ${user.userId}'s share content changed`,
        );
      },
    );

    const shareContentSizeChangedListener = zoom.addListener(
      EventType.onShareContentSizeChanged,
      ({
        user,
        shareAction,
      }: {
        user: ZoomVideoSdkUser;
        shareAction: ShareAction;
      }) => {
        console.log(
          `shareContentSizeChangedListener: ${user.userId}'s share content size changed`,
        );
      },
    );

    return () => {
      sessionJoinListener.remove();
      sessionLeaveListener.remove();
      sessionPasswordWrongListener.remove();
      sessionNeedPasswordListener.remove();
      userVideoStatusChangedListener.remove();
      userAudioStatusChangedListener.remove();
      userRecordingConsentListener.remove();
      userJoinListener.remove();
      userLeaveListener.remove();
      userNameChangedListener.remove();
      userShareStatusChangeListener.remove();
      chatNewMessageNotify.remove();
      liveStreamStatusChangeListener.remove();
      cloudRecordingStatusListener.remove();
      inviteByPhoneStatusListener.remove();
      eventErrorListener.remove();
      commandReceived.remove();
      chatDeleteMessageNotify.remove();
      liveTranscriptionStatusChangeListener.remove();
      liveTranscriptionMsgInfoReceivedListener.remove();
      multiCameraStreamStatusChangedListener.remove();
      requireSystemPermission.remove();
      networkStatusChangeListener.remove();
      callCRCDeviceStatusListener.remove();
      originalLanguageMsgInfoReceivedListener.remove();
      chatPrivilegeChangedListener.remove();
      cameraControlRequestResultListener.remove();
      testMicStatusListener.remove();
      callOutJoinSuccessListener.remove();
      shareContentChangedListener.remove();
      shareContentSizeChangedListener.remove();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, users]);

  return {
    zoom,
    users,
    isInSession,
    isAudioMuted,
    isVideoMuted,
    isSharing,
    joinSession,
    leaveSession,
    startShareScreen,
    stopShareScreen,
  };
};
