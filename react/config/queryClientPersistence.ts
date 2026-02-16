import { get, set, del } from "idb-keyval";

const CACHE_KEY = 'reactQuery-cache';
const SECURE_STORAGE_KEY = 'App-Secure-Persistence-Key-2024';

/**
 * Convierte un Uint8Array a un string Base64 sin usar el operador spread (evita RangeError)
 */
const arrayBufferToBase64 = (buffer: Uint8Array): string => {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(buffer[i]);
    }
    return window.btoa(binary);
};

/**
 * Convierte un string Base64 a Uint8Array de forma eficiente
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

/**
 * Encripta un texto usando AES-GCM nativo
 */
const encryptData = async (text: string, password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']
    );

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv }, key, encoder.encode(text)
    );

    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return arrayBufferToBase64(combined);
};

/**
 * Desencripta datos usando AES-GCM nativo
 */
const decryptData = async (encryptedBase64: string, password: string): Promise<string> => {
    const decoder = new TextDecoder();
    const data = base64ToUint8Array(encryptedBase64);

    const salt = data.slice(0, 16);
    const iv = data.slice(16, 28);
    const encrypted = data.slice(28);

    const keyMaterial = await window.crypto.subtle.importKey(
        'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv }, key, encrypted
    );

    return decoder.decode(decrypted);
};

/**
 * Configuración centralizada del persister de IndexedDB para React Query
 * Los datos se encriptan/desencriptan nativamente con Web Crypto API de forma segura
 */
export const idbPersister = {
    persistClient: async (persistedClient: any) => {
        try {
            const jsonString = JSON.stringify(persistedClient);
            const encryptedData = await encryptData(jsonString, SECURE_STORAGE_KEY);
            await set(CACHE_KEY, encryptedData);
        } catch (error) {
            console.error('❌ Error persisting encrypted client:', error);
        }
    },
    restoreClient: async () => {
        try {
            const encryptedData = await get(CACHE_KEY);
            if (!encryptedData) return undefined;

            const decryptedJson = await decryptData(encryptedData, SECURE_STORAGE_KEY);
            return JSON.parse(decryptedJson);
        } catch (error) {
            console.error('⚠️ Error restoring encrypted client (Cache invalidated):', error);
            await del(CACHE_KEY);
            return undefined;
        }
    },
    removeClient: async () => {
        await del(CACHE_KEY);
    },
};

/**
 * Opciones de persistencia compartidas para todos los componentes
 */
export const persistOptions = {
    persister: idbPersister,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    buster: 'v1', // Incrementa esto para invalidar todo el caché
    dehydrateOptions: {
        shouldDehydrateQuery: () => true, // Persist all queries
    },
};
