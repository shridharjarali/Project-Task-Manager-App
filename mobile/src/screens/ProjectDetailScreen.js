import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import { fetchProjects } from '../store/slices/projectSlice';
import { LightTheme, DarkTheme } from '../theme/colors';
import TaskItem from '../components/TaskItem';
import CreateTaskModal from '../components/CreateTaskModal';
import EmptyState from '../components/EmptyState';

export default function ProjectDetailScreen({ route, navigation }) {
  const { project } = route.params;
  const dispatch = useDispatch();
  const tasks = useSelector((s) => s.tasks.byProject[project.id] || []);
  const { loading } = useSelector((s) => s.tasks);
  const mode = useSelector((s) => s.theme.mode);
  const colors = mode === 'dark' ? DarkTheme : LightTheme;

  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'incomplete' | 'complete'

  useEffect(() => {
    dispatch(fetchTasks({ projectId: project.id }));
  }, [dispatch, project.id]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.surface, elevation: 0, shadowOpacity: 0 },
      headerTintColor: colors.text,
      title: project.title,
    });
  }, [navigation, colors, project.title]);

  const handleToggle = (task) => {
    const newStatus = task.status === 'complete' ? 'incomplete' : 'complete';
    dispatch(updateTask({ projectId: project.id, id: task.id, status: newStatus })).then(() => {
      dispatch(fetchProjects()); // refresh project counts
    });
  };

  const handleDelete = (task) => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteTask({ projectId: project.id, id: task.id })).then(() => {
            dispatch(fetchProjects());
          });
        },
      },
    ]);
  };

  const handleCreateTask = (data) => {
    dispatch(createTask({ projectId: project.id, ...data })).then(() => {
      dispatch(fetchProjects());
    });
  };

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === filter);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'complete').length;
  const progress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Project info card */}
      <View style={[styles.infoCard, { backgroundColor: colors.primary }]}>
        <Text style={styles.infoTitle} numberOfLines={2}>{project.title}</Text>
        {project.description ? (
          <Text style={styles.infoDesc} numberOfLines={3}>{project.description}</Text>
        ) : null}

        {/* Progress */}
        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedTasks}/{totalTasks}
          </Text>
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {['all', 'incomplete', 'complete'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[
              styles.chip,
              {
                backgroundColor: filter === f ? colors.primary : colors.surfaceVariant,
                borderColor: filter === f ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: filter === f ? '#fff' : colors.textSecondary },
              ]}
            >
              {f === 'all' ? `All (${totalTasks})` : f === 'incomplete' ? `Active (${totalTasks - completedTasks})` : `Done (${completedTasks})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} />

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={() => handleToggle(item)}
            onDelete={() => handleDelete(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              icon="✅"
              title={filter !== 'all' ? 'No matching tasks' : 'No tasks yet'}
              subtitle={filter !== 'all' ? 'Try a different filter' : 'Tap the + button to add your first task!'}
            />
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => dispatch(fetchTasks({ projectId: project.id }))}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <CreateTaskModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { paddingBottom: 100 },
  header: { paddingBottom: 8 },
  infoCard: {
    margin: 16,
    padding: 20,
    borderRadius: 18,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
  },
  infoDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  progressText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
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
