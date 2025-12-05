import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import i18n from '@/i18n'

const STORAGE_KEY = 'favorite-tools'

export function useFavoriteTools() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    // Initialize from localStorage
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse favorites:', e)
      }
    }
    return []
  })

  // Use ref to avoid stale closure
  const favoritesRef = useRef(favorites)
  favoritesRef.current = favorites

  const saveFavorites = useCallback((newFavorites: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }, [])

  const addFavorite = useCallback((toolId: string) => {
    const current = favoritesRef.current
    if (!current.includes(toolId)) {
      const newFavorites = [...current, toolId]
      saveFavorites(newFavorites)
      toast.success(i18n.t('favorites.added'))
    }
  }, [saveFavorites])

  const removeFavorite = useCallback((toolId: string) => {
    const newFavorites = favoritesRef.current.filter(id => id !== toolId)
    saveFavorites(newFavorites)
    toast.success(i18n.t('favorites.removed'))
  }, [saveFavorites])

  const toggleFavorite = useCallback((toolId: string) => {
    if (favoritesRef.current.includes(toolId)) {
      removeFavorite(toolId)
    } else {
      addFavorite(toolId)
    }
  }, [addFavorite, removeFavorite])

  const isFavorite = useCallback((toolId: string): boolean => {
    return favorites.includes(toolId)
  }, [favorites])

  const clearFavorites = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setFavorites([])
    toast.success(i18n.t('favorites.cleared'))
  }, [])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  }
}
