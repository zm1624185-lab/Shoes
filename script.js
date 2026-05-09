// 3D Shoe Renderer Class
class Shoe3D {
    constructor(canvas, shoeData) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.shoe = shoeData;
        this.angle = 0;
        this.zoom = 1;
        this.rotationSpeed = 0.02;
        this.isDragging = false;
        this.lastX = 0;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrag());
        this.canvas.addEventListener('wheel', (e) => this.zoomWheel(e));
        this.animate();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    startDrag(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
    }

    drag(e) {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.lastX;
        this.angle += deltaX * 0.01;
        this.lastX = e.clientX;
    }

    stopDrag() {
        this.isDragging = false;
    }

    zoomWheel(e) {
        e.preventDefault();
        this.zoom += e.deltaY * -0.001;
        this.zoom = Math.max(0.5, Math.min(2, this.zoom));
    }

    drawShoe() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / window.devicePixelRatio / 2;
        const centerY = this.canvas.height / window.devicePixelRatio / 2;
        const size = 120 * this.zoom;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(this.angle);
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.15)';
        ctx.beginPath();
        ctx.ellipse(0, size * 0.6, size * 0.8, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        // Main shoe body
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, size * 0.6, size);
        gradient.addColorStop(0, this.shoe.color);
        gradient.addColorStop(0.7, this.shoe.colorDark);
        gradient.addColorStop(1, this.shoe.colorShadow);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(-size * 0.4, -size * 0.3);
        ctx.lineTo(size * 0.6, -size * 0.4);
        ctx.quadraticCurveTo(size * 0.8, -size * 0.2, size * 0.7, size * 0.2);
        ctx.quadraticCurveTo(size * 0.5, size * 0.4, 0, size * 0.5);
        ctx.quadraticCurveTo(-size * 0.5, size * 0.4, -size * 0.4, size * 0.2);
        ctx.closePath();
        ctx.fill();

        // Highlights
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(-size * 0.2, -size * 0.2, size * 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Laces
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(-size * 0.3 + i * 15, -size * 0.25);
            ctx.lineTo(-size * 0.1 + i * 15, size * 0.1);
            ctx.stroke();
        }

        // Sole
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.ellipse(0, size * 0.55, size * 0.5, size * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    animate() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        
        if (!this.isDragging) {
            this.angle += this.rotationSpeed;
        }
        
        this.drawShoe();
        requestAnimationFrame(() => this.animate());
    }
}

// Shoes Data
const shoesData = [
    {
        id: 1,
        name: "Air Max Ultra",
        price: "₹12,999",
        category: "premium",
        color: "#ff6b6b",
        colorDark: "#e55a5a",
        colorShadow: "#cc4d4d",
        features: ["Leather", "Air Cushion", "Waterproof"]
    },
    {
        id: 2,
        name: "Jordan Legacy",
        price: "₹15,499",
        category: "premium",
        color: "#ffd700",
        colorDark: "#e6bf00",
        colorShadow: "#ccaa00",
        features: ["Premium Leather", "Carbon Fiber", "Breathable"]
    },
    {
        id: 3,
        name: "Nike React Infinity",
        price: "₹14,999",
        category: "premium",
        color: "#667eea",
        colorDark: "#5a67d8",
        colorShadow: "#4c51bf",
        features: ["React Foam", "Flyknit", "Lightweight"]
    },
    {
        id: 4,
        name: "Jutti Royal",
        price: "₹2,499",
        category: "local",
        color: "#ff9ff3",
        colorDark: "#e899d9",
        colorShadow: "#d683c3",
        features: ["Handcrafted", "Traditional", "Cotton Thread"]
    },
    {
        id: 5,
        name: "Kolhapuri Chappal",
        price: "₹1,899",
        category: "local",
        color: "#4ecdc4",
        colorDark: "#44a08d",
        colorShadow: "#3a8578",
        features: ["Leather", "Handmade", "Durable"]
    },
    {
        id: 6,
        name: "Mochi Premium",
        price: "₹3,299",
        category: "local",
        color: "#feca57",
        colorDark: "#e6b800",
        colorShadow: "#cc9f00",
        features: ["Soft Leather", "Comfort Fit", "Anti-slip"]
    }
];

