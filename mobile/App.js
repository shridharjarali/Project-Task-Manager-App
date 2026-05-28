import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { restoreSession } from './src/store/slices/authSlice';
import { loadTheme } from './src/store/slices/themeSlice';

function AppBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreSession());
    dispatch(loadTheme());
  }, [dispatch]);

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppBootstrap />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
