// корзина для хранения товаров
let cart = {
    items: [],
    total: 0
};

// инициализация корзины
function initCart() {
    const savedCart = storage.loadCartFromStorage();
    if (savedCart) {
        cart = savedCart;
    } else {
        //  массив, который будет изменяться посредством обращения по id
        // id присваивается по порядку слева направо
        cart = {
            items: [
                { id: 0, name: 'Nyancat', price: 5, count: 0 },
                // на скорейшее будущее
                { id: 1, name: 'Smt', price: 7, count: 0 },
                { id: 2, name: 'Smt', price: 10, count: 0 }
            ],
            total: 0
        };
    }
    updateUI();

}

// изменение количества товара
function changeItemCount(productId, change) {
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        item.count += change;
        if (item.count < 0) item.count = 0;
        updateUI()
        storage.saveCartToStorage(cart);
    }
}

// обработчик количества товаров при обновлении страницы
function updateUI() {
    cart.items.forEach(item => {
        const counterElement = document.getElementById(`${item.id}`);
        if (counterElement) {
            counterElement.textContent = item.count;
        }
    });
    
}


window.cartManager = {
    initCart,
    changeItemCount,
    getCart: () => cart
};