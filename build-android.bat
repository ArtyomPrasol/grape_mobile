@echo off
echo Starting Android build process...

echo Running expo prebuild...
call npx expo prebuild -p android
if errorlevel 1 (
    echo Error during expo prebuild
    pause
    exit /b 1
)

echo Changing to android directory...
cd android
if errorlevel 1 (
    echo Error changing to android directory
    pause
    exit /b 1
)

echo Building release APK...
call .\gradlew assembleRelease --no-daemon --stacktrace --info
if errorlevel 1 (
    echo Error during gradle build
    pause
    exit /b 1
)

echo Returning to root directory...
cd ..
if errorlevel 1 (
    echo Error returning to root directory
    pause
    exit /b 1
)

echo Build completed successfully!
echo APK location: android/app/build/outputs/apk/release/app-release.apk
pause 