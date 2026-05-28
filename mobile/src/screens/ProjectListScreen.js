import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProjects, deleteProject } from '../store/slices/projectSlice';
import { logout } from '../store/slices/authSlice';
import { LightTheme, DarkTheme } from '../theme/colors';
import ProjectCard from '../components/ProjectCard';
import EmptyState from '../components/EmptyState';
import ThemeToggle from '../components/ThemeToggle';

export default function ProjectListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.projects);
  const { user } = useSelector((s) => s.auth);
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  const [search, setSearch] = React.useState('');

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Set header buttons
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ThemeToggle />
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
              ]);
            }}
            style={[styles.logoutBtn, { backgroundColor: colors.dangerBg }]}
          >
            <Text style={{ color: colors.danger, fontSize: 13, fontWeight: '600' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
      headerStyle: { backgroundColor: colors.surface, elevation: 0, shadowOpacity: 0 },
      headerTintColor: colors.text,
    });
  }, [navigation, colors, dispatch]);

  const handleDelete = (project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.title}"? All tasks will be lost.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch(deleteProject({ id: project.id })),
        },
      ]
    );
  };

  const filteredProjects = search.trim()
    ? list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      )
    : list;

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.greeting, { color: colors.textSecondary }]}>
        Welcome back 👋
      </Text>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Your Projects ({list.length})
      </Text>

      {/* Search bar */}
      {list.length > 0 && (
        <View style={[styles.searchBar, { backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search projects..."
            placeholderTextColor={colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={[styles.clearSearch, { color: colors.textTertiary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => navigation.navigate('ProjectDetail', { project: item })}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="🚀"
              title="No projects yet"
              subtitle="Tap the + button to create your first project and start organizing your tasks!"
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchProjects())}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => navigation.navigate('CreateProject')}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 100 },
  listHeader: { padding: 16, paddingBottom: 8 },
  greeting: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  sectionTitle: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, height: '100%' },
  clearSearch: { fontSize: 14, padding: 4 },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: { color: '#fff', fontSize: 28, fontWeight: '300', marginTop: -1 },
});
