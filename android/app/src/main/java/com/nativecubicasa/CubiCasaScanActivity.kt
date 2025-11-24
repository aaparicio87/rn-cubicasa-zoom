package com.nativecubicasa

import android.os.Bundle
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Promise
import cubi.casa.cubicapture.CubiCapture
import cubi.casa.cubicapture.utils.CubiEventListener
import cubi.casa.cubicapture.data.PropertyType
import java.io.File

import android.Manifest
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

/**
 * Activity that handles the scanning process using CubiCapture SDK.
 * 
 * Key concepts:
 * - Activity: Full screen (container)
 * - Fragment: Reusable UI component (the CubiCapture SDK)
 * - CubiEventListener: Interface for receiving events from the SDK
 */

class CubiCasaScanActivity : AppCompatActivity(), CubiEventListener {

    private lateinit var cubiCapture: CubiCapture
    private var fileName: String = ""
    private var propertyTypeString: String = ""
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Get parameters
        fileName = intent.getStringExtra("fileName") ?: "scan_${System.currentTimeMillis()}"
        propertyTypeString = intent.getStringExtra("propertyType") ?: "other"
    
        println("🚀 CubiCasaScanActivity created")
         
        if (checkAndRequestPermissions()) {
          initializeCubiCapture()
        }
    }

    private fun initializeCubiCapture() {
        try {
            val container = FrameLayout(this).apply {
                id = android.view.View.generateViewId()
            }
            setContentView(container)
            
            cubiCapture = CubiCapture()
            setupCubiCapture(propertyTypeString)
            
            supportFragmentManager.beginTransaction()
                .add(container.id, cubiCapture)
                .commit()
            
            println("✅ CubiCapture Fragment added")
        
        } catch (e: com.google.ar.core.exceptions.UnavailableArcoreNotInstalledException) {
            println("❌ ARCore not installed: ${e.message}")
            scanPromise?.reject(
                "ARCORE_NOT_INSTALLED",
                ARCoreHelper.getErrorMessage(this)
            )
            scanPromise = null
            finish()
            
        } catch (e: Exception) {
            println("❌ Error initializing CubiCapture: ${e.message}")
            scanPromise?.reject(
                "INITIALIZATION_ERROR",
                "Failed to initialize scanner: ${e.message}"
            )
            scanPromise = null
            finish()
        }
    }
    
    /**
     * Configure SDK options
     */
    private fun setupCubiCapture(propertyTypeString: String) {
        // Folder where scans will be saved
        val scansFolder = getExternalFilesDir(null)?.let { File(it, "scans") }
        
        if (scansFolder != null && !scansFolder.exists()) {
            scansFolder.mkdirs()
        }
        
        // Configure SDK properties
        cubiCapture.allScansDirectory = scansFolder ?: filesDir
        cubiCapture.scanDirectoryName = fileName
        cubiCapture.propertyType = mapPropertyType(propertyTypeString)
        
        // Enable photo capturing (like in iOS)
        cubiCapture.photoCapturingEnabled = true
        
        // Enable true north detection
        cubiCapture.trueNorth = cubi.casa.cubicapture.utils.TrueNorth.ENABLED
        
        println("📁 Scans folder: ${cubiCapture.allScansDirectory}")
        println("📸 Photo capturing: enabled")
    }
    
    /**
     * Map the propertyType string to the SDK enum
     */
    private fun mapPropertyType(type: String): PropertyType {
        return when (type.lowercase()) {
            "single_unit_residential" -> PropertyType.SINGLE_UNIT_RESIDENTIAL
            "townhouse" -> PropertyType.TOWNHOUSE
            "apartment" -> PropertyType.APARTMENT
            else -> PropertyType.OTHER
        }
    }
    
    // MARK: - CubiEventListener (eventos del SDK)
    
    /**
     * Receives status codes from the SDK
     * See documentation: https://github.com/CubiCasa/cubicasa-android-sdk-example-project
     */
    override fun onStatus(code: Int, description: String) {
        println("📊 CubiCapture Status: code=$code, description=$description")
        
        when (code) {
            5 -> {
                // Code 5: CubiCapture finished, we should close the Activity
                println("🏁 Scan finished, closing Activity")
                finish()
            }
        }
    }
    
    /**
     * Receives files from the SDK (scan folder and ZIP)
     */
    override fun onFile(code: Int, file: File) {
        println("📦 CubiCapture File: code=$code, file=${file.absolutePath}")
        
        when (code) {
            1 -> {
                // Code 1: Scan folder (contains all files)
                println("📁 Scan directory: ${file.absolutePath}")
            }
            2 -> {
                // Code 2: ZIP file created (this is what we need!)
                println("✅ ZIP created: ${file.absolutePath}")
                
                // Resolve the Promise with the ZIP path
                scanPromise?.resolve(file.absolutePath)
                scanPromise = null
            }
        }
    }
    
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        // The SDK needs to know when the window has focus
        cubiCapture.onWindowFocusChanged(hasFocus, this)
    }
    
    override fun onDestroy() {
        super.onDestroy()
        
        // If the Activity is destroyed without completing the scan, reject the Promise
        if (scanPromise != null) {
            scanPromise?.reject("CANCELLED", "Scan cancelled by user")
            scanPromise = null
        }
        
        println("🧹 CubiCasaScanActivity destroyed")
    }

    private fun checkAndRequestPermissions(): Boolean { 
        val cameraPermission = Manifest.permission.CAMERA
        val locationPermission = Manifest.permission.ACCESS_FINE_LOCATION
        
        val permissionsNeeded = mutableListOf<String>()
        
        if (ContextCompat.checkSelfPermission(this, cameraPermission) != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(cameraPermission)
        }
        
        if (ContextCompat.checkSelfPermission(this, locationPermission) != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(locationPermission)
        }
        
        return if (permissionsNeeded.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, permissionsNeeded.toTypedArray(), PERMISSIONS_REQUEST_CODE)
            false
        } else {
            true
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        
        if (requestCode == PERMISSIONS_REQUEST_CODE) {
            val allGranted = grantResults.all { it == PackageManager.PERMISSION_GRANTED }
            
            if (allGranted) {
                println("✅ All permissions granted")
                // Continue with SDK setup
                initializeCubiCapture()
            } else {
                println("❌ Permissions denied")
                scanPromise?.reject("PERMISSION_DENIED", "Camera or location permission denied")
                scanPromise = null
                finish()
            }
        }
    }
    
    companion object {
        var scanPromise: Promise? = null
        private const val PERMISSIONS_REQUEST_CODE = 1001
    }
}