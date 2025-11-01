// Like button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    initThemeToggle();
    
    // Beğeni butonları
    const likeButtons = document.querySelectorAll('.btn-like');
    likeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const postId = button.dataset.postId;
            const isLiked = button.dataset.liked === 'true';
            
            try {
                const response = await fetch(`/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    button.querySelector('.like-count').textContent = data.likes;
                    button.dataset.liked = data.liked;
                    
                    const icon = button.querySelector('i');
                    if (data.liked) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        button.classList.add('liked');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        button.classList.remove('liked');
                    }
                }
            } catch (error) {
                console.error('Beğeni hatası:', error);
            }
        });
    });
    
    // Favori butonları
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const duaId = button.dataset.duaId;
            const isFavorited = button.dataset.favorited === 'true';
            
            try {
                const response = await fetch(`/duas/${duaId}/favorite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    button.querySelector('.favorite-count').textContent = data.favorites;
                    button.dataset.favorited = data.favorited;
                    
                    const icon = button.querySelector('i');
                    if (data.favorited) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        button.classList.add('favorited');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        button.classList.remove('favorited');
                    }
                }
            } catch (error) {
                console.error('Favori hatası:', error);
            }
        });
    });
    
    // Dropdown menu
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const menu = toggle.nextElementSibling;
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.dropdown-toggle')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
});

// Dark Mode Theme Toggle Function
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // localStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Toggle butonu click eventi
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Tema değiştir
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            // Animasyon efekti
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        if (theme === 'dark') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.setAttribute('title', 'Aydınlık Tema');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute('title', 'Karanlık Tema');
        }
    }
}
