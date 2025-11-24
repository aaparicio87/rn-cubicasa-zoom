package com.nativecubicasa

import com.nativecubicasa.NativeCubiCasaSpec
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactMethod
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat
import androidx.core.app.ActivityCompat
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.File

class NativeCubiCasaModule(reactContext: ReactApplicationContext) : NativeCubiCasaSpec(reactContext) {

    override fun getName() = NAME

    override fun getSDKVersion(): String {
        return "3.2.4"
    }

    override fun requestLocationPermission(promise: Promise): Unit {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No current activity available")
            return
        }

        val permission = Manifest.permission.ACCESS_FINE_LOCATION

        when {
            // We already have permission
            ContextCompat.checkSelfPermission(activity, permission) == PackageManager.PERMISSION_GRANTED -> {
                promise.resolve("authorized")
            }

            // We should show explanation to the user
            ActivityCompat.shouldShowRequestPermissionRationale(activity, permission) -> {
                // Here you could show an explanatory dialog, but for simplicity:
                ActivityCompat.requestPermissions(activity, arrayOf(permission), LOCATION_PERMISSION_REQUEST_CODE)
                promise.resolve("requested")
            }

            // Request permission directly
            else -> {
                ActivityCompat.requestPermissions(activity, arrayOf(permission), LOCATION_PERMISSION_REQUEST_CODE)
                promise.resolve("requested")
            }
        }
    }

    override fun getPropertyTypes(): WritableArray {
        val array = Arguments.createArray()

        try {
            // Try to get from the SDK enum
            val propertyTypeClass = Class.forName("com.cubicasa.capture.PropertyType")
            val entriesField = propertyTypeClass.getField("entries")
            val entries = entriesField.get(null) as Array<*>

            entries.forEach { propertyType ->
                // Get the rawValue or toString()
                val value = propertyType.toString()
                array.pushString(value)
            }
        } catch (e: Exception) {
            // Fallback a los valores conocidos
            array.pushString("SINGLE_UNIT_RESIDENTIAL")
            array.pushString("TOWNHOUSE")
            array.pushString("APARTMENT")
            array.pushString("OTHER")
        }

        return array
    }

    override fun startScan(fileName: String, propertyType: String, promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No Activity available")
            return
        }

        try {
            // Save the Promise to resolve it when the scan finishes
            CubiCasaScanActivity.scanPromise = promise
            
            val intent = Intent(activity, CubiCasaScanActivity::class.java).apply {
                putExtra("fileName", fileName)
                putExtra("propertyType", propertyType)
            }
            
            println("📱 Opening CubiCasaScanActivity...")
            activity.startActivity(intent)
            
            // We do NOT resolve the Promise here
            // It will be resolved in CubiCasaScanActivity when the scan finishes
            
        } catch (e: Exception) {
            // If it fails to open, reject the Promise
            CubiCasaScanActivity.scanPromise = null
            promise.reject("ERROR", "Error opening scan: ${e.message}")
        }
    }

    override fun shareFile(filePath: String, promise: Promise): Unit {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No current activity available")
            return
        }

        val file = File(filePath)

        // Verify that the file exists
        if (!file.exists()) {
            promise.reject("FILE_NOT_FOUND", "File does not exist: $filePath")
            return
        }

        try {
            // Create secure URI using FileProvider
            val fileUri: Uri = FileProvider.getUriForFile(
                activity,
                "${activity.packageName}.fileprovider",
                file
            )

            // Create Intent to share
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "application/zip" // o "*/*" para cualquier tipo
                putExtra(Intent.EXTRA_STREAM, fileUri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            // Show the chooser
            val chooser = Intent.createChooser(shareIntent, "Share file")
            activity.startActivity(chooser)

            promise.resolve("Share menu presented")

        } catch (e: Exception) {
            promise.reject("SHARE_ERROR", "Error sharing file: ${e.message}")
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    override fun isARCoreAvailable(): Boolean {
        return ARCoreHelper.isARCoreAvailable(reactApplicationContext)
    }

    companion object {
        const val NAME = "NativeCubiCasa"
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1001
    }

}