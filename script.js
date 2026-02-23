// Mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('#navMenu a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('nav')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Shop products - Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productName = this.getAttribute('data-product');
        const productPrice = parseInt(this.getAttribute('data-price'));
        
        // Add to cart
        cart.push({
            name: productName,
            price: productPrice
        });
        
        cartCount++;
        updateCartCount();
        updateCartDisplay();
        showNotification(`${productName} added to cart!`);
    });
});

// Cart functionality
let cartCount = 0;
let cart = [];

// Note: Featured collection products removed
// Add items directly through checkout if needed

// Old 'Add to Cart' button listeners (removed with featured collection)
// Keep cart functionality for manual entries if needed

function updateCartCount() {
    document.querySelector('.cart-count').textContent = cartCount;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('totalAmount').textContent = '$0.00';
    } else {
        cart.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">$${item.price.toLocaleString()}</span>
            `;
            cartItems.appendChild(itemDiv);
            total += item.price;
        });
        document.getElementById('totalAmount').textContent = '$' + total.toLocaleString();
    }
}

// Cart icon click
document.querySelector('.cart-icon').addEventListener('click', function() {
    if (cartCount === 0) {
        showNotification('Your cart is empty');
    } else {
        // Scroll to checkout section
        const checkoutSection = document.getElementById('checkout');
        if (checkoutSection) {
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
            showNotification(`You have ${cartCount} items. Proceed to checkout!`);
        }
    }
});

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #d4af37;
        color: #111;
        padding: 15px 25px;
        border-radius: 5px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Newsletter form
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    const email = this.querySelector('input[type="email"]').value;
    showNotification(`Thanks! Check "${email}" for exclusive offers.`);
    // Form will submit to Formspree automatically
});

// ========== CHECKOUT HANDLER ==========

// Checkout button handler
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('customerEmail').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zipcode = document.getElementById('zipcode').value;

        if (!fullName || !email || !address || !city || !state || !zipcode) {
            showNotification('Please fill in all shipping information');
            return;
        }

        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const formattedTotal = (total / 100).toFixed(2);

        showNotification('✓ Order confirmed! Thank you for your purchase.');
        
        setTimeout(() => {
            showNotification(`Order confirmation sent to ${email}`);
            
            // Reset cart and form
            cart = [];
            cartCount = 0;
            updateCartCount();
            updateCartDisplay();
            document.getElementById('checkoutForm').reset();
            
            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
    });
}

// Checkout form validation
const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('change', function() {
        console.log('Form updated, PayPal buttons ready');
    });
}

// Format card number input
const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
    cardNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    });
}

// Format expiry date input
const expiryDateInput = document.getElementById('expiryDate');
if (expiryDateInput) {
    expiryDateInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
}

// CVV input - numbers only
const cvvInput = document.getElementById('cvv');
if (cvvInput) {
    cvvInput.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// Contact form
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[type="text"]').value;
    showNotification(`Thank you, ${name}! We'll be in touch soon.`);
    this.reset();
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navigation
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
    } else {
        nav.style.background = 'transparent';
        nav.style.boxShadow = 'none';
    }
});

// Lazy load animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe cards and testimonials
document.querySelectorAll('.card, .testimonial').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Mobile optimizations
if (window.innerWidth <= 768) {
    // Adjust scroll behavior for mobile
    document.documentElement.scrollBehavior = 'smooth';
    
    // Prevent double-tap zoom
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
}

// Touch-friendly buttons
document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('touchstart', function() {
        this.style.opacity = '0.8';
    });
    btn.addEventListener('touchend', function() {
        this.style.opacity = '1';
    });
});

// Prevent body scroll when menu is open on mobile
function preventScroll(e) {
    e.preventDefault();
}

if (hamburger && navMenu) {
    const observer = new MutationObserver(() => {
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.body.addEventListener('touchmove', preventScroll, false);
        } else {
            document.body.style.overflow = 'auto';
            document.body.removeEventListener('touchmove', preventScroll, false);
        }
    });
    observer.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
}

// Optimize form inputs for mobile
const isMobile = window.innerWidth <= 768;
if (isMobile) {
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            // Auto-scroll to input on mobile
            this.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}