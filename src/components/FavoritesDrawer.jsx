import { useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../context/FavoritesContext';

import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { removeFavorite } from '../services/storage';
import { getImageUrl } from '../services/api';
import Toast from 'react-native-toast-message';
import { useDrawerStatus } from '@react-navigation/drawer';

export default function FavoritesDrawer({ navigation }) {
  const { favorites, refreshFavorites } = useFavorites();

  const isDrawerOpen = useDrawerStatus() === 'open';
  useEffect(() => {
    if (isDrawerOpen) loadFavorites();
  }, [isDrawerOpen]);

  const loadFavorites = () => {
    refreshFavorites();
  };

  const handleRemoveFavorite = useCallback(
    async (movieId) => {
      try {
        await removeFavorite(movieId);
        refreshFavorites(); // This updates the context
        Toast.show({
          type: 'info',
          text1: 'Removed from favorites',
          position: 'bottom',
          visibilityTime: 2000,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error removing favorite',
          position: 'bottom',
        });
      }
    },
    [refreshFavorites]
  );

  const renderFavoriteItem = useCallback(
    ({ item }) => {
      const imageUrl = getImageUrl(item.poster_path, 'w185');

      return (
        <View style={styles.favoriteItem}>
          <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="cover" />
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.meta}>
              <Ionicons name="star" size={14} color="#f39c12" />
              <Text style={styles.rating}>{item.vote_average?.toFixed(1) || 'N/A'}</Text>
              <Text style={styles.year}>{item.release_date?.split('-')[0] || 'TBA'}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleRemoveFavorite(item.id)}
            style={styles.removeButton}>
            <Ionicons name="trash-outline" size={22} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      );
    },
    [handleRemoveFavorite]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.closeDrawer()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptySubtext}>Start adding movies to your favorites!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2c',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 36,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  poster: {
    width: 80,
    height: 120,
    backgroundColor: '#2c2c2c',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
    fontWeight: '600',
  },
  year: {
    fontSize: 14,
    color: '#888',
    marginLeft: 4,
  },
  removeButton: {
    padding: 16,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
