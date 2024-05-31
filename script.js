let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('products-list');
    const cartList = document.getElementById('cart-list');
    
    if (productList) {
        fetchProducts().then(displayProducts);
    }

    if (cartList) {
        displayCart();
        updateCartTotal();
    }

    updateCartCount();
});

function fetchProducts() {
    return new Promise(resolve => {
        resolve(products);
    });
}

function displayProducts(products) {
    const productList = document.getElementById('products-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Rs ${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to cart</button>
        `;
        productList.appendChild(productDiv);
    });
}

function searchProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchInput) ||
        product.colour.toLowerCase().includes(searchInput) ||
        product.type.toLowerCase().includes(searchInput)
    );
    displayProducts(filteredProducts);
}

function filterProducts() {
    const colour = document.getElementById('filter-colour').value;
    const gender = document.getElementById('filter-gender').value;
    const price = document.getElementById('filter-price').value;
    const type = document.getElementById('filter-type').value;

    let filteredProducts = products;

    if (colour) {
        filteredProducts = filteredProducts.filter(product => product.colour === colour);
    }
    if (gender) {
        filteredProducts = filteredProducts.filter(product => product.gender === gender);
    }
    if (price) {
        filteredProducts = filteredProducts.filter(product => {
            if (price === '0-250') return product.price <= 250;
            if (price === '251-450') return product.price > 250 && product.price <= 450;
            return product.price > 450;
        });
    }
    if (type) {
        filteredProducts = filteredProducts.filter(product => product.type === type);
    }

    displayProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);

    if (!product) {
        console.error("Product not found with ID:", productId);
        return;
    }

    const cartItemIndex = cart.findIndex(item => item.product.id === productId);

    if (cartItemIndex !== -1) {
        if (cart[cartItemIndex].quantity < product.quantity) {
            cart[cartItemIndex].quantity++;
        } else {
            alert('Cannot add more than available quantity');
            return;
        }
    } else {
        cart.push({ product, quantity: 1 });
    }

    updateCart();
    updateCartCount();
}

function displayCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}">
            <h3>${item.product.name}</h3>
            <p>Rs ${item.product.price}</p>
            <div class="quantity-control">
                <button onclick="decreaseQuantity(${index})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
            </div>
            <button onclick="removeFromCart(${index})">Delete</button>
        `;
        cartList.appendChild(cartItemDiv);
    });
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (document.getElementById('cart-list')) {
        displayCart();
        updateCartTotal();
    }
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function updateCartTotal() {
    const totalAmount = document.getElementById('total-amount');
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (totalAmount) {
        totalAmount.textContent = total;
    }
}

function increaseQuantity(index) {
    if (cart[index].quantity < cart[index].product.quantity) {
        cart[index].quantity++;
        updateCart();
    } else {
        alert('Cannot add more than available quantity');
    }
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCart();
    } else {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function checkout() {
    alert('Checkout functionality not implemented.');
}
