"use client";

import { useState, useEffect, useCallback } from "react";

interface Position {
  x: number;
  y: number;
}

interface MascotState {
  isVisible: boolean;
  position: Position;
  isDragging: boolean;
}

const STORAGE_KEYS = {
  VISIBLE: "mascot-visible",
  POSITION: "mascot-position",
} as const;

const DEFAULT_POSITION: Position = { x: 100, y: 300 };

function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;

  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return defaultValue;

    if (key === STORAGE_KEYS.VISIBLE) {
      return (stored === "true") as unknown as T;
    }

    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
}

function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof value === "boolean") {
      localStorage.setItem(key, String(value));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // localStorage might be full or disabled
  }
}

export function useMascotState() {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load initial state from localStorage after hydration
  useEffect(() => {
    setIsVisible(getStoredValue(STORAGE_KEYS.VISIBLE, true));
    setPosition(getStoredValue(STORAGE_KEYS.POSITION, DEFAULT_POSITION));
    setIsHydrated(true);
  }, []);

  // Save visibility to localStorage
  const toggleVisibility = useCallback(() => {
    setIsVisible((prev) => {
      const newValue = !prev;
      setStoredValue(STORAGE_KEYS.VISIBLE, newValue);
      return newValue;
    });
  }, []);

  // Update position and save to localStorage
  const updatePosition = useCallback((newPosition: Position) => {
    setPosition(newPosition);
    setStoredValue(STORAGE_KEYS.POSITION, newPosition);
  }, []);

  // Drag handlers
  const startDragging = useCallback(() => {
    setIsDragging(true);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isVisible,
    position,
    isDragging,
    isHydrated,
    toggleVisibility,
    updatePosition,
    startDragging,
    stopDragging,
  };
}

export type { Position, MascotState };
