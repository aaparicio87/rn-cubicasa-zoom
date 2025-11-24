import Foundation
import CubiCapture
import SwiftUI
import UIKit
import CoreLocation

@objc(NativeCubiCasa)
class NativeCubiCasa: NSObject, CubiCaptureDelegate {
  
  // Variables to handle the scan
  private var scanResolver: RCTPromiseResolveBlock?
  private var scanRejecter: RCTPromiseRejectBlock?
  private var hostingController: UIHostingController<AnyView>?
  
  @objc
  public static func moduleName() -> String {
    return "NativeCubiCasa"
  }
  
  @objc
  public static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  public func getSDKVersion() -> String {
    return CubiCaptureInfo.sdkVersion
  }
  
  @MainActor @objc
  public func startScan(
    _ fileName: String,
    propertyType: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    print("📸 startScan called!")
    print("   - fileName: \(fileName)")
    print("   - propertyType: \(propertyType)")
    
    guard CubiCaptureInfo.isSupportedOnDevice else {
      reject("UNSUPPORTED", "This device does not support scanning (requires ARKit)", nil)
      return
    }
    
    self.scanResolver = resolve
    self.scanRejecter = reject
    
    let propType: CubiCapturePropertyType
    switch propertyType.lowercased() {
    case "single_unit_residential", "singleunitresidential", "house":
      propType = .singleUnitResidential
    case "townhouse":
      propType = .townhouse
    case "apartment":
      propType = .apartment
    default:
      propType = .other
    }
    
    let options: CaptureOptions = [
      .meshVisualisation,  // 3D (LiDAR only)
      .azimuth,            // Catch North orientation
      .storageWarnings,    // Warning low space
      .photoCapturing      // Allows to take photos
    ]
    
    let captureView = CubiCaptureView(
      delegate: self,
      fileName: fileName,
      address: nil,  // No address for now
      propertyType: propType,
      options: options
    )
    
    let wrappedView = AnyView(captureView)
    let hostingController = UIHostingController(rootView: wrappedView)
    hostingController.modalPresentationStyle = .fullScreen
    self.hostingController = hostingController
    
    DispatchQueue.main.async {
      guard let rootVC = self.getRootViewController() else {
        reject("NO_ROOT_VC", "Could not get the rootViewController", nil)
        return
      }
      
      rootVC.present(hostingController, animated: true) {
        print("✅ CubiCaptureView presented")
      }
    }
  }
  
  private func getRootViewController() -> UIViewController? {
    guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
          let rootVC = scene.windows.first?.rootViewController else {
      return nil
    }
    return rootVC
  }
  
  // MARK: - CubiCaptureDelegate
  
  func didCompleteScan(location: URL) {
    print("✅ Scan completed!")
    print("   - Location: \(location.path)")
    
    DispatchQueue.main.async { [weak self] in
      guard let self = self else { return }
      
      self.hostingController?.dismiss(animated: true) {
        self.scanResolver?(location.path)
        self.scanResolver = nil
        self.scanRejecter = nil
      }
    }
  }
  
  func didAbortScan(withEvent event: CubiCaptureEvent, canContinue: Bool) {
    print("❌ Scan aborted")
    print("   - Event: \(event)")
    print("   - Can continue: \(canContinue)")
    
    DispatchQueue.main.async { [weak self] in
      guard let self = self else { return }
      
      self.hostingController?.dismiss(animated: true) {
        self.scanRejecter?("SCAN_ABORTED", "The scan was aborted", nil)
        self.scanResolver = nil
        self.scanRejecter = nil
      }
    }
  }
  
  func receiveEvent(_ event: CubiCaptureEvent) {
    print("📡 Event received: \(event)")
  }
  
  // MARK: - Share File

  @objc
  public func shareFile(
    _ filePath: String,
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    print("📤 Sharing file:", filePath)
    
    let fileURL = URL(fileURLWithPath: filePath)
    
    // Verify that file exist
    guard FileManager.default.fileExists(atPath: filePath) else {
      reject("FILE_NOT_FOUND", "File does not exist: \(filePath)", nil)
      return
    }
    
    DispatchQueue.main.async { [weak self] in
      guard let self = self else {
        reject("ERROR", "Module deallocated", nil)
        return
      }
      
      guard let rootVC = self.getRootViewController() else {
        reject("NO_ROOT_VC", "No se pudo obtener el rootViewController", nil)
        return
      }
      
      // Creates UIActivityViewController
      let activityVC = UIActivityViewController(
        activityItems: [fileURL],
        applicationActivities: nil
      )
      
      // For Ipad
      if let popover = activityVC.popoverPresentationController {
        popover.sourceView = rootVC.view
        popover.sourceRect = CGRect(
          x: rootVC.view.bounds.midX,
          y: rootVC.view.bounds.midY,
          width: 0,
          height: 0
        )
        popover.permittedArrowDirections = []
      }
      
      rootVC.present(activityVC, animated: true) {
        resolve("Menú de compartir presentado")
      }
    }
  }
  
  @objc
  public func getPropertyTypes() -> [String] {
    return CubiCapturePropertyType.allCases.map { $0.rawValue }
  }
  
  // MARK: - Request Permissions

  @objc
  public func requestLocationPermission(
    _ resolve: @escaping RCTPromiseResolveBlock,
      rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      let locationManager = CLLocationManager()
      
      // Check current status using instance property (iOS 14+)
      let status = locationManager.authorizationStatus
      
      switch status {
      case .authorizedWhenInUse, .authorizedAlways:
        // We have permission
        resolve("authorized")
        
      case .notDetermined:
        // Allow permission
        locationManager.requestWhenInUseAuthorization()
        // Note: Asynchronous
        resolve("requested")
        
      case .denied, .restricted:
        // Permission Denied
        reject("PERMISSION_DENIED", "Location permission denied", nil)
        
      @unknown default:
        reject("UNKNOWN", "Unknown permission status", nil)
      }
    }
  }
}
