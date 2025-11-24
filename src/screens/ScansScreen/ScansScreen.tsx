import { useCallback } from 'react';
import {
  FlatList,
} from 'react-native';
import { FAB, } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Scan } from 'lucide-react-native';
import { ScanCard } from '../../components/ScanCard';
import { useScans } from '../../hooks/useScans';
import { ScanMetadata } from '../../types/scan';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import EmptyListScan from './components/EmptyListScan';
import LoadingScans from './components/LoadingScans';
import PropertiesTypes from './components/PropertiesTypes';
import styles from './styled';
import HeaderList from './components/HeaderList';


const ScansScreen = () => {
  const { 
    scansState, 
    refresh,
    handleDelete, 
    handleShare, 
    handleStartScan, 
    openBottomSheet,
    bottomSheetRef,
    handleCloseBottomSheet,
    handleSelectType, 
  } = useScans();

 const {
  loading,
  scans,
 } = scansState;
  /**
   * Render each item of the list
   */
  const renderItem = useCallback(
    ({ item }: { item: ScanMetadata }) => (
      <ScanCard scan={item} onShare={handleShare} onDelete={handleDelete} />
  ),[]);

  const renderIconFab = useCallback(() => (
    <Scan size={24} color={'#fff'} />
  ),[]);

  if (loading) {
    return <LoadingScans />
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <HeaderList scans={scans} />

      {/* Scans list */}
      <FlatList
        data={scans}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<EmptyListScan />}
        onRefresh={refresh}
        refreshing={loading}
      />

      <CustomBottomSheet
        bottomSheetRef={bottomSheetRef}
        handleCloseBottomSheet={handleCloseBottomSheet}
        headerTitle="New Scan"
        headerSubtitle="Select Property Type"
      >
        <PropertiesTypes
         handleCloseBottomSheet={handleCloseBottomSheet}
         handleSelectType={handleSelectType}
         selectedType={scansState.selectedType}
         propertyTypes={scansState.propertyTypes}
         handleStartScan={handleStartScan}
        />
      </CustomBottomSheet>

      {/* FAB (Floating Action Button) */}
      {!scansState.isBottomSheetVisible && (
        <FAB
          style={[styles.fab]}
          icon={renderIconFab}
          onPress={openBottomSheet}
          label="New Scan"
        />
      )}

    </SafeAreaView>
  );
}

export default ScansScreen;
