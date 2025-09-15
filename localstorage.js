// storage.js

// сохранение корзины
function saveCartToStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// загрузка корзины
function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : null;
}

// очистка корзины (пока не реализовано)
function clearCartStorage() {
    localStorage.removeItem('cart');
}

// Экспортируем функции для использования в других файлах
window.storage = {
    saveCartToStorage,
    loadCartFromStorage,
    clearCartStorage
};