import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: '@taskmanager_token',
  USER: '@taskmanager_user',
  THEME: '@taskmanager_theme',
};

export async function saveToken(token) {
  await AsyncStorage.setItem(KEYS.TOKEN, token);
}

export async function getToken() {
  return AsyncStorage.getItem(KEYS.TOKEN);
}

export async function saveUser(user) {
  await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export async function getUser() {
  const data = await AsyncStorage.getItem(KEYS.USER);
  return data ? JSON.parse(data) : null;
}

export async function saveTheme(mode) {
  await AsyncStorage.setItem(KEYS.THEME, mode);
}

export async function getTheme() {
  return AsyncStorage.getItem(KEYS.THEME);
}

export async function clearAll() {
  await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER]);
}
