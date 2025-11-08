import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFavorites } from '../services/storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const refreshFavorites = () => {
    loadFavorites();
  };

  return (
    <FavoritesContext.Provider value={{ favorites, refreshFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
