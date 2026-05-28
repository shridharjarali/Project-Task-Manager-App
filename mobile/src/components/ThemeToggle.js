import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import { LightTheme, DarkTheme } from '../theme/colors';

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  return (
    <TouchableOpacity
      onPress={() => dispatch(toggleTheme())}
      style={[styles.button, { backgroundColor: colors.surfaceVariant }]}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{mode === 'dark' ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  emoji: {
    fontSize: 18,
  },
});
