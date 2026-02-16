import { generateUUID } from "../../../services/utilidades.js";
export class LocalStorageService {
  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
  }
  create(data) {
    return new Promise(resolve => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        const newItem = {
          id: generateUUID(),
          ...data
        };
        items.push(newItem);
        localStorage.setItem(this.localStorageKey, JSON.stringify(items));
        resolve(items);
      }, 1000);
    });
  }
  update = (id, data) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        const updatedItems = items.map(item => {
          if (item.id === id) {
            return {
              ...item,
              ...data
            };
          }
          return item;
        });
        localStorage.setItem(this.localStorageKey, JSON.stringify(updatedItems));
        resolve(updatedItems);
      }, 1000);
    });
  };
  getItem = id => {
    return new Promise(resolve => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        const item = items.find(item => item.id === id);
        resolve(item);
      }, 1000);
    });
  };
  getItems = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        resolve(items);
      }, 1000);
    });
  };
  remove = id => {
    return new Promise(resolve => {
      setTimeout(() => {
        const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        const filteredItems = items.filter(item => item.id !== id);
        localStorage.setItem(this.localStorageKey, JSON.stringify(filteredItems));
        resolve(filteredItems);
      }, 1000);
    });
  };
}