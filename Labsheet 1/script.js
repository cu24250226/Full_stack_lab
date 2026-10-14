// ---------- 1. Product catalog (matches product.html) ----------
const products = [
  {
    id: 1,
    name: "Ceramic Mug",
    price: 399,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqUWfCG0fmYPA5YmZkrA74YTPI0sOFXOaItvZkTaQaAA&s=10",
  },
  {
    id: 2,
    name: "Minimal Desk Lamp",
    price: 1299,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzlduDYzptD4yCZpIJucKp1YVX18grAn5t_QpCCxt7tg&s=10",
  },
  {
    id: 3,
    name: "Canvas Tote Bag",
    price: 599,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6Qk6ITR1kr5e2_kO0f8XZGV3Pz2zRajPMKm0nKltphA&s=10",
  },
  {
    id: 4,
    name: "Wireless Earbuds",
    price: 2499,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcST7V_F4ufnb3597ES2DcRDqJZK-tu-vMzsjvG8LW7qMg&s=10",
  },
  {
    id: 5,
    name: "Notebook Set",
    price: 249,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs-MplV1T5WchrHG8Y9jCqiwxhHaL-snvdHQo6e6WOog&s=10",
  },
  {
    id: 6,
    name: "Steel Water Bottle",
    price: 699,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT03SUVf2lE8GZ7s-7V3fvX1LWy3C1BgRd44-2I6oZcGA&s=10",
  },
  {
    id: 7,
    name: "Travel Backpack",
    price: 1999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu-MRc_ypfPFHBB4LAAhfaVFKhtpee9DSgtaQ5Sudb9w&s=10",
  },
  {
    id: 8,
    name: "Classic Sunglasses",
    price: 899,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSsvTt-Pd2SQgyYo26ZWb68eeQMPGSrbXZBWsuaK0CAGXcdlf_SO0dohNwbmMxVScvXUCH_V0_1CzDud3btf724g6r1oq0sYJOHSp-N4e8",
  },
];

const CART_KEY = "namocart_cart";

// ---------- Cart storage helpers ----------
// cart is stored as an array of { id, qty } in localStorage
function getCart() {
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
}

function updateQuantity(productId, newQty) {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (!item) return;
  item.qty = Math.max(1, parseInt(newQty, 10) || 1);
  saveCart(cart);
}

// ---------- 8. Cart badge (runs on every page, incl. index.html) ----------
function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
}

// ---------- 2. & 3. product.html rendering ----------
function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (p) => `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
      <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
    </div>
  `,
    )
    .join("");

  grid.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.getAttribute("data-id"), 10);
      addToCart(id);

      const originalText = e.currentTarget.textContent;
      e.currentTarget.textContent = "Added ✓";
      setTimeout(() => {
        e.currentTarget.textContent = originalText;
      }, 700);
    });
  });
}

// ---------- 4. & 5. cart.html rendering + total ----------
function calculateTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? total + product.price * item.qty : total;
  }, 0);
}

function renderCart() {
  const cartBody = document.getElementById("cart-body");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const cartTable = document.getElementById("cart-table");
  const totalEl = document.getElementById("cart-grand-total");
  if (!cartBody) return;

  const cart = getCart();

  if (cart.length === 0) {
    if (cartTable) cartTable.style.display = "none";
    if (emptyMsg) emptyMsg.style.display = "block";
    return;
  }

  if (cartTable) cartTable.style.display = "table";
  if (emptyMsg) emptyMsg.style.display = "none";

  cartBody.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return "";
      const lineTotal = product.price * item.qty;
      return `
      <tr data-id="${product.id}">
        <td data-label="Item">${product.name}</td>
        <td data-label="Quantity">
          <input type="number" class="qty-input" min="1" value="${item.qty}" data-id="${product.id}">
        </td>
        <td data-label="Price">₹${product.price.toLocaleString("en-IN")}</td>
        <td data-label="Subtotal">₹${lineTotal.toLocaleString("en-IN")}</td>
        <td data-label="Remove"><button class="btn btn-danger remove-btn" data-id="${product.id}">Remove</button></td>
      </tr>
    `;
    })
    .join("");

  totalEl.textContent = "₹" + calculateTotal().toLocaleString("en-IN");

  cartBody.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"), 10);
      updateQuantity(id, e.target.value);
      renderCart(); // re-render so subtotal + grand total update
    });
  });

  cartBody.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.getAttribute("data-id"), 10);
      removeFromCart(id);
      renderCart();
    });
  });
}

// ---------- 6. & 7. checkout.html validation ----------
function validateField(id, errorId, validatorFn, message) {
  const field = document.getElementById(id);
  const errorEl = document.getElementById(errorId);
  if (!field || !errorEl) return true; // field not on this form, skip
  const value = field.value.trim();

  if (!validatorFn(value)) {
    field.classList.add("invalid");
    errorEl.textContent = message;
    return false;
  }
  field.classList.remove("invalid");
  errorEl.textContent = "";
  return true;
}

function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  const confirmationBox = document.getElementById("confirmation-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameValid = validateField(
      "name",
      "name-error",
      (v) => v.length > 0,
      "Name is required.",
    );
    const addressValid = validateField(
      "address",
      "address-error",
      (v) => v.length > 0,
      "Address is required.",
    );
    const pincodeValid = validateField(
      "pincode",
      "pincode-error",
      (v) => /^\d{6}$/.test(v),
      "Pincode must be exactly 6 digits.",
    );
    const phoneValid = validateField(
      "phone",
      "phone-error",
      (v) => /^\d{10}$/.test(v),
      "Phone number must be exactly 10 digits.",
    );

    const allValid = nameValid && addressValid && pincodeValid && phoneValid;

    if (allValid) {
      if (confirmationBox) {
        confirmationBox.style.display = "block";
        confirmationBox.textContent =
          "✅ Order placed! Thank you for shopping with Namocart.";
      }
      localStorage.removeItem(CART_KEY);
      updateCartBadge();
      form.reset();
      form
        .querySelectorAll("input, textarea")
        .forEach((el) => el.classList.remove("invalid"));
    } else if (confirmationBox) {
      confirmationBox.style.display = "none";
    }
  });
}

// ---------- init on every page ----------
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderProducts();
  renderCart();
  initCheckoutForm();
});
