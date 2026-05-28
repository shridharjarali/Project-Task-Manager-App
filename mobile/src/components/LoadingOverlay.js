import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { LightTheme, DarkTheme } from '../theme/colors';

export default function LoadingOverlay({ message = 'Loading...' }) {
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  return (
    <View style={[styles.container, { backgroundColor: colors.overlay }]}>
      <View style={[styles.box, { backgroundColor: colors.surface }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  box: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
