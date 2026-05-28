import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { verifyOTP, sendOTP, clearError, resetOTP } from '../store/slices/authSlice';
import { LightTheme, DarkTheme } from '../theme/colors';

const OTP_LENGTH = 6;

export default function OTPScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error, otpEmail } = useSelector((s) => s.auth);
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (text, index) => {
    if (text.length > 1) {
      // Handle paste
      const chars = text.split('').slice(0, OTP_LENGTH);
      const newOtp = [...otp];
      chars.forEach((c, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = c;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + chars.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;
    dispatch(clearError());
    dispatch(verifyOTP({ email: otpEmail, otp: code }));
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    dispatch(sendOTP({ email: otpEmail }));
    setResendTimer(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  const handleGoBack = () => {
    dispatch(resetOTP());
    navigation.goBack();
  };

  const otpCode = otp.join('');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      <View style={[styles.headerArea, { backgroundColor: colors.primary }]}>
        <Text style={styles.logo}>🔐</Text>
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <Text style={styles.headerSub}>
          Enter the 6-digit code sent to
        </Text>
        <Text style={styles.emailText}>{otpEmail}</Text>
      </View>

      <View style={[styles.formCard, { backgroundColor: colors.surface, shadowColor: colors.shadowDark }]}>
        {/* OTP Inputs */}
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(ref) => (inputRefs.current[idx] = ref)}
              style={[
                styles.otpInput,
                {
                  backgroundColor: colors.surfaceVariant,
                  color: colors.text,
                  borderColor: digit ? colors.primary : colors.border,
                },
              ]}
              value={digit}
              onChangeText={(t) => handleChange(t, idx)}
              onKeyPress={(e) => handleKeyPress(e, idx)}
              keyboardType="number-pad"
              maxLength={idx === 0 ? OTP_LENGTH : 1}
              autoFocus={idx === 0}
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: colors.dangerBg }]}>
            <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            {
              backgroundColor: colors.primary,
              opacity: otpCode.length === OTP_LENGTH && !loading ? 1 : 0.5,
            },
          ]}
          onPress={handleVerify}
          disabled={otpCode.length !== OTP_LENGTH || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>{loading ? 'Verifying...' : 'Verify & Continue'}</Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={[styles.resendLabel, { color: colors.textSecondary }]}>
            Didn't receive the code?
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
            <Text
              style={[
                styles.resendBtn,
                { color: resendTimer > 0 ? colors.textTertiary : colors.primary },
              ]}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
          <Text style={[styles.backText, { color: colors.textSecondary }]}>← Change Email</Text>
        </TouchableOpacity>
      </View>

      {/* Dev hint */}
      <View style={[styles.devHint, { backgroundColor: colors.warningBg }]}>
        <Text style={[styles.devHintText, { color: colors.warning }]}>
          💡 Dev mode: Check the backend console for the OTP code
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerArea: {
    paddingTop: 70,
    paddingBottom: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: { fontSize: 40, marginBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  emailText: { fontSize: 14, fontWeight: '700', color: '#fff', marginTop: 2 },
  formCard: {
    marginHorizontal: 24,
    marginTop: -20,
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 46,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },
  errorBanner: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendLabel: { fontSize: 13 },
  resendBtn: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  backBtn: { alignItems: 'center', marginTop: 16 },
  backText: { fontSize: 14, fontWeight: '600' },
  devHint: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
  },
  devHintText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
