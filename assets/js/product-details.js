document.addEventListener('DOMContentLoaded', function() {
    // ===== Variables =====
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const wishlistBtn = document.querySelector('.btn-wishlist');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const reviewForm = document.getElementById('reviewForm');
    const ratingInputs = document.querySelectorAll('.rating-input input[type="radio"]');
    const ratingStars = document.querySelectorAll('.rating-input label');
    const loadMoreReviewsBtn = document.querySelector('.load-more-reviews');
    let currentTab = 'description';
    
    // ===== Thumbnail Gallery =====
    if (thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                const newImageSrc = this.getAttribute('data-image');
                mainImage.src = newImageSrc;
                
                // Update active thumbnail
                document.querySelector('.thumbnail.active').classList.remove('active');
                this.classList.add('active');
                
                // Add zoom effect
                mainImage.style.opacity = '0.7';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 100);
            });
        });
    }
    
    // ===== Quantity Selector =====
    function updateQuantity(change) {
        let currentValue = parseInt(quantityInput.value) || 1;
        let newValue = currentValue + change;
        
        // Ensure quantity is at least 1
        if (newValue < 1) newValue = 1;
        
        quantityInput.value = newValue;
    }
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.addEventListener('click', () => updateQuantity(-1));
        increaseBtn.addEventListener('click', () => updateQuantity(1));
        
        // Ensure input is a valid number
        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else {
                this.value = value;
            }
        });
    }
    
    // ===== Add to Cart =====
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product details
            const productName = document.querySelector('.product-info h1').textContent;
            const quantity = parseInt(quantityInput.value) || 1;
            const priceText = document.querySelector('.current-price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.,]/g, '').replace(',', '.'));
            const imageSrc = mainImage.src;
            
            // Create cart item
            const cartItem = {
                id: new Date().getTime(),
                name: productName,
                price: price,
                quantity: quantity,
                image: imageSrc,
                total: price * quantity
            };
            
            // Add to cart (using localStorage for demo)
            let cart = JSON.parse(localStorage.getItem('ybc_cart')) || [];
            const existingItemIndex = cart.findIndex(item => item.name === productName);
            
            if (existingItemIndex > -1) {
                // Update quantity if item already in cart
                cart[existingItemIndex].quantity += quantity;
                cart[existingItemIndex].total = cart[existingItemIndex].price * cart[existingItemIndex].quantity;
            } else {
                // Add new item to cart
                cart.push(cartItem);
            }
            
            // Save to localStorage
            localStorage.setItem('ybc_cart', JSON.stringify(cart));
            
            // Update cart count in header
            updateCartCount();
            
            // Show success message
            showNotification(`"${productName}" a été ajouté au panier`, 'success');
            
            // Animate button
            this.innerHTML = '<i class="fas fa-check"></i> Ajouté au panier';
            this.classList.add('added-to-cart');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Ajouter au panier';
                this.classList.remove('added-to-cart');
            }, 2000);
        });
    }
    
    // ===== Wishlist Toggle =====
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productName = document.querySelector('.product-info h1').textContent;
            const icon = this.querySelector('i');
            
            // Toggle wishlist status
            if (icon.classList.contains('far')) {
                // Add to wishlist
                icon.classList.remove('far');
                icon.classList.add('fas', 'active');
                addToWishlist(productName);
                showNotification(`"${productName}" ajouté à votre liste de souhaits`, 'success');
            } else {
                // Remove from wishlist
                icon.classList.remove('fas', 'active');
                icon.classList.add('far');
                removeFromWishlist(productName);
                showNotification(`"${productName}" retiré de votre liste de souhaits`, 'info');
            }
            
            // Animate heart
            this.classList.add('animate-heart');
            setTimeout(() => {
                this.classList.remove('animate-heart');
            }, 300);
        });
    }
    
    // ===== Product Tabs =====
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update active tab button
                document.querySelector('.tab-btn.active').classList.remove('active');
                this.classList.add('active');
                
                // Show corresponding tab content
                document.querySelector('.tab-pane.active').classList.remove('active');
                document.getElementById(tabId).classList.add('active');
                
                // Update URL hash
                history.pushState(null, null, `#${tabId}`);
                
                // Store current tab
                currentTab = tabId;
            });
        });
        
        // Check URL hash on page load
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash) && document.querySelector(`[data-tab="${hash}"]`)) {
            document.querySelector(`[data-tab="${hash}"]`).click();
        }
    }
    
    // ===== Review Form =====
    if (reviewForm) {
        // Star rating interaction
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.previousElementSibling.value;
                updateStarRating(rating);
            });
            
            star.addEventListener('mouseover', function() {
                const rating = this.previousElementSibling.value;
                highlightStars(rating);
            });
        });
        
        // Reset stars on mouse leave
        document.querySelector('.rating-input').addEventListener('mouseleave', function() {
            const checkedInput = this.querySelector('input[type="radio"]:checked');
            if (checkedInput) {
                highlightStars(checkedInput.value);
            } else {
                resetStars();
            }
        });
        
        // Form submission
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const reviewData = {
                name: formData.get('name'),
                email: formData.get('email'),
                rating: formData.get('rating'),
                title: formData.get('title'),
                comment: formData.get('comment')
            };
            
            // Simple validation
            if (!reviewData.rating) {
                showNotification('Veuillez sélectionner une note', 'error');
                return;
            }
            
            // In a real app, you would send this data to your server
            console.log('Review submitted:', reviewData);
            
            // Show success message
            showNotification('Votre avis a été soumis avec succès. Merci !', 'success');
            
            // Reset form
            this.reset();
            resetStars();
            
            // In a real app, you would update the reviews section with the new review
            // For now, we'll just reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        });
    }
    
    // ===== Load More Reviews =====
    if (loadMoreReviewsBtn) {
        loadMoreReviewsBtn.addEventListener('click', function() {
            // In a real app, you would fetch more reviews from your server
            // For this demo, we'll just show a message
            showNotification('Chargement des avis supplémentaires...', 'info');
            
            // Simulate loading
            setTimeout(() => {
                // Here you would append the new reviews to the reviews list
                // For now, we'll just disable the button
                this.disabled = true;
                this.textContent = 'Tous les avis sont chargés';
                
                // Show success message
                showNotification('Tous les avis ont été chargés', 'success');
            }, 1000);
        });
    }
    
    // ===== Helper Functions =====
    
    // Update cart count in header
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('ybc_cart')) || [];
        const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count in header
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(el => {
            el.textContent = cartCount;
            if (cartCount > 0) {
                el.style.display = 'flex';
            } else {
                el.style.display = 'none';
            }
        });
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remove after 5 seconds
        const timeout = setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Add to wishlist
    function addToWishlist(productName) {
        let wishlist = JSON.parse(localStorage.getItem('ybc_wishlist')) || [];
        if (!wishlist.includes(productName)) {
            wishlist.push(productName);
            localStorage.setItem('ybc_wishlist', JSON.stringify(wishlist));
        }
    }
    
    // Remove from wishlist
    function removeFromWishlist(productName) {
        let wishlist = JSON.parse(localStorage.getItem('ybc_wishlist')) || [];
        wishlist = wishlist.filter(item => item !== productName);
        localStorage.setItem('ybc_wishlist', JSON.stringify(wishlist));
    }
    
    // Update star rating display
    function updateStarRating(rating) {
        ratingStars.forEach(star => {
            if (parseInt(star.previousElementSibling.value) <= rating) {
                star.innerHTML = '&#9733;'; // Filled star
            } else {
                star.innerHTML = '&#9734;'; // Empty star
            }
        });
    }
    
    // Highlight stars on hover
    function highlightStars(rating) {
        ratingStars.forEach(star => {
            if (parseInt(star.previousElementSibling.value) <= rating) {
                star.innerHTML = '&#9733;'; // Filled star
            } else {
                star.innerHTML = '&#9734;'; // Empty star
            }
        });
    }
    
    // Reset stars to default state
    function resetStars() {
        ratingStars.forEach(star => {
            star.innerHTML = '&#9734;'; // Empty star
        });
    }
    
    // Initialize cart count on page load
    updateCartCount();
    
    // Check if product is in wishlist on page load
    if (wishlistBtn) {
        const productName = document.querySelector('.product-info h1').textContent;
        const wishlist = JSON.parse(localStorage.getItem('ybc_wishlist')) || [];
        const icon = wishlistBtn.querySelector('i');
        
        if (wishlist.includes(productName)) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'active');
        }
    }
});

// Image zoom functionality
function initImageZoom() {
    const mainImage = document.getElementById('mainImage');
    const zoomLens = document.createElement('div');
    zoomLens.className = 'zoom-lens';
    const zoomResult = document.createElement('div');
    zoomResult.className = 'zoom-result';
    
    // Only initialize zoom if the main image exists
    if (!mainImage) return;
    
    // Create lens and result elements
    mainImage.parentElement.style.position = 'relative';
    mainImage.parentElement.appendChild(zoomLens);
    mainImage.parentElement.parentElement.appendChild(zoomResult);
    
    // Calculate the ratio between result and lens
    const lensWidth = 150;
    const lensHeight = 150;
    const resultWidth = 400;
    const resultHeight = 400;
    
    // Set lens size
    zoomLens.style.width = `${lensWidth}px`;
    zoomLens.style.height = `${lensHeight}px`;
    
    // Set result size
    zoomResult.style.width = `${resultWidth}px`;
    zoomResult.style.height = `${resultHeight}px`;
    
    // Calculate the ratio between result and lens
    const ratioW = resultWidth / lensWidth;
    const ratioH = resultHeight / lensHeight;
    
    // Set background image for the result
    zoomResult.style.backgroundImage = `url('${mainImage.src}')`;
    zoomResult.style.backgroundSize = `${mainImage.width * ratioW}px ${mainImage.height * ratioH}px`;
    
    // Show lens and result on mouse move over the image
    mainImage.addEventListener('mousemove', moveLens);
    
    // Hide lens and result when mouse leaves the image
    mainImage.addEventListener('mouseout', () => {
        zoomLens.style.display = 'none';
        zoomResult.style.display = 'none';
    });
    
    // Show lens and result when mouse enters the image
    mainImage.addEventListener('mouseenter', () => {
        zoomLens.style.display = 'block';
        zoomResult.style.display = 'block';
    });
    
    function moveLens(e) {
        // Prevent default behavior
        e.preventDefault();
        
        // Get the cursor's x and y positions relative to the image
        const rect = mainImage.getBoundingClientRect();
        let x = e.pageX - rect.left - window.pageXOffset;
        let y = e.pageY - rect.top - window.pageYOffset;
        
        // Prevent the lens from being positioned outside the image
        if (x > mainImage.width - lensWidth / 2) {
            x = mainImage.width - lensWidth / 2;
        }
        if (x < lensWidth / 2) {
            x = lensWidth / 2;
        }
        if (y > mainImage.height - lensHeight / 2) {
            y = mainImage.height - lensHeight / 2;
        }
        if (y < lensHeight / 2) {
            y = lensHeight / 2;
        }
        
        // Position the lens
        zoomLens.style.left = `${x - lensWidth / 2}px`;
        zoomLens.style.top = `${y - lensHeight / 2}px`;
        
        // Calculate the background position for the result
        const bgX = (x * ratioW) - (lensWidth / 2 * ratioW);
        const bgY = (y * ratioH) - (lensHeight / 2 * ratioH);
        
        // Position the result
        zoomResult.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    }
}

// Initialize image zoom when the page loads
window.addEventListener('load', initImageZoom);

// Re-initialize image zoom when the window is resized
window.addEventListener('resize', initImageZoom);

// Re-initialize image zoom when the main image is changed
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'src') {
            initImageZoom();
        }
    });
});

const mainImage = document.getElementById('mainImage');
if (mainImage) {
    observer.observe(mainImage, { attributes: true });
}
