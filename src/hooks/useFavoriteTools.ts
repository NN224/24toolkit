import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import i18n from '@/i18n'

const STORAGE_KEY = 'favorite-tools'

export function useFavoriteTools() {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setFavorites(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse favorites:', e)
      }
    }
  }, [])

  const saveFavorites = (newFavorites: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }

  const addFavorite = useCallback((toolId: string) => {
    if (!favorites.includes(toolId)) {
      const newFavorites = [...favorites, toolId]
      saveFavorites(newFavorites)
      toast.success(i18n.t('favorites.added'))
    }
  }, [favorites])

  const removeFavorite = useCallback((toolId: string) => {
    const newFavorites = favorites.filter(id => id !== toolId)
    saveFavorites(newFavorites)
    toast.success(i18n.t('favorites.removed'))
  }, [favorites])

  const toggleFavorite = useCallback((toolId: string) => {
    if (favorites.includes(toolId)) {
      removeFavorite(toolId)
    } else {
      addFavorite(toolId)
    }
  }, [favorites, addFavorite, removeFavorite])

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
