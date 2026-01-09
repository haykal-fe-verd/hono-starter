/**
 * This is the Cache Helper Module
 *
 * @author Muhammad Haykal
 * @date January 09, 2026 09:00 AM
 */

import { getRedis } from "@/application/redis";

/**
 * Get value from cache
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} key
 *
 * @returns {Promise<T | null>}
 */
export async function get<T>(key: string): Promise<T | null> {
    const client = getRedis();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
}

/**
 * Set value to cache
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} key
 * @param {unknown} value
 * @param {?number} [ttlSeconds]
 *
 * @returns {Promise<void>}
 */
export async function set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const client = getRedis();
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
        await client.setEx(key, ttlSeconds, serialized);
    } else {
        await client.set(key, serialized);
    }
}

/**
 *  Delete key from cache
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} key
 *
 * @returns {Promise<void>}
 */
export async function del(key: string): Promise<void> {
    const client = getRedis();
    await client.del(key);
}

/**
 * Check if key exists in cache
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} key
 *
 * @returns {Promise<boolean>}
 */
export async function exists(key: string): Promise<boolean> {
    const client = getRedis();
    const result = await client.exists(key);
    return result === 1;
}

/**
 *  Get multiple keys
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string[]} keys
 *
 * @returns {Promise<(T | null)[]>}
 */
export async function mget<T>(keys: string[]): Promise<(T | null)[]> {
    const client = getRedis();
    const values = await client.mGet(keys);
    return values.map((v: string | null) => (v ? JSON.parse(v) : null));
}

/**
 * Delete keys by pattern
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} pattern
 *
 * @returns {Promise<void>}
 */
export async function delPattern(pattern: string): Promise<void> {
    const client = getRedis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
        await client.del(keys);
    }
}

/**
 * Get TTL of a key
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} key
 *
 * @returns {Promise<number>}
 */
export async function ttl(key: string): Promise<number> {
    const client = getRedis();
    return await client.ttl(key);
}

/**
 *Set expiration on a key
 * @date January 09, 2026 09:00 AM
 * @author Muhammad Haykal
 *
 * @param {string} key
 * @param {number} seconds
 *
 * @returns {Promise<void>}
 */
export async function expire(key: string, seconds: number): Promise<void> {
    const client = getRedis();
    await client.expire(key, seconds);
}
