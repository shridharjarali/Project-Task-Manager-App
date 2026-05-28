import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { LightTheme, DarkTheme } from '../theme/colors';

export default function ProjectCard({ project, onPress, onDelete }) {
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const totalTasks = parseInt(project.task_count) || 0;
  const completedTasks = parseInt(project.completed_count) || 0;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {/* Accent bar */}
        <View style={[styles.accent, { backgroundColor: colors.primary }]} />

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {project.title}
            </Text>
            <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={[styles.deleteBtn, { color: colors.danger }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {project.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
              {project.description}
            </Text>
          ) : null}

          {/* Progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: colors.surfaceVariant }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: progress === 1 ? colors.secondary : colors.primary,
                  width: `${Math.max(progress * 100, 0)}%`,
                },
              ]}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.meta, { color: colors.textTertiary }]}>
              {completedTasks}/{totalTasks} tasks
            </Text>
            <Text style={[styles.meta, { color: colors.textTertiary }]}>
              {formatDate(project.created_at)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  accent: {
    width: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  deleteBtn: {
    fontSize: 16,
    fontWeight: '600',
    padding: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
  },
});
