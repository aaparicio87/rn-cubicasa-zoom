package com.nativecubicasa

import android.content.Context
import com.google.ar.core.ArCoreApk

/**
 * Helper to verify ARCore availability.
 *
 * ARCore is necessary for 3D scanning.
 * If it's not available, the scan won't work.
 */
object ARCoreHelper {
    
    /**
     * Verifies if ARCore is available on this device.
     *
     * @return true if ARCore is installed and compatible
     */
    fun isARCoreAvailable(context: Context): Boolean {
        return try {
            val availability = ArCoreApk.getInstance().checkAvailability(context)
            
            when (availability) {
                ArCoreApk.Availability.SUPPORTED_INSTALLED -> {
                    println("✅ ARCore: Installed and supported")
                    true
                }
                ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD,
                ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED -> {
                    println("⚠️ ARCore: Supported but not installed/outdated")
                    false
                }
                else -> {
                    println("❌ ARCore: Not supported on this device")
                    false
                }
            }
        } catch (e: Exception) {
            println("❌ ARCore: Error verifying: ${e.message}")
            false
        }
    }
    
    /**
     * Gets a descriptive message for the user.
     */
    fun getErrorMessage(context: Context): String {
        return try {
            val availability = ArCoreApk.getInstance().checkAvailability(context)
            
            when (availability) {
                ArCoreApk.Availability.SUPPORTED_NOT_INSTALLED ->
                    "Google Play Services for AR is required but not installed. Please install it from the Play Store."
                
                ArCoreApk.Availability.SUPPORTED_APK_TOO_OLD ->
                    "Please update Google Play Services for AR to use this feature."
                
                ArCoreApk.Availability.UNSUPPORTED_DEVICE_NOT_CAPABLE ->
                    "This device does not support AR features required for scanning."
                
                else ->
                    "AR features are not available on this device."
            }
        } catch (e: Exception) {
            "Unable to initialize AR features: ${e.message}"
        }
    }
}