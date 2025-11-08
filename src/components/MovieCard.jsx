import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../services/api';
import { addFavorite, removeFavorite } from '../services/storage';
import Toast from 'react-native-toast-message';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieCard({ movie, onFavoriteChange }) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const { favorites, refreshFavorites } = useFavorites();

  useEffect(() => {
    checkFavorite();
  }, [favorites, movie.id]);

  const checkFavorite = () => {
    const favStatus = favorites.some((fav) => fav.id === movie.id);
    setIsFav(favStatus);
  };

  const handleFavoriteToggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (isFav) {
        await removeFavorite(movie.id);
        setIsFav(false);
        Toast.show({
          type: 'info',
          text1: 'Removed from favorites',
          position: 'bottom',
          visibilityTime: 2000,
        });
      } else {
        await addFavorite(movie);
        setIsFav(true);
        Toast.show({
          type: 'success',
          text1: 'Added to favorites',
          position: 'bottom',
          visibilityTime: 2000,
        });
      }
      refreshFavorites();
      if (onFavoriteChange) onFavoriteChange();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error updating favorites',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = getImageUrl(movie.poster_path);

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.poster} resizeMode="cover" />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={handleFavoriteToggle}
        disabled={loading}>
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={28}
          color={isFav ? '#e74c3c' : '#fff'}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="star" size={14} color="#f39c12" />
          <Text style={styles.rating}>{movie.vote_average?.toFixed(1) || 'N/A'}</Text>
          <Text style={styles.year}>{movie.release_date?.split('-')[0] || 'TBA'}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#2c2c2c',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 6,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '600',
  },
  year: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
});
