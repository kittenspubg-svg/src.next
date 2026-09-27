#!/bin/bash

# Orbit Browser — Local Build Script
# This script automates the build process for Orbit Browser on Linux

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WORKSPACE_DIR="${WORKSPACE_DIR:-$HOME/chromium}"
DEPOT_TOOLS_DIR="$WORKSPACE_DIR/depot_tools"
SOURCE_DIR="$WORKSPACE_DIR/src"
BUILD_OUT_DIR="out/Orbit"
BUILD_TARGET="chrome_public_apk"
ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/temurin-17-jdk-amd64}"

# Functions
print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Main script
main() {
    print_header "Orbit Browser Build Script"
    
    # Check if running on Linux
    if [[ "$OSTYPE" != "linux-gnu"* ]]; then
        print_error "This script only works on Linux"
        exit 1
    fi

    # Step 1: Verify environment
    print_header "Step 1: Verifying Environment"
    
    if ! command -v git &> /dev/null; then
        print_error "Git not found. Please install git."
        exit 1
    fi
    print_success "Git found"

    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 not found. Please install python3."
        exit 1
    fi
    print_success "Python 3 found"

    if ! command -v java &> /dev/null; then
        print_error "Java not found. Please install Java 17."
        exit 1
    fi
    print_success "Java found"

    # Step 2: Setup depot_tools
    print_header "Step 2: Setting Up depot_tools"
    
    if [ ! -d "$DEPOT_TOOLS_DIR" ]; then
        print_warning "depot_tools not found. Cloning..."
        git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git "$DEPOT_TOOLS_DIR"
        print_success "depot_tools cloned"
    else
        print_success "depot_tools already installed"
    fi

    export PATH="$DEPOT_TOOLS_DIR:$PATH"

    # Step 3: Verify Chromium source
    print_header "Step 3: Verifying Chromium Source"
    
    if [ ! -d "$SOURCE_DIR" ]; then
        print_error "Chromium source not found at $SOURCE_DIR"
        print_warning "To fetch Chromium, run:"
        echo "    mkdir -p $WORKSPACE_DIR"
        echo "    cd $WORKSPACE_DIR"
        echo "    fetch android"
        exit 1
    fi
    print_success "Chromium source found"

    # Check for required files
    if [ ! -f "$SOURCE_DIR/.gn" ]; then
        print_error ".gn file not found in $SOURCE_DIR"
        exit 1
    fi
    print_success ".gn file found"

    if [ ! -f "$SOURCE_DIR/DEPS" ]; then
        print_error "DEPS file not found in $SOURCE_DIR"
        exit 1
    fi
    print_success "DEPS file found"

    # Step 4: Setup environment variables
    print_header "Step 4: Setting Up Environment"
    
    export ANDROID_HOME="$ANDROID_HOME"
    export ANDROID_SDK_ROOT="$ANDROID_SDK_ROOT"
    export JAVA_HOME="$JAVA_HOME"
    
    echo "ANDROID_HOME: $ANDROID_HOME"
    echo "ANDROID_SDK_ROOT: $ANDROID_SDK_ROOT"
    echo "JAVA_HOME: $JAVA_HOME"
    print_success "Environment variables set"

    # Step 5: Generate GN build configuration
    print_header "Step 5: Generating GN Build Configuration"
    
    cd "$SOURCE_DIR"
    
    mkdir -p "$BUILD_OUT_DIR"
    
    print_warning "Generating GN args for Android ARM64 release build..."
    gn gen "$BUILD_OUT_DIR" --args='
target_os="android"
target_cpu="arm64"
is_debug=false
is_component_build=false
use_official_google_api_keys=false
enable_nacl=false
'
    print_success "GN configuration generated"

    # Step 6: Verify build target
    print_header "Step 6: Verifying Build Target"
    
    if ninja -C "$BUILD_OUT_DIR" -t targets | grep -q "$BUILD_TARGET"; then
        print_success "Build target '$BUILD_TARGET' found"
    else
        print_warning "Build target '$BUILD_TARGET' not found. Available targets:"
        ninja -C "$BUILD_OUT_DIR" -t targets | grep -i "apk" | head -n 20
        read -p "Continue with first available APK target? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    # Step 7: Build APK
    print_header "Step 7: Building APK"
    
    print_warning "Building $BUILD_TARGET..."
    print_warning "This may take 30 minutes to 2 hours depending on your system"
    echo ""
    
    autoninja -C "$BUILD_OUT_DIR" "$BUILD_TARGET"
    
    print_success "Build completed"

    # Step 8: Locate APK
    print_header "Step 8: Locating APK"
    
    APK=$(find "$BUILD_OUT_DIR" -type f -name "*.apk" | head -n 1)
    
    if [ -z "$APK" ]; then
        print_error "APK not found after build"
        exit 1
    fi
    
    print_success "APK found: $APK"
    ls -lh "$APK"

    # Step 9: Copy to artifacts
    print_header "Step 9: Copying to Artifacts"
    
    ARTIFACTS_DIR="$SOURCE_DIR/artifacts"
    mkdir -p "$ARTIFACTS_DIR"
    
    ARTIFACT_NAME="OrbitBrowser-v1.0.0-arm64.apk"
    cp "$APK" "$ARTIFACTS_DIR/$ARTIFACT_NAME"
    
    print_success "Artifact copied: $ARTIFACTS_DIR/$ARTIFACT_NAME"
    ls -lh "$ARTIFACTS_DIR/$ARTIFACT_NAME"

    # Step 10: Optional - Install to device
    print_header "Step 10: Device Installation (Optional)"
    
    if command -v adb &> /dev/null; then
        DEVICES=$(adb devices | grep -v "^$" | wc -l)
        
        if [ $DEVICES -gt 1 ]; then
            print_success "Android device(s) detected"
            
            read -p "Install APK to device? (y/n) " -n 1 -r
            echo
            
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                print_warning "Installing APK..."
                adb install -r "$ARTIFACTS_DIR/$ARTIFACT_NAME"
                print_success "Installation complete"
                
                read -p "Launch Orbit Browser? (y/n) " -n 1 -r
                echo
                
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    adb shell am start -n org.chromium.chrome/.SplashActivity
                    print_success "App launched"
                fi
            fi
        else
            print_warning "No Android device detected. Connect a device and try again."
        fi
    else
        print_warning "adb not found. Skipping device installation."
    fi

    # Final summary
    print_header "Build Complete"
    echo ""
    echo "Artifact: $ARTIFACTS_DIR/$ARTIFACT_NAME"
    echo "Size: $(du -h "$ARTIFACTS_DIR/$ARTIFACT_NAME" | cut -f1)"
    echo ""
    echo "Next steps:"
    echo "  1. Transfer APK to Android device: adb push $ARTIFACT_NAME /sdcard/Download/"
    echo "  2. Open file manager and install: /sdcard/Download/$ARTIFACT_NAME"
    echo "  3. Or install directly: adb install -r $ARTIFACT_NAME"
    echo ""
    print_success "All done!"
}

# Error handler
trap 'print_error "Build failed at line $LINENO"; exit 1' ERR

# Run main
main "$@"
