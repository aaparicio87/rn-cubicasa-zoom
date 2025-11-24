import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

//Here we define the interface for the native module methods
export interface Spec extends TurboModule {

  requestLocationPermission(): Promise<string>;
  
  getSDKVersion(): string;

  getPropertyTypes(): string[];

  startScan(fileName: string, propertyType: string): Promise<string>;

  shareFile(filePath: string): Promise<string>;

  isARCoreAvailable(): boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeCubiCasa');
