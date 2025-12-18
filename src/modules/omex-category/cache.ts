/**
 * Category Cache Manager
 * Manages in-memory caching of category data with TTL support
 */

import { Category, CategoryTree } from "./repository"

export interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export class CategoryCacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private ttl: number // Time to live in milliseconds

  constructor(ttlMinutes: number = 60) {
    this.ttl = ttlMinutes * 60 * 1000
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T): void {
    const expiresAt = Date.now() + this.ttl

    this.cache.set(key, {
      data: value,
      expiresAt,
    })
  }

  /**
   * Invalidate specific cache key
   */
  invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Invalidate all cache entries
   */
  invalidateAll(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key)
      }
    }

    keysToDelete.forEach((key) => this.cache.delete(key))
  }
}

export default CategoryCacheManager