// DOM Elements
const shoesContainer = document.getElementById('shoesContainer');
const modal = document.getElementById('shoeModal');
const modalCanvas = document.getElementById('modalCanvas');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalCartPrice = document.getElementById('modalCartPrice');
const filterBtns = document.querySelectorAll('.filter-btn');
const closeBtn = document.querySelector('.close');
const ctaBtn = document.querySelector('.cta-btn');

// Initialize Hero 3D Shoe
let heroShoe = new Shoe3D(document.getElementById('heroCanvas'), shoesData[0]);

// Load Shoes
function loadShoes(filter = 'all') {
    shoesContainer.innerHTML = '';
    
    const filteredShoes = shoesData.filter(shoe => 
        filter === 'all' || shoe.category === filter
    );

    filteredShoes.forEach(shoe => {
        const shoeCard = document.createElement('div');
        shoeCard.className = 'shoe-card';
        shoeCard.innerHTML = `
            <div class="shoe-image">
                <canvas class="shoe-canvas" data-shoe-id="${shoe.id}"></canvas>
                <div class="category-badge ${shoe.category}">${shoe.category.toUpperCase()}</div>
            </div>
            <div class="shoe-info">
                <h3>${shoe.name}</h3>
                <div class="shoe-price">${shoe.price}</div>
                <div class="shoe-features">
                    ${shoe.features.map(feat => `<div class="feature"><i class="fas fa-check"></i>${feat}</div>`).join('')}
                </div>
                <button class="add-cart-small">View 3D</button>
            </div>
        `;
        shoesContainer.appendChild(shoeCard);

        // Initialize small 3D canvas
        const smallCanvas = shoeCard.querySelector('.shoe-canvas');
        new Shoe3D(smallCanvas, shoe);
    });

    // Add event listeners to new cards
    document.querySelectorAll('.shoe-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.add-cart-small')) {
                const shoeId = parseInt(card.querySelector('.shoe-canvas').dataset.shoeId);
                openModal(shoeId);
            }
        });
    });
}

// Filter Functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadShoes(btn.dataset.filter);
    });
});

// Modal Functions
function openModal(shoeId) {
    const shoe = shoesData.find(s => s.id === shoeId);
    modalTitle.textContent = shoe.name;
    modalPrice.textContent = shoe.price;
    modalCartPrice.textContent = shoe.price;
    modal.style.display = 'block';
    
    // Destroy previous modal shoe if exists
    if (window.modalShoe) {
        window.modalShoe.canvas.removeEventListener('mousedown', window.modalShoe.startDrag);
        // etc...
    }
    
    // Initialize modal 3D shoe
    window.modalShoe = new Shoe3D(modalCanvas, shoe);
    
    // Modal controls
    document.getElementById('rotateLeft').onclick = () => window.modalShoe.angle -= 0.5;
    document.getElementById('rotateRight').onclick = () => window.modalShoe.angle += 0.5;
    document.getElementById('zoomIn').onclick = () => window.modalShoe.zoom = Math.min(2, window.modalShoe.zoom + 0.1);
    document.getElementById('zoomOut').onclick = () => window.modalShoe.zoom = Math.max(0.5, window.modalShoe.zoom - 0.1);
}

closeBtn.onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

// Cart functionality
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-cart') || e.target.classList.contains('add-cart-small')) {
        alert('✅ Added to cart! Check console for details.');
        console.log('Shoe added to cart:', {
            id: e.target.closest('.modal-content, .shoe-card')?.querySelector('[data-shoe-id]')?.dataset.shoeId || 'N/A',
            name: modalTitle.textContent || 'N/A'
        });
    }
});

// Mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
        navMenu.classList.remove('active');
    });
});

// CTA Button
ctaBtn.addEventListener('click', () => {
    document.getElementById('shoes-grid').scrollIntoView({ behavior: 'smooth' });
});

// Initialize
loadShoes();

