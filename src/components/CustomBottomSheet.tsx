import { type PropsWithChildren, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

import { XCircle } from 'lucide-react-native';
import { Text } from 'react-native-paper';
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

type TProps = PropsWithChildren & {
  bottomSheetRef: React.RefObject<BottomSheetMethods | null>;
  snapPointsList?: Array<string>;
  handleCloseBottomSheet: () => void;
  headerTitle?: string;
  headerSubtitle?: string;
};

const CustomBottomSheet = ({
  children,
  bottomSheetRef,
  snapPointsList = ['60%'],
  handleCloseBottomSheet,
  headerTitle,
  headerSubtitle,
}: TProps) => {
  const snapPoints = useMemo(() => snapPointsList, [snapPointsList]);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    stiffness: 500,
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={2}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      style={styles.container}
    >
      <BottomSheetView style={styles.content}>
        {/* Header with close button */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {headerTitle && (
            <Text variant="headlineSmall" style={styles.textHeader}>
              {headerTitle}
            </Text>
          )}
          {headerSubtitle && (
            <Text variant="bodySmall" style={styles.subtitle}>
              {headerSubtitle}
            </Text>
          )}
          </View>
          <TouchableOpacity
            onPress={handleCloseBottomSheet}
            style={styles.closeButton}
          >
            <XCircle color={'#000'} />
          </TouchableOpacity>
        </View>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  content: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f6f6',
  },
  textHeader: {
    color: '#000',
  },
  subtitle: {
    color: '#666',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerContent: {
    flex: 1,
  },
});
