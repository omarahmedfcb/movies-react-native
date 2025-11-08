// src/screens/HomeScreen.js
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieCard from '../components/MovieCard';
import { getPopularMovies, searchMovies } from '../services/api';
import Toast from 'react-native-toast-message';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async (pageNum = 1, search = '') => {
    if (loading) return;
    setLoading(true);

    try {
      const data = search ? await searchMovies(search, pageNum) : await getPopularMovies(pageNum);

      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies((prev) => [...prev, ...data.results]);
      }

      setHasMore(data.page < data.total_pages);
      setPage(data.page);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error loading movies',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      setPage(1);
      loadMovies(1, text);
    } else if (text.length === 0) {
      setPage(1);
      loadMovies(1);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadMovies(page + 1, searchQuery);
    }
  };

  const handleFavoriteChange = () => {
    // Trigger any necessary updates when favorites change
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Movies</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.favoritesButton}>
          <Ionicons name="heart" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies...."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={movies}
        renderItem={({ item }) => (
          <MovieCard movie={item} onFavoriteChange={handleFavoriteChange} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator size="large" color="#e74c3c" style={styles.loader} />
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="film-outline" size={64} color="#666" />
              <Text style={styles.emptyText}>No movies found</Text>
            </View>
          ) : null
        }
      />

      {loading && page === 1 && (
        <View style={styles.initialLoader}>
          <ActivityIndicator size="large" color="#e74c3c" />
        </View>
      )}

      <Toast />
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  favoritesButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchIcon: {
    marginRight: -4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  row: {
    justifyContent: 'space-between',
  },
  loader: {
    marginVertical: 20,
  },
  initialLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});
