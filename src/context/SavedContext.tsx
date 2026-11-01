import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Property } from '../types';
import { MAX_COMPARE } from '../constants';
import { PROPERTIES } from '../data/properties';

const SAVED_KEY = 'estora:saved';
const COMPARE_KEY = 'estora:compare';

interface SavedContextValue {
  savedIds: string[];
  savedProperties: Property[];
  toggleSaved: (id: string) => void;
  clearSaved: () => void;
  isSaved: (id: string) => boolean;
  savedCount: number;
  compareIds: string[];
  compareProperties: Property[];
  toggleCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

const PROPERTY_INDEX: Record<string, Property> = PROPERTIES.reduce(
  (accumulator, property) => {
    accumulator[property.id] = property;
    return accumulator;
  },
  {} as Record<string, Property>
);

function readIds(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is string => typeof entry === 'string');
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Storage may be unavailable; saved state remains in memory.
  }
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(() => readIds(SAVED_KEY));
  const [compareIds, setCompareIds] = useState<string[]>(() => readIds(COMPARE_KEY));

  useEffect(() => {
    writeIds(SAVED_KEY, savedIds);
  }, [savedIds]);

  useEffect(() => {
    writeIds(COMPARE_KEY, compareIds);
  }, [compareIds]);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => {
      if (current.includes(id)) {
        return current.filter((entry) => entry !== id);
      }
      return [...current, id];
    });
  }, []);

  const clearSaved = useCallback(() => {
    setSavedIds([]);
  }, []);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  const toggleCompare = useCallback((id: string): boolean => {
    let added = false;
    setCompareIds((current) => {
      if (current.includes(id)) {
        return current.filter((entry) => entry !== id);
      }
      if (current.length >= MAX_COMPARE) {
        return current;
      }
      added = true;
      return [...current, id];
    });
    return added;
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setCompareIds((current) => current.filter((entry) => entry !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const savedProperties = useMemo(
    () => savedIds.map((id) => PROPERTY_INDEX[id]).filter((p): p is Property => Boolean(p)),
    [savedIds]
  );

  const compareProperties = useMemo(
    () => compareIds.map((id) => PROPERTY_INDEX[id]).filter((p): p is Property => Boolean(p)),
    [compareIds]
  );

  const value: SavedContextValue = {
    savedIds,
    savedProperties,
    toggleSaved,
    clearSaved,
    isSaved,
    savedCount: savedIds.length,
    compareIds,
    compareProperties,
    toggleCompare,
    removeFromCompare,
    clearCompare,
  };

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved(): SavedContextValue {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within SavedProvider');
  }
  return context;
}