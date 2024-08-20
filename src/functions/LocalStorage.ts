import { Buffer } from 'buffer'

export function setLocalStorage<T>(key: string, value: T | null) {
    if (!value) {
        localStorage.setItem(key, "");
    } else {
        const valueToStore = JSON.stringify(value);
        localStorage.setItem(key, Buffer.from(valueToStore, "utf8").toString("base64"))
    }
}

export function getLocalStorage<T>(key: string): T | null {
    const storedValue = localStorage.getItem(key);
    if (!storedValue || storedValue.length === 0)
        return null;

    return JSON.parse(Buffer.from(storedValue, "base64").toString("utf8")) as T
}