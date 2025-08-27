/**
 * Enhanced JavaScript for HN-style blog
 */

// Mobile menu functionality
var MenuApi = (function() {
    var menuBtn = document.querySelector('#headerMenu');
    var nav = document.querySelector('#headerNav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            nav.classList.toggle('show');
            menuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('#top')) {
                nav.classList.remove('show');
                menuBtn.classList.remove('active');
            }
        });
        
        // Close menu when window is resized to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                nav.classList.remove('show');
                menuBtn.classList.remove('active');
            }
        });
    }
})();

// Header scroll behavior
var ScrollApi = (function() {
    var header = document.querySelector('#top');
    var lastScrollTop = 0;
    
    if (header) {
        function doScroll() {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide header on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.classList.add('hide');
            } else {
                header.classList.remove('hide');
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }
        
        var ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    doScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
})();

// Theme persistence and initialization
var ThemeApi = (function() {
    var body = document.body;
    var currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme immediately to prevent flash
    body.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle button if it exists
    document.addEventListener('DOMContentLoaded', function() {
        var themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
        }
    });
})();

// Search enhancement
var SearchApi = (function() {
    var debounceTimer;
    
    document.addEventListener('DOMContentLoaded', function() {
        var searchInput = document.getElementById('search-input');
        var searchResults = document.getElementById('search-results');
        
        if (searchInput && searchResults) {
            // Debounced search
            searchInput.addEventListener('input', function() {
                clearTimeout(debounceTimer);
                var query = this.value.toLowerCase().trim();
                
                debounceTimer = setTimeout(function() {
                    performSearch(query, searchResults);
                }, 300);
            });
            
            // Clear results on escape key
            searchInput.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    searchResults.innerHTML = '';
                    this.blur();
                }
            });
        }
    });
    
    function performSearch(query, resultsContainer) {
        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        // This would be populated by Jekyll in the actual page
        if (typeof posts !== 'undefined') {
            var filteredPosts = posts.filter(function(post) {
                return post.title.toLowerCase().includes(query) ||
                       (post.content && post.content.toLowerCase().includes(query));
            }).slice(0, 5);
            
            resultsContainer.innerHTML = filteredPosts.map(function(post) {
                return '<a href="' + post.url + '" class="search-result">' + 
                       escapeHtml(post.title) + '</a>';
            }).join('');
        }
    }
    
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
})();

// Smooth scroll for anchor links
var SmoothScrollApi = (function() {
    document.addEventListener('click', function(event) {
        var target = event.target;
        if (target.tagName === 'A' && target.getAttribute('href') && target.getAttribute('href').startsWith('#')) {
            event.preventDefault();
            var targetElement = document.querySelector(target.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
})();

// Back to top functionality
var BackToTopApi = (function() {
    var backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
            
            if (scrollTop > 200) {
                backToTop.classList.add('back-to-top-show');
            } else {
                backToTop.classList.remove('back-to-top-show');
            }
        });
    }
})();

// Reading progress indicator (for post pages)
var ProgressApi = (function() {
    var progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 2px;
        background: #ff6600;
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    
    // Only add progress bar on post pages
    if (document.querySelector('.post-article')) {
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            var scrollTop = window.pageYOffset;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                var scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
            }
        });
    }
})();

console.log('HN-style blog JavaScript loaded successfully');
