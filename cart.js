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


function isCartEmpty() {
    return cart.items.every(item => item.count === 0);
}

// функция для получения общего количества товаров
function getTotalItemsCount() {
    return cart.items.reduce((total, item) => total + item.count, 0);
}

// функция обновления header корзины
function updateCartHeader() {
    const cartTextElement = document.getElementById('cart-text');
    
    if (isCartEmpty()) {
        cartTextElement.textContent = 'Корзина пуста';
    } else {
        const totalItems = getTotalItemsCount();
        cartTextElement.textContent = `Корзина: ${totalItems}`;
    }
}

function updateTotal() {
    cart.total = cart.items.reduce((sum, item) => {
        return sum + (item.price * item.count);
    }, 0);
}

// обработчик количества товаров при обновлении страницы
function updateUI() {
    cart.items.forEach(item => {
        const counterElement = document.getElementById(`${item.id}`);
        if (counterElement) {
            counterElement.textContent = item.count;
        }
    });
    // обновляем общую сумму
    const totalElement = document.getElementById('total-price');
    if (totalElement) {
        totalElement.textContent = `Общая сумма: ${cart.total} руб.`;
    }
    
    // обновляем header корзины
    updateCartHeader();
    
}
// Массив для хранения заказов
let orders = [];

// Функции для работы с модальным окном
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (isCartEmpty()) {
        modalBody.innerHTML = `
            <h2>Корзина пуста</h2>
            <p>Выберите товары на главной странице</p>
        `;
    } else {
        modalBody.innerHTML = `
            <h2>Оформление заказа</h2>
            <form onsubmit="submitOrder(event)">
                <div class="form-group">
                    <label>Имя:</label>
                    <input type="text" name="firstName" required>
                </div>
                <div class="form-group">
                    <label>Фамилия:</label>
                    <input type="text" name="lastName" required>
                </div>
                <div class="form-group">
                    <label>Адрес доставки:</label>
                    <input type="text" name="address" required>
                </div>
                <div class="form-group">
                    <label>Телефон:</label>
                    <input type="tel" name="phone" required pattern="[+]{0,1}[0-9\s\-\(\)]{10,}">
                </div>
                <div class="form-group">
                    <p><strong>Общая сумма: ${cart.total} руб.</strong></p>
                </div>
                <button type="submit">Оформить заказ</button>
            </form>
        `;
    }
    
    modal.style.display = 'block';
}

function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        customer: {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            address: formData.get('address'),
            phone: formData.get('phone')
        },
        items: cart.items.filter(item => item.count > 0),
        total: cart.total
    };
    
    // Сохраняем заказ
    orders.push(order);
    console.log('Заказ сохранен:', order);
    
    // Очищаем корзину
    clearCart();
    
    // Закрываем модальное окно
    closeCartModal();
    
    // Показываем сообщение об успехе
    alert('Заказ успешно оформлен! Спасибо за покупку!');
}

// Функция очистки корзины
function clearCart() {
    cart.items.forEach(item => item.count = 0);
    cart.total = 0;
    storage.saveCartToStorage(cart);
    updateUI();
}

// Закрытие модального окна по клику вне его
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target === modal) {
        closeCartModal();
    }
}

// Не забываем обновить экспорт
window.cartManager = {
    initCart,
    changeItemCount,
    clearCart,
    getCart: () => cart,
    getOrders: () => orders
};