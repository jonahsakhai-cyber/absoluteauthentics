/**
 * Absolute Authentics - Store Page
 * Handles product loading, filtering, and display
 */

// Contact Info - UPDATE THESE WITH YOUR REAL INFO
const CONTACT_INFO = {
    name: "Jonah Sakhai",
    phone: "(310) 938-1236",
    phoneLink: "+13109381236",
    email: "Jonahsakhai@gmail.com",
    instagram: "@absoluteauthentics",
    instagramLink: "https://instagram.com/absoluteauthentics"
};

// State
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const athleteFilter = document.getElementById('athleteFilter');
const minPriceSlider = document.getElementById('minPriceSlider');
const maxPriceSlider = document.getElementById('maxPriceSlider');
const minPriceValue = document.getElementById('minPriceValue');
const maxPriceValue = document.getElementById('maxPriceValue');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');
const pagination = document.getElementById('pagination');
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalContent = document.getElementById('modalContent');
const inquiryModal = document.getElementById('inquiryModal');
const inquiryModalClose = document.getElementById('inquiryModalClose');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    updateContactInfo();
    initMobileMenu();
    initMobileFilters();
    initNewsletterPopup();
    initThemeToggle();
});

/**
 * Update Contact Info in Modal
 */
function updateContactInfo() {
    document.getElementById('contactName').textContent = CONTACT_INFO.name;
    document.getElementById('contactPhone').textContent = CONTACT_INFO.phone;
    document.getElementById('contactPhone').href = `tel:${CONTACT_INFO.phoneLink}`;
    document.getElementById('contactEmail').textContent = CONTACT_INFO.email;
    document.getElementById('contactEmail').href = `mailto:${CONTACT_INFO.email}`;
    document.getElementById('contactInstagram').textContent = CONTACT_INFO.instagram;
    document.getElementById('contactInstagram').href = CONTACT_INFO.instagramLink;
    
    // Update call/email buttons
    const callButton = inquiryModal.querySelector('a[href^="tel:"]');
    const emailButton = inquiryModal.querySelector('a[href^="mailto:"]');
    if (callButton) callButton.href = `tel:${CONTACT_INFO.phoneLink}`;
    if (emailButton) emailButton.href = `mailto:${CONTACT_INFO.email}`;
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Search button in nav
    const storeSearchBtn = document.getElementById('storeSearchBtn');
    if (storeSearchBtn) {
        storeSearchBtn.addEventListener('click', () => {
            searchInput.focus();
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }
    
    // Search
    searchInput.addEventListener('input', debounce(handleFilters, 300));
    
    // Filters
    categoryFilter.addEventListener('change', handleFilters);
    athleteFilter.addEventListener('change', handleFilters);
    sortSelect.addEventListener('change', handleFilters);
    
    // Price Sliders
    minPriceSlider.addEventListener('input', handlePriceSlider);
    maxPriceSlider.addEventListener('input', handlePriceSlider);
    
    // Modals
    modalClose.addEventListener('click', closeProductModal);
    inquiryModalClose.addEventListener('click', closeInquiryModal);
    
    productModal.addEventListener('click', (e) => {
        if (e.target === productModal || e.target.classList.contains('modal-overlay')) {
            closeProductModal();
        }
    });
    
    inquiryModal.addEventListener('click', (e) => {
        if (e.target === inquiryModal || e.target.classList.contains('modal-overlay')) {
            closeInquiryModal();
        }
    });
    
    // Close modals on ESC and navigate images with arrow keys
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProductModal();
            closeInquiryModal();
        }
        
        // Navigate images with arrow keys when product modal is open
        if (productModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                navigateModalImage(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                navigateModalImage(1);
            }
        }
    });
}

/**
 * Handle Price Slider Changes
 */
