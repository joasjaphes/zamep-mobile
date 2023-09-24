import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';

/**
 * Store encrypted key–value pairs locally on the device
 * @param {string} key
 * @param {*} value
 * @returns {Promise<void>}
 */
export async function save(key, value) {
  await setItemAsync(key, JSON.stringify(value));
}

/**
 * Fetch the stored value associated with the provided key
 * @param {string} key
 * @returns {Promise<string | null>}
 */
export async function getValueFor(key) {
  const result = await getItemAsync(key);
  return JSON.parse(result);
}

/**
 * Delete the value associated with the provided key
 * @param {*} key
 * @returns {Promise<void>}
 */
export async function deleteItem(key) {
  await deleteItemAsync(key);
}
