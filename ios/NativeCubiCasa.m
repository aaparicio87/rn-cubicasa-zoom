#import <React/RCTBridgeModule.h>

// IMPORTANT: Import from the generated Codegen module
#ifdef RCT_NEW_ARCH_ENABLED
#import "NativeCubiCasaSpec.h"
#endif

// Forward declaration of your Swift class
@interface NativeCubiCasa : NSObject
- (NSString *)getSDKVersion;
- (NSArray<NSString *> *)getPropertyTypes;
+ (BOOL)requiresMainQueueSetup;
- (void)requestLocationPermission:(RCTPromiseResolveBlock)resolve  // ⬅️ NUEVO
                         rejecter:(RCTPromiseRejectBlock)reject;   // ⬅️ NUEVO
- (void)startScan:(NSString *)fileName
     propertyType:(NSString *)propertyType
         resolver:(RCTPromiseResolveBlock)resolve
         rejecter:(RCTPromiseRejectBlock)reject;
- (void)shareFile:(NSString *)filePath
         resolver:(RCTPromiseResolveBlock)resolve
         rejecter:(RCTPromiseRejectBlock)reject;
@end

// Wrapper that implements the protocol
@interface NativeCubiCasaModule : NSObject <RCTBridgeModule>
#ifdef RCT_NEW_ARCH_ENABLED
<NativeCubiCasaSpec>
#endif
@end

@implementation NativeCubiCasaModule {
  NativeCubiCasa *_implementation;
}

RCT_EXPORT_MODULE(NativeCubiCasa)

- (instancetype)init {
  if (self = [super init]) {
    _implementation = [NativeCubiCasa new];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (NSString *)getSDKVersionInternal {
  return [_implementation getSDKVersion];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getSDKVersion) {
  return [self getSDKVersionInternal];
}

RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getPropertyTypes) {
  return [_implementation getPropertyTypes];
}

RCT_EXPORT_METHOD(requestLocationPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [_implementation requestLocationPermission:resolve
                                    rejecter:reject];
}

// ⬇️ NUEVO MÉTODO
RCT_EXPORT_METHOD(startScan:(NSString *)fileName
                  propertyType:(NSString *)propertyType
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [_implementation startScan:fileName
                propertyType:propertyType
                    resolver:resolve
                    rejecter:reject];
}

RCT_EXPORT_METHOD(shareFile:(NSString *)filePath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  [_implementation shareFile:filePath
                    resolver:resolve
                    rejecter:reject];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
  return std::make_shared<facebook::react::NativeCubiCasaSpecJSI>(params);
}
#endif

@end