function handlePriceSlider() {
    let minPrice = parseInt(minPriceSlider.value);
    let maxPrice = parseInt(maxPriceSlider.value);
    
    // Ensure min is always less than max
    if (minPrice > maxPrice) {
        if (this === minPriceSlider) {
            maxPriceSlider.value = minPrice;
            maxPrice = minPrice;
        } else {
            minPriceSlider.value = maxPrice;
            minPrice = maxPrice;
        }
    }
    
    // Update display values
    minPriceValue.textContent = minPrice === 0 ? '$0' : `$${minPrice.toLocaleString()}`;
    maxPriceValue.textContent = maxPrice >= 50000 ? '$50,000+' : `$${maxPrice.toLocaleString()}`;
    
    // Apply filters
    handleFilters();
}

/**
 * Load Products from API
 */
async function loadProducts() {
    try {
        showLoading();
        
        // Fetch products from the table API
        const response = await fetch('tables/products?limit=1000&sort=created_at');
        
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const data = await response.json();
        allProducts = data.data || [];
        
        // Populate athlete filter
        populateAthleteFilter();
        
        // Apply initial filters
        handleFilters();
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please try again later.');
    }
}

/**
 * Populate Athlete Filter Dropdown
 */
function populateAthleteFilter() {
    const athletes = [...new Set(allProducts.map(p => p.athlete).filter(a => a))].sort();
    
    athleteFilter.innerHTML = '<option value="all">All Athletes</option>';
    athletes.forEach(athlete => {
        const option = document.createElement('option');
        option.value = athlete;
        option.textContent = athlete;
        athleteFilter.appendChild(option);
    });
}

/**
 * Extract Price Number from String
 */
function extractPrice(priceString) {
    if (!priceString) return 0;
    const match = priceString.replace(/,/g, '').match(/\d+/);
    return match ? parseInt(match[0]) : 0;
}

/**
 * Handle Filtering and Sorting
 */
function handleFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const athlete = athleteFilter.value;
    const sortBy = sortSelect.value;
    const minPrice = parseInt(minPriceSlider.value);
    const maxPrice = parseInt(maxPriceSlider.value);
    
    // Filter products
    filteredProducts = allProducts.filter(product => {
        // Search filter
        const matchesSearch = !searchTerm || 
            product.title?.toLowerCase().includes(searchTerm) ||
            product.athlete?.toLowerCase().includes(searchTerm) ||
            product.description?.toLowerCase().includes(searchTerm) ||
            product.year?.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = category === 'all' || product.category === category;
        
        // Athlete filter
        const matchesAthlete = athlete === 'all' || product.athlete === athlete;
        
        // Price filter
        const productPrice = extractPrice(product.price);
        const matchesPrice = productPrice >= minPrice && (maxPrice >= 50000 || productPrice <= maxPrice);
        
        return matchesSearch && matchesCategory && matchesAthlete && matchesPrice;
    });
    
    // Sort products
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'featured':
                // Featured items first, then by newest
                if (a.featured === b.featured) {
                    return new Date(b.created_at) - new Date(a.created_at);
                }
                return b.featured ? 1 : -1;
                
            case 'highest-price':
                return extractPrice(b.price) - extractPrice(a.price);
                
            case 'lowest-price':
                return extractPrice(a.price) - extractPrice(b.price);
                
            case 'most-viewed':
                // For now, simulate with random-ish sort based on title
                // You can add a "views" field later and track actual views
                return (b.title?.length || 0) - (a.title?.length || 0);
                
            case 'newest':
                return new Date(b.created_at) - new Date(a.created_at);
                
            case 'athlete':
                return (a.athlete || '').localeCompare(b.athlete || '');
                
            default:
                return 0;
        }
    });
    
    // Reset to page 1
    currentPage = 1;
    
    // Update display
    updateResultsCount();
    displayProducts();
    displayPagination();
}

/**
 * Display Products
 */
