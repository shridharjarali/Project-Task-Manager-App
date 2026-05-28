import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { LightTheme, DarkTheme } from '../theme/colors';

export default function TaskItem({ task, onToggle, onDelete }) {
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;
  const isComplete = task.status === 'complete';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = () => {
    if (!task.due_date || isComplete) return false;
    return new Date(task.due_date) < new Date();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: isComplete ? colors.secondaryDark : colors.border,
          borderLeftColor: isComplete ? colors.secondary : colors.primary,
        },
      ]}
    >
      {/* Checkbox */}
      <TouchableOpacity
        onPress={onToggle}
        style={[
          styles.checkbox,
          {
            borderColor: isComplete ? colors.secondary : colors.textTertiary,
            backgroundColor: isComplete ? colors.secondary : 'transparent',
          },
        ]}
      >
        {isComplete && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: isComplete ? colors.textTertiary : colors.text,
              textDecorationLine: isComplete ? 'line-through' : 'none',
            },
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {task.due_date && (
          <View style={[styles.dateBadge, { backgroundColor: isOverdue() ? colors.dangerBg : colors.primaryBg }]}>
            <Text style={[styles.dateText, { color: isOverdue() ? colors.danger : colors.primary }]}>
              📅 {formatDate(task.due_date)}
            </Text>
          </View>
        )}
      </View>

      {/* Delete */}
      <TouchableOpacity onPress={onDelete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Text style={[styles.deleteBtn, { color: colors.danger }]}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    fontSize: 16,
    padding: 4,
  },
});
