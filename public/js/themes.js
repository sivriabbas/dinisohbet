// Tema Yönetim Sistemi
// Hazır temalar ve özel tema oluşturma

const PRESET_THEMES = {
    default: {
        name: 'Varsayılan',
        icon: '🌐',
        colors: {
            primary: '#2c5f2d',
            secondary: '#97BC62',
            accent: '#FFD700',
            background: '#ffffff',
            cardBg: '#ffffff',
            textPrimary: '#333333',
            textSecondary: '#666666',
            border: '#e0e0e0'
        }
    },
    green: {
        name: 'Yeşil Orman',
        icon: '🌲',
        colors: {
            primary: '#2d5016',
            secondary: '#4a7c2c',
            accent: '#7cb342',
            background: '#f1f8e9',
            cardBg: '#ffffff',
            textPrimary: '#1b5e20',
            textSecondary: '#558b2f',
            border: '#c5e1a5'
        }
    },
    blue: {
        name: 'Gökyüzü Mavisi',
        icon: '☁️',
        colors: {
            primary: '#1565c0',
            secondary: '#1976d2',
            accent: '#42a5f5',
            background: '#e3f2fd',
            cardBg: '#ffffff',
            textPrimary: '#0d47a1',
            textSecondary: '#1976d2',
            border: '#90caf9'
        }
    },
    purple: {
        name: 'Mor Sümbül',
        icon: '🌸',
        colors: {
            primary: '#6a1b9a',
            secondary: '#8e24aa',
            accent: '#ab47bc',
            background: '#f3e5f5',
            cardBg: '#ffffff',
            textPrimary: '#4a148c',
            textSecondary: '#7b1fa2',
            border: '#ce93d8'
        }
    },
    gold: {
        name: 'Altın Işık',
        icon: '✨',
        colors: {
            primary: '#f57c00',
            secondary: '#ff9800',
            accent: '#ffc107',
            background: '#fff3e0',
            cardBg: '#ffffff',
            textPrimary: '#e65100',
            textSecondary: '#f57c00',
            border: '#ffcc80'
        }
    },
    night: {
        name: 'Gece Mavisi',
        icon: '🌙',
        colors: {
            primary: '#1a237e',
            secondary: '#283593',
            accent: '#3f51b5',
            background: '#0d1b2a',
            cardBg: '#1b263b',
            textPrimary: '#e0e1dd',
            textSecondary: '#9db4c0',
            border: '#415a77'
        }
    },
    sepia: {
        name: 'Sepya',
        icon: '📜',
        colors: {
            primary: '#5d4037',
            secondary: '#795548',
            accent: '#a1887f',
            background: '#efebe9',
            cardBg: '#fafafa',
            textPrimary: '#3e2723',
            textSecondary: '#5d4037',
            border: '#bcaaa4'
        }
    },
    ocean: {
        name: 'Okyanus',
        icon: '🌊',
        colors: {
            primary: '#006064',
            secondary: '#00838f',
            accent: '#00acc1',
            background: '#e0f7fa',
            cardBg: '#ffffff',
            textPrimary: '#004d40',
            textSecondary: '#00695c',
            border: '#80deea'
        }
    },
    forest: {
        name: 'Koyu Orman',
        icon: '🌳',
        colors: {
            primary: '#1b5e20',
            secondary: '#2e7d32',
            accent: '#43a047',
            background: '#e8f5e9',
            cardBg: '#ffffff',
            textPrimary: '#1b5e20',
            textSecondary: '#388e3c',
            border: '#a5d6a7'
        }
    },
    rose: {
        name: 'Gül Bahçesi',
        icon: '🌹',
        colors: {
            primary: '#c2185b',
            secondary: '#d81b60',
            accent: '#f06292',
            background: '#fce4ec',
            cardBg: '#ffffff',
            textPrimary: '#880e4f',
            textSecondary: '#ad1457',
            border: '#f8bbd0'
        }
    },
    emerald: {
        name: 'Zümrüt',
        icon: '💎',
        colors: {
            primary: '#00695c',
            secondary: '#00897b',
            accent: '#26a69a',
            background: '#e0f2f1',
            cardBg: '#ffffff',
            textPrimary: '#004d40',
            textSecondary: '#00695c',
            border: '#80cbc4'
        }
    },
    sunset: {
        name: 'Gün Batımı',
        icon: '🌅',
        colors: {
            primary: '#d84315',
            secondary: '#e64a19',
            accent: '#ff7043',
            background: '#fbe9e7',
            cardBg: '#ffffff',
            textPrimary: '#bf360c',
            textSecondary: '#d84315',
            border: '#ffab91'
        }
    }
};

