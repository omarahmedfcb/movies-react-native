import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@movie_favorites';

export const getFavorites = async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addFavorite = async (movie) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = [...favorites, movie];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (movieId) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const isFavorite = async (movieId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some((movie) => movie.id === movieId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};