function displayProducts() {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        showEmptyState();
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Create product cards
    productsToShow.forEach((product, index) => {
        const card = createProductCard(product);
        productsGrid.appendChild(card);
        
        // Stagger animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

/**
 * Create Product Card
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Determine availability badge
    const availableBadge = product.available ? 
        '<span class="product-badge available">Available</span>' : 
        '<span class="product-badge sold">Sold</span>';
    
    // Featured badge
    const featuredBadge = product.featured ? 
        '<span class="product-badge" style="left: 1rem; right: auto; background: rgba(220, 38, 38, 0.95);">Featured</span>' : '';
    
    // Image URL (use placeholder if not available)
    const imageUrl = product.image_url || 'https://via.placeholder.com/400x400/1a1a1a/00d4ff?text=No+Image';
    
    card.innerHTML = `
        <div class="product-image-wrapper" onclick="viewProduct('${product.id}')">
            <img src="${imageUrl}" alt="${product.title || 'Product'}" class="product-image" loading="lazy">
            ${availableBadge}
            ${featuredBadge}
        </div>
        <div class="product-info">
            <span class="product-category">${product.category || 'Collectible'}</span>
            <h3 class="product-title" onclick="viewProduct('${product.id}')" style="cursor: pointer;">${product.title || 'Untitled Product'}</h3>
            <p class="product-athlete">${product.athlete || 'Unknown Athlete'}</p>
            <div class="product-price">${product.price || 'Price on Request'}</div>
            <div class="product-actions">
                <button class="btn-view" onclick="viewProduct('${product.id}')">
                    View Details
                </button>
                <button class="btn-inquire" onclick="event.stopPropagation(); inquireProduct('${product.id}')">
                    <i class="fas fa-envelope"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Display Pagination
 */
function displayPagination() {
    pagination.innerHTML = '';
    
    if (filteredProducts.length <= productsPerPage) {
        return; // No pagination needed
    }
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
            displayPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(prevBtn);
    
    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayProducts();
            displayPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        pagination.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
            displayPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    pagination.appendChild(nextBtn);
}

/**
 * Update Results Count
 */
function updateResultsCount() {
    const total = filteredProducts.length;
    const start = Math.min((currentPage - 1) * productsPerPage + 1, total);
    const end = Math.min(currentPage * productsPerPage, total);
    
    if (total === 0) {
        resultsCount.textContent = 'No products found';
    } else if (total === 1) {
        resultsCount.textContent = '1 product found';
    } else {
        resultsCount.textContent = `Showing ${start}-${end} of ${total} products`;
    }
}

/**
 * View Product Details
 */
async function viewProduct(productId) {
    try {
        // Find product in memory first
        const product = allProducts.find(p => p.id === productId);
        
        if (!product) {
            // Fetch from API if not found
            const response = await fetch(`tables/products/${productId}`);
            if (!response.ok) throw new Error('Product not found');
            const fetchedProduct = await response.json();
            
            // Display modal IMMEDIATELY (don't wait for view tracking)
            displayProductModal(fetchedProduct);
            
            // Track view in background (non-blocking)
            incrementProductView(productId);
        } else {
            // Display modal IMMEDIATELY
            displayProductModal(product);
            
            // Track view in background (non-blocking)
            incrementProductView(productId);
        }
        
    } catch (error) {
        console.error('Error loading product:', error);
        alert('Failed to load product details');
    }
}

/**
 * Increment Product View Count
 */
async function incrementProductView(productId) {
    try {
        // Fetch current product data
        const response = await fetch(`tables/products/${productId}`);
        if (!response.ok) return;
        
        const product = await response.json();
        
        // Increment views
        const currentViews = product.views || 0;
        const updatedViews = currentViews + 1;
        
        // Update product with new view count
        await fetch(`tables/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ views: updatedViews })
        });
        
        // Update local copy
        const localProduct = allProducts.find(p => p.id === productId);
        if (localProduct) {
            localProduct.views = updatedViews;
        }
        
    } catch (error) {
        console.error('Error tracking view:', error);
        // Don't show error to user, just log it
    }
}

/**
 * Display Product Modal
 */
function displayProductModal(product) {
    // Get all images - prioritize image_urls array, fallback to image_url
    const images = product.image_urls && product.image_urls.length > 0 
        ? product.image_urls 
        : (product.image_url ? [product.image_url] : ['https://via.placeholder.com/600x600/1a1a1a/00d4ff?text=No+Image']);
    
    const availableBadge = product.available ? 
        '<span class="product-badge available">Available</span>' : 
        '<span class="product-badge sold">Sold</span>';
    
    // Create navigation arrows (only if multiple images)
    const arrowsHTML = images.length > 1 ? `
        <button class="modal-image-arrow modal-image-prev" onclick="navigateModalImage(-1)" aria-label="Previous image">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="modal-image-arrow modal-image-next" onclick="navigateModalImage(1)" aria-label="Next image">
            <i class="fas fa-chevron-right"></i>
        </button>
    ` : '';
    
    // Create image gallery HTML
    const galleryHTML = images.length > 1 ? `
        <div style="display: flex; gap: 0.5rem; margin-top: 1rem; overflow-x: auto; padding: 0.5rem 0;">
            ${images.map((img, index) => `
                <img src="${img}" 
                     onclick="changeModalImageByIndex(${index})" 
                     style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid ${index === 0 ? '#00d4ff' : 'rgba(255,255,255,0.2)'}; transition: all 0.3s ease;"
                     onmouseover="this.style.borderColor='#00d4ff'"
                     onmouseout="this.style.borderColor='${index === 0 ? '#00d4ff' : 'rgba(255,255,255,0.2)'}'"
                     class="modal-thumbnail"
                     data-index="${index}">
            `).join('')}
        </div>
    ` : '';
    
    modalContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start;">
            <div style="position: relative;">
                <div style="position: relative;">
                    <img id="modalMainImage" src="${images[0]}" alt="${product.title}" style="width: 100%; border-radius: 12px; object-fit: contain; background: rgba(0,0,0,0.3); min-height: 400px; cursor: zoom-in;" data-current-index="0" onclick="openFullscreenImage(this.src)">
                    <div class="zoom-hint" style="position: absolute; bottom: 10px; right: 10px; background: rgba(0, 212, 255, 0.9); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600; pointer-events: none;">
                        <i class="fas fa-search-plus"></i> Click to Zoom
                    </div>
                    ${arrowsHTML}
                </div>
                ${availableBadge}
                ${galleryHTML}
            </div>
            <div>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: center; flex-wrap: wrap;">
                    <span style="display: inline-block; padding: 0.5rem 1rem; background: rgba(0, 212, 255, 0.1); border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: #00d4ff;">
                        ${product.category || 'Collectible'}
                    </span>
                    ${product.tags ? `
                    <span style="display: inline-block; padding: 0.5rem 1rem; background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.4); border-radius: 20px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #ff4444; letter-spacing: 0.5px;">
                        ${product.tags}
                    </span>
                    ` : ''}
                </div>
                <h2 style="font-size: 2.5rem; font-weight: 800; color: #ffffff; margin-bottom: 1rem; line-height: 1.2;">
                    ${product.title || 'Untitled Product'}
                </h2>
                <p style="font-size: 1.25rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 2rem;">
                    ${product.athlete || 'Unknown Athlete'}
                </p>
                <div style="font-size: 2.5rem; font-weight: 900; color: #00d4ff; margin-bottom: 2rem;">
                    ${product.price || 'Price on Request'}
                </div>
                ${product.authenticity ? `
                <div style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(0, 0, 0, 0.3); border-radius: 12px;">
                    <div style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; margin-bottom: 0.5rem;">Authentication</div>
                    <div style="font-size: 1.1rem; color: #ffffff; font-weight: 600;">${product.authenticity}</div>
                </div>
                ` : ''}
                ${product.description ? `
                <div style="margin-bottom: 2rem;">
                    <h3 style="font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 1rem;">Description</h3>
                    <p style="color: rgba(255, 255, 255, 0.7); line-height: 1.8; white-space: pre-line;">${product.description}</p>
                    ${product.item_number ? `
                    <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <div style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; margin-bottom: 0.5rem;">Item Number</div>
                        <div style="font-size: 1rem; color: #00d4ff; font-weight: 700; letter-spacing: 1px;">${product.item_number}</div>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                <div style="display: flex; gap: 1rem;">
                    <button onclick="inquireProduct('${product.id}')" style="flex: 1; padding: 1.2rem 2rem; background: linear-gradient(135deg, #00d4ff 0%, #0099dd 100%); color: #ffffff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; text-transform: uppercase; cursor: pointer;">
                        Inquire Now
                    </button>
                    <button onclick="closeProductModal()" style="padding: 1.2rem 2rem; background: transparent; color: #ffffff; border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Function to change the main image in modal by index
function changeModalImageByIndex(index) {
    const mainImage = document.getElementById('modalMainImage');
    const thumbnails = document.querySelectorAll('.modal-thumbnail');
    
    if (mainImage && thumbnails[index]) {
        const newImageUrl = thumbnails[index].src;
        
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = newImageUrl;
            mainImage.setAttribute('data-current-index', index);
            mainImage.style.opacity = '1';
        }, 150);
        
        // Update thumbnail borders
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.style.borderColor = '#00d4ff';
            } else {
                thumb.style.borderColor = 'rgba(255,255,255,0.2)';
            }
        });
    }
}

// Function to navigate through images with arrows
function navigateModalImage(direction) {
    const mainImage = document.getElementById('modalMainImage');
    const thumbnails = document.querySelectorAll('.modal-thumbnail');
    
    if (!mainImage || thumbnails.length === 0) return;
    
    let currentIndex = parseInt(mainImage.getAttribute('data-current-index') || '0');
    let newIndex = currentIndex + direction;
    
    // Loop around
    if (newIndex < 0) {
        newIndex = thumbnails.length - 1;
    } else if (newIndex >= thumbnails.length) {
        newIndex = 0;
    }
    
    changeModalImageByIndex(newIndex);
}

/**
 * Inquire About Product
 */
function inquireProduct(productId) {
    // Close product modal if open
    closeProductModal();
    
    // Show inquiry modal with contact info
    inquiryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close Product Modal
 */
function closeProductModal() {
    productModal.classList.remove('active');
    if (!inquiryModal.classList.contains('active')) {
        document.body.style.overflow = '';
    }
}

/**
 * Close Inquiry Modal
 */
function closeInquiryModal() {
    inquiryModal.classList.remove('active');
    if (!productModal.classList.contains('active')) {
        document.body.style.overflow = '';
    }
}

/**
 * Show Loading State
 */
function showLoading() {
    productsGrid.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading products...</p>
        </div>
    `;
}

/**
 * Show Empty State
 */
function showEmptyState() {
    productsGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-search"></i>
            <h3>No Products Found</h3>
            <p>Try adjusting your filters or search terms</p>
        </div>
    `;
}

/**
 * Show Error State
 */
function showError(message) {
    productsGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Error Loading Products</h3>
            <p>${message}</p>
        </div>
    `;
}

/**
 * Initialize Mobile Menu
 */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking outside
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/**
 * Initialize Mobile Filters Toggle
 */
function initMobileFilters() {
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const filterGroups = document.querySelectorAll('.filter-group');
    
    if (!mobileFilterToggle) return;
    
    let filtersVisible = false;
    
    mobileFilterToggle.addEventListener('click', () => {
        filtersVisible = !filtersVisible;
        
        filterGroups.forEach(group => {
            if (filtersVisible) {
                group.classList.add('mobile-visible');
            } else {
                group.classList.remove('mobile-visible');
            }
        });
        
        if (filtersVisible) {
            mobileFilterToggle.classList.add('active');
        } else {
            mobileFilterToggle.classList.remove('active');
        }
    });
}

/**
 * Open Fullscreen Image Viewer
 */
function openFullscreenImage(imageSrc) {
    // Create fullscreen overlay
    const fullscreenOverlay = document.createElement('div');
    fullscreenOverlay.id = 'fullscreenImageOverlay';
    fullscreenOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.98);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-out;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        position: relative;
        max-width: 95vw;
        max-height: 95vh;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Create the image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 100%;
        max-height: 95vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 80px rgba(0, 0, 0, 0.9);
    `;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        width: 60px;
        height: 60px;
        background: rgba(220, 38, 38, 0.95);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 100000;
    `;
    
    closeBtn.onmouseover = () => {
        closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
        closeBtn.style.background = 'rgba(220, 38, 38, 1)';
    };
    
    closeBtn.onmouseout = () => {
        closeBtn.style.transform = 'scale(1) rotate(0deg)';
        closeBtn.style.background = 'rgba(220, 38, 38, 0.95)';
    };
    
    // Close functions
    const closeFullscreen = () => {
        fullscreenOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(fullscreenOverlay);
        }, 300);
    };
    
    closeBtn.onclick = closeFullscreen;
    fullscreenOverlay.onclick = (e) => {
        if (e.target === fullscreenOverlay) {
            closeFullscreen();
        }
    };
    
    // ESC key to close
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeFullscreen();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // Assemble and add to page
    imageContainer.appendChild(img);
    fullscreenOverlay.appendChild(imageContainer);
    fullscreenOverlay.appendChild(closeBtn);
    document.body.appendChild(fullscreenOverlay);
}

/**
 * Debounce Function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Newsletter Popup Initialization
 */
function initNewsletterPopup() {
    const popup = document.getElementById('newsletterPopup');
    const closeBtn = document.getElementById('newsletterClose');
    const form = document.getElementById('newsletterForm');
    const successDiv = document.getElementById('newsletterSuccess');
    
    if (!popup) return;
    
    // Check if user has already subscribed (using localStorage)
    const hasSubscribed = localStorage.getItem('aa_newsletter_subscribed');
    
    if (!hasSubscribed) {
        // Show popup after 30 seconds
        setTimeout(() => {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 30000);
    }
    
    // Close popup
    const closePopup = () => {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    
    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.newsletter-submit');
            const originalHTML = submitBtn.innerHTML;
            
            // Get form data
            const formData = {
                name: document.getElementById('subscriberName').value,
                email: document.getElementById('subscriberEmail').value,
                phone: document.getElementById('subscriberPhone').value,
                interests: document.getElementById('subscriberInterests').value,
                subscribed_at: new Date().toISOString(),
                source: window.location.pathname.includes('store') ? 'store-page-popup' : 'homepage-popup'
            };
            
            try {
                // Disable button and show loading
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Joining...';
                
                // Submit to database
                const response = await fetch('tables/newsletter_subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to subscribe');
                }
                
                // Success - hide form and show success message
                form.style.display = 'none';
                successDiv.style.display = 'block';
                
                // Mark as subscribed in localStorage
                localStorage.setItem('aa_newsletter_subscribed', 'true');
                
                // Close popup after 3 seconds
                setTimeout(() => {
                    closePopup();
                }, 3000);
                
            } catch (error) {
                console.error('Error subscribing:', error);
                
                // Show error message
                alert('Failed to join the VIP list. Please try again or contact us directly.');
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }
}

/**
 * Theme Toggle Functionality
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggleBtn.querySelector('i');
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('aa_store_theme') || 'dark';
    
    // Apply saved theme on load
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Toggle theme on button click
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        // Update icon
        if (body.classList.contains('light-theme')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('aa_store_theme', 'light');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('aa_store_theme', 'dark');
        }
    });
}
