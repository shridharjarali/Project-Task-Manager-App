import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { createProject } from '../store/slices/projectSlice';
import { LightTheme, DarkTheme } from '../theme/colors';

export default function CreateProjectScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.projects);
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');

  const handleCreate = () => {
    if (!title.trim()) {
      setTitleError('Project title is required');
      return;
    }
    setTitleError('');
    dispatch(createProject({ title: title.trim(), description: description.trim() })).then(
      (action) => {
        if (createProject.fulfilled.match(action)) {
          navigation.goBack();
        }
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.shadowDark }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primaryBg }]}>
              <Text style={styles.iconEmoji}>🆕</Text>
            </View>

            <Text style={[styles.formTitle, { color: colors.text }]}>Create New Project</Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Give your project a name and description to get started.
            </Text>

            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Project Title *</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceVariant,
                    color: colors.text,
                    borderColor: titleError ? colors.danger : colors.border,
                  },
                ]}
                placeholder="e.g., Mobile App Redesign"
                placeholderTextColor={colors.textTertiary}
                value={title}
                onChangeText={(t) => { setTitle(t); setTitleError(''); }}
                maxLength={255}
              />
              {titleError ? (
                <Text style={[styles.errorText, { color: colors.danger }]}>{titleError}</Text>
              ) : (
                <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                  {title.length}/255
                </Text>
              )}
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.surfaceVariant,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="What's this project about?"
                placeholderTextColor={colors.textTertiary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={2000}
              />
              <Text style={[styles.charCount, { color: colors.textTertiary }]}>
                {description.length}/2000
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.cancelBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreate}
                style={[
                  styles.createBtn,
                  { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 },
                ]}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.createText}>{loading ? 'Creating...' : 'Create Project'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 8 },
  card: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  iconEmoji: { fontSize: 24 },
  formTitle: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  formSubtitle: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  inputGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingTop: 14,
    fontSize: 15,
  },
  errorText: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  charCount: { fontSize: 11, marginTop: 4, textAlign: 'right' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, fontWeight: '600' },
  createBtn: {
    flex: 1.5,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
