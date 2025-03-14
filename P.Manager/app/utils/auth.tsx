import * as LocalAuthentication from 'expo-local-authentication';

export const authenticateWithFingerprint = async () => { 
    const compatible = await LocalAuthentication.hasHardwareAsync();  
    if (!compatible) {
        console.log("Device does not support biometric authentication");
        return false;
    }

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();  
    if (!savedBiometrics) {
        console.log("No biometrics are enrolled on this device");
        return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with your fingerprint",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
    });

    return result;  
};
