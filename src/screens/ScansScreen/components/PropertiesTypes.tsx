import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Check } from 'lucide-react-native'
import { Text } from 'react-native-paper'
import { formatPropertyType, getPropertyTypeEmoji } from '../../../utils/propertyTypes';

interface IPropertiesTypes {
    handleCloseBottomSheet: () => void;
    handleSelectType: (type: string) => void;
    selectedType: string;
    propertyTypes: string[];
    handleStartScan: () => Promise<void>
}

const PropertiesTypes = ({
    handleCloseBottomSheet,
    handleSelectType,
    selectedType,
    propertyTypes,
    handleStartScan,
}: IPropertiesTypes) => {
  return (
    <View style={styles.optionsContainer}>
          {/* Options list */}
          <View style={styles.optionsContainer}>
            {propertyTypes.map(type => (
              <TouchableOpacity
                key={type}
                style={styles.option}
                onPress={() => handleSelectType(type)}
                activeOpacity={0.7}
              >
                <View style={styles.optionContent}>
                  <Text variant="bodyLarge" style={styles.optionText}>
                    {getPropertyTypeEmoji(type)} {formatPropertyType(type)}
                  </Text>
                  {selectedType === type && <Check size={20} color="#007AFF" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCloseBottomSheet}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleStartScan}
            >
              <Text style={styles.confirmButtonText}>Start Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
  )
}

export default PropertiesTypes

const styles =  StyleSheet.create({
  optionsContainer: {
    flex: 1,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    flex: 1,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})