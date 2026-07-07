// ---------------------- PRODUCTS ----------------------

const products = [
    { id: 1, name: "Laptop", category: "Electronics", price: 65000 },
    { id: 2, name: "Mouse", category: "Electronics", price: 800 },
    { id: 3, name: "Keyboard", category: "Electronics", price: 1200 },
    { id: 4, name: "Notebook", category: "Stationery", price: 60 },
    { id: 5, name: "Pen", category: "Stationery", price: 20 },
    { id: 6, name: "Marker", category: "Stationery", price: 50 },
    { id: 7, name: "Backpack", category: "Accessories", price: 1500 },
    { id: 8, name: "Water Bottle", category: "Accessories", price: 350 },
    { id: 9, name: "Headphones", category: "Electronics", price: 2500 },
    { id: 10, name: "Watch", category: "Accessories", price: 3000 }
];

// ---------------------- DOM ----------------------

const productsDiv = document.getElementById("products");
const cartDiv = document.getElementById("cart");

const searchBox = document.getElementById("search");
const category = document.getElementById("category");

const totalItems = document.getElementById("totalItems");
const totalPrice = document.getElementById("totalPrice");

const couponInput = document.getElementById("coupon");
const couponMessage = document.getElementById("couponMessage");

const customerName = document.getElementById("customerName");
const invoiceDiv = document.getElementById("invoice");

// ---------------------- CART ----------------------

let cart = [];
let discount = 0;

// ---------------------- DISPLAY PRODUCTS ----------------------

function displayProducts(list) {

    productsDiv.innerHTML = "";

    list.forEach(product => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${product.name}</h3>

            <p><b>ID:</b> ${product.id}</p>

            <p><b>Category:</b> ${product.category}</p>

            <p>₹${product.price}</p>

            <button onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        `;

        productsDiv.appendChild(card);

    });

}

displayProducts(products);

// ---------------------- SEARCH + FILTER ----------------------

function filterProducts() {

    const text = searchBox.value.toLowerCase();

    const cat = category.value;

    const filtered = products.filter(product => {

        const matchName = product.name
            .toLowerCase()
            .includes(text);

        const matchCategory =
            cat === "All" ||
            product.category === cat;

        return matchName && matchCategory;

    });

    displayProducts(filtered);

}

searchBox.addEventListener("keyup", filterProducts);

category.addEventListener("change", filterProducts);

// ---------------------- ADD TO CART ----------------------

function addToCart(id) {

    const product = products.find(p => p.id === id);

    const item = cart.find(p => p.id === id);

    if (item) {

        item.quantity++;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }

    displayCart();

}

// ---------------------- DISPLAY CART ----------------------

function displayCart() {

    cartDiv.innerHTML = "";

    let total = 0;

    let items = 0;

    if (cart.length === 0) {

        cartDiv.innerHTML = "<h3>Cart is Empty</h3>";

    }

    cart.forEach(item => {

        items += item.quantity;

        total += item.price * item.quantity;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <h4>${item.name}</h4>

            <p>Price : ₹${item.price}</p>

            <p>

            Quantity :

            <button onclick="decreaseQty(${item.id})">-</button>

            ${item.quantity}

            <button onclick="increaseQty(${item.id})">+</button>

            <button onclick="removeItem(${item.id})">

            Remove

            </button>

            </p>

        `;

        cartDiv.appendChild(div);

    });

    totalItems.textContent = items;

    totalPrice.textContent = total;

}

// ---------------------- QUANTITY ----------------------

function increaseQty(id) {

    const item = cart.find(p => p.id === id);

    item.quantity++;

    displayCart();

}

function decreaseQty(id) {

    const item = cart.find(p => p.id === id);

    item.quantity--;

    if (item.quantity <= 0) {

        removeItem(id);

    }

    displayCart();

}

// ---------------------- REMOVE ----------------------

function removeItem(id) {

    cart = cart.filter(item => item.id !== id);

    displayCart();

}
// ---------------------- COUPON ----------------------

document.getElementById("applyCoupon").addEventListener("click", applyCoupon);

function applyCoupon() {

    const code = couponInput.value.trim().toUpperCase();

    if (code === "SAVE10") {

        discount = 10;
        couponMessage.style.color = "green";
        couponMessage.textContent = "SAVE10 Applied (10% Discount)";

    }
    else if (code === "SAVE20") {

        discount = 20;
        couponMessage.style.color = "green";
        couponMessage.textContent = "SAVE20 Applied (20% Discount)";

    }
    else {

        discount = 0;
        couponMessage.style.color = "red";
        couponMessage.textContent = "Invalid Coupon Code";

    }

}

// ---------------------- CHECKOUT ----------------------

document.getElementById("checkout").addEventListener("click", checkout);

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");
        return;

    }

    const name = customerName.value.trim();

    if (name === "") {

        alert("Please enter customer name.");
        return;

    }

    generateInvoice(name);

}

// ---------------------- INVOICE ----------------------

function generateInvoice(name) {

    const invoiceNumber = "INV" + Math.floor(Math.random() * 100000);

    const date = new Date().toLocaleDateString();

    let subtotal = 0;

    let productRows = "";

    cart.forEach(item => {

        const amount = item.price * item.quantity;

        subtotal += amount;

        productRows += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${amount}</td>
            </tr>
        `;

    });

    const discountAmount = subtotal * discount / 100;

    const afterDiscount = subtotal - discountAmount;

    const gst = afterDiscount * 0.18;

    const grandTotal = afterDiscount + gst;

    invoiceDiv.innerHTML = `

        <h2>Invoice</h2>

        <p><strong>Customer :</strong> ${name}</p>

        <p><strong>Invoice No :</strong> ${invoiceNumber}</p>

        <p><strong>Date :</strong> ${date}</p>

        <table border="1" cellpadding="8" cellspacing="0">

            <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>

            ${productRows}

        </table>

        <br>

        <p><strong>Subtotal :</strong> ₹${subtotal.toFixed(2)}</p>

        <p><strong>Discount (${discount}%) :</strong> -₹${discountAmount.toFixed(2)}</p>

        <p><strong>GST (18%) :</strong> ₹${gst.toFixed(2)}</p>

        <h3>Grand Total : ₹${grandTotal.toFixed(2)}</h3>

        <h2 style="color:green;">✅ Checkout Successful!</h2>

    `;

    // --------- Clear Everything ---------

    cart = [];

    discount = 0;

    displayCart();

    couponInput.value = "";

    couponMessage.textContent = "";

    customerName.value = "";

}