class ThemeManager {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.customThemes = this.loadCustomThemes();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        
        // Listen for theme changes
        document.addEventListener('themeChange', (e) => {
            this.applyTheme(e.detail.theme);
        });
    }

    loadTheme() {
        const saved = localStorage.getItem('selectedTheme');
        return saved || 'default';
    }

    loadCustomThemes() {
        const saved = localStorage.getItem('customThemes');
        try {
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    saveCustomThemes() {
        localStorage.setItem('customThemes', JSON.stringify(this.customThemes));
    }

    getAllThemes() {
        return { ...PRESET_THEMES, ...this.customThemes };
    }

    getTheme(themeName) {
        return this.getAllThemes()[themeName] || PRESET_THEMES.default;
    }

    applyTheme(themeName) {
        const theme = this.getTheme(themeName);
        const root = document.documentElement;

        // Apply CSS variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(cssVar, value);
        });

        // Save selection
        this.currentTheme = themeName;
        localStorage.setItem('selectedTheme', themeName);

        // Update UI
        this.updateThemeDisplay();

        // Dispatch event
        document.dispatchEvent(new CustomEvent('themeApplied', { 
            detail: { themeName, theme } 
        }));
    }

    createCustomTheme(name, icon, colors) {
        const themeId = 'custom_' + Date.now();
        this.customThemes[themeId] = {
            name,
            icon: icon || '🎨',
            colors,
            custom: true,
            createdAt: new Date().toISOString()
        };
        this.saveCustomThemes();
        return themeId;
    }

    deleteCustomTheme(themeId) {
        if (this.customThemes[themeId]) {
            delete this.customThemes[themeId];
            this.saveCustomThemes();
            
            // If deleted theme was active, switch to default
            if (this.currentTheme === themeId) {
                this.applyTheme('default');
            }
            
            return true;
        }
        return false;
    }

    exportTheme(themeName) {
        const theme = this.getTheme(themeName);
        if (!theme) return null;

        const exportData = {
            name: theme.name,
            icon: theme.icon,
            colors: theme.colors,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(exportData, null, 2);
    }

    importTheme(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validate
            if (!data.colors || typeof data.colors !== 'object') {
                throw new Error('Geçersiz tema formatı');
            }

            const requiredColors = ['primary', 'secondary', 'accent', 'background', 'cardBg', 'textPrimary', 'textSecondary', 'border'];
            const missingColors = requiredColors.filter(c => !data.colors[c]);
            
            if (missingColors.length > 0) {
                throw new Error(`Eksik renkler: ${missingColors.join(', ')}`);
            }

            const themeId = this.createCustomTheme(
                data.name || 'İçe Aktarılan Tema',
                data.icon || '🎨',
                data.colors
            );

            return { success: true, themeId };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    updateThemeDisplay() {
        const displays = document.querySelectorAll('.current-theme-display');
        const theme = this.getTheme(this.currentTheme);
        
        displays.forEach(display => {
            display.textContent = `${theme.icon} ${theme.name}`;
        });
    }

    previewTheme(themeName) {
        const theme = this.getTheme(themeName);
        const root = document.documentElement;

        // Temporarily apply colors
        Object.entries(theme.colors).forEach(([key, value]) => {
            const cssVar = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
            root.style.setProperty(cssVar, value);
        });
    }

    cancelPreview() {
        this.applyTheme(this.currentTheme);
    }
}

// Initialize theme manager
let themeManager;
document.addEventListener('DOMContentLoaded', function() {
    themeManager = new ThemeManager();
});

// Helper functions for UI
function openThemeGallery() {
    const modal = document.getElementById('themeGalleryModal');
    if (modal) {
        modal.style.display = 'flex';
        renderThemeGallery();
    }
}

function closeThemeGallery() {
    const modal = document.getElementById('themeGalleryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function renderThemeGallery() {
    const container = document.getElementById('themeGalleryGrid');
    if (!container) return;

    const themes = themeManager.getAllThemes();
    container.innerHTML = '';

    Object.entries(themes).forEach(([themeId, theme]) => {
        const card = createThemeCard(themeId, theme);
        container.appendChild(card);
    });
}

function createThemeCard(themeId, theme) {
    const div = document.createElement('div');
    div.className = 'theme-card';
    if (themeManager.currentTheme === themeId) {
        div.classList.add('active');
    }

    const colorPalette = Object.values(theme.colors).slice(0, 5).map(color => 
        `<div class="color-swatch" style="background-color: ${color}"></div>`
    ).join('');

    div.innerHTML = `
        <div class="theme-card-header">
            <span class="theme-icon">${theme.icon}</span>
            <h4>${theme.name}</h4>
            ${theme.custom ? '<span class="custom-badge">Özel</span>' : ''}
        </div>
        <div class="color-palette">
            ${colorPalette}
        </div>
        <div class="theme-card-actions">
            <button onclick="themeManager.applyTheme('${themeId}')" class="btn-apply">
                ${themeManager.currentTheme === themeId ? '✓ Aktif' : 'Uygula'}
            </button>
            <button onclick="themeManager.previewTheme('${themeId}')" class="btn-preview">
                Önizle
            </button>
            ${theme.custom ? `<button onclick="deleteTheme('${themeId}')" class="btn-delete">Sil</button>` : ''}
        </div>
    `;

    return div;
}

function deleteTheme(themeId) {
    if (confirm('Bu temayı silmek istediğinize emin misiniz?')) {
        if (themeManager.deleteCustomTheme(themeId)) {
            renderThemeGallery();
        }
    }
}

function openCustomThemeCreator() {
    const modal = document.getElementById('customThemeModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeCustomThemeCreator() {
    const modal = document.getElementById('customThemeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function createCustomTheme() {
    const name = document.getElementById('themeName').value;
    const icon = document.getElementById('themeIcon').value || '🎨';
    
    const colors = {
        primary: document.getElementById('colorPrimary').value,
        secondary: document.getElementById('colorSecondary').value,
        accent: document.getElementById('colorAccent').value,
        background: document.getElementById('colorBackground').value,
        cardBg: document.getElementById('colorCardBg').value,
        textPrimary: document.getElementById('colorTextPrimary').value,
        textSecondary: document.getElementById('colorTextSecondary').value,
        border: document.getElementById('colorBorder').value
    };

    if (!name.trim()) {
        alert('Lütfen tema adı girin');
        return;
    }

    const themeId = themeManager.createCustomTheme(name, icon, colors);
    themeManager.applyTheme(themeId);
    
    closeCustomThemeCreator();
    renderThemeGallery();
}

function exportCurrentTheme() {
    const json = themeManager.exportTheme(themeManager.currentTheme);
    if (json) {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tema-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

function importTheme() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = themeManager.importTheme(event.target.result);
                if (result.success) {
                    alert('Tema başarıyla içe aktarıldı!');
                    renderThemeGallery();
                } else {
                    alert('Tema içe aktarılamadı: ' + result.error);
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}
