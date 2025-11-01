// Widget Yönetim Sistemi
// Widget düzeni localStorage'da saklanır

const DEFAULT_WIDGETS = [
    { id: 'daily-ayah', name: 'Günün Ayeti', enabled: true, order: 1 },
    { id: 'prayer-times', name: 'Namaz Vakitleri', enabled: true, order: 2 },
    { id: 'daily-hadith', name: 'Günün Hadisi', enabled: true, order: 3 },
    { id: 'goals-progress', name: 'Hedef İlerlemesi', enabled: true, order: 4 },
    { id: 'weather', name: 'Hava Durumu', enabled: false, order: 5 },
    { id: 'recent-posts', name: 'Son Paylaşımlar', enabled: true, order: 6 }
];

class WidgetManager {
    constructor() {
        this.widgets = this.loadWidgets();
        this.isDragging = false;
        this.draggedElement = null;
    }

    loadWidgets() {
        const saved = localStorage.getItem('widgetLayout');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return [...DEFAULT_WIDGETS];
            }
        }
        return [...DEFAULT_WIDGETS];
    }

    saveWidgets() {
        localStorage.setItem('widgetLayout', JSON.stringify(this.widgets));
    }

    toggleWidget(widgetId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.enabled = !widget.enabled;
            this.saveWidgets();
            this.render();
        }
    }

    reorderWidget(widgetId, newOrder) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.order = newOrder;
            this.saveWidgets();
            this.render();
        }
    }

    resetLayout() {
        this.widgets = [...DEFAULT_WIDGETS];
        this.saveWidgets();
        this.render();
    }

    render() {
        const container = document.getElementById('widgetContainer');
        if (!container) return;

        const enabledWidgets = this.widgets
            .filter(w => w.enabled)
            .sort((a, b) => a.order - b.order);

        container.innerHTML = '';
        
        enabledWidgets.forEach(widget => {
            const element = this.createWidgetElement(widget);
            if (element) {
                container.appendChild(element);
            }
        });
    }

    createWidgetElement(widget) {
        const div = document.createElement('div');
        div.className = 'widget-item';
        div.dataset.widgetId = widget.id;
        div.draggable = true;

        // Drag events
        div.addEventListener('dragstart', (e) => this.handleDragStart(e));
        div.addEventListener('dragover', (e) => this.handleDragOver(e));
        div.addEventListener('drop', (e) => this.handleDrop(e));
        div.addEventListener('dragend', (e) => this.handleDragEnd(e));

        // Widget içeriği
        div.innerHTML = this.getWidgetContent(widget.id);
        
        return div;
    }

    getWidgetContent(widgetId) {
        const widget = document.getElementById(widgetId);
        return widget ? widget.innerHTML : `<p>Widget yükleniyor...</p>`;
    }

    handleDragStart(e) {
        this.isDragging = true;
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        
        const afterElement = this.getDragAfterElement(e.currentTarget.parentElement, e.clientY);
        const draggable = this.draggedElement;
        
        if (afterElement == null) {
            e.currentTarget.parentElement.appendChild(draggable);
        } else {
            e.currentTarget.parentElement.insertBefore(draggable, afterElement);
        }
        
        return false;
    }

    handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        this.updateOrder();
        return false;
    }

    handleDragEnd(e) {
        this.isDragging = false;
        e.target.classList.remove('dragging');
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.widget-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    updateOrder() {
        const container = document.getElementById('widgetContainer');
        const items = container.querySelectorAll('.widget-item');
        
        items.forEach((item, index) => {
            const widgetId = item.dataset.widgetId;
            const widget = this.widgets.find(w => w.id === widgetId);
            if (widget) {
                widget.order = index + 1;
            }
        });
        
        this.saveWidgets();
    }

    showSettings() {
        const modal = document.getElementById('widgetSettingsModal');
        if (modal) {
            modal.style.display = 'flex';
            this.renderSettings();
        }
    }

    hideSettings() {
        const modal = document.getElementById('widgetSettingsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    renderSettings() {
        const list = document.getElementById('widgetSettingsList');
        if (!list) return;

        list.innerHTML = '';
        
        this.widgets
            .sort((a, b) => a.order - b.order)
            .forEach(widget => {
                const item = document.createElement('div');
                item.className = 'widget-setting-item';
                item.innerHTML = `
                    <div class="widget-setting-info">
                        <i class="fas fa-grip-vertical"></i>
                        <span>${widget.name}</span>
                    </div>
                    <label class="widget-toggle">
                        <input type="checkbox" ${widget.enabled ? 'checked' : ''} 
                               onchange="widgetManager.toggleWidget('${widget.id}')">
                        <span class="toggle-slider"></span>
                    </label>
                `;
                list.appendChild(item);
            });
    }
}

// Global instance
let widgetManager;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    widgetManager = new WidgetManager();
    widgetManager.render();
    
    // Auto-refresh widgets
    setInterval(() => {
        if (document.hidden) return;
        
        // Refresh prayer times widget
        const prayerWidget = document.querySelector('[data-widget-id="prayer-times"]');
        if (prayerWidget) {
            updatePrayerTimes();
        }
    }, 60000); // Every minute
});

// Widget-specific functions
async function updatePrayerTimes() {
    try {
        const response = await fetch('/prayer-times/api/today');
        const data = await response.json();
        
        const widget = document.querySelector('[data-widget-id="prayer-times"] .widget-content');
        if (widget && data.times) {
            // Update prayer times display
            updatePrayerTimesDisplay(data.times);
        }
    } catch (error) {
        console.error('Prayer times update error:', error);
    }
}

function updatePrayerTimesDisplay(times) {
    // Implementation for updating prayer times
    const now = new Date();
    const timesList = document.getElementById('prayerTimesList');
    if (!timesList) return;

    const prayerNames = {
        Fajr: 'İmsak',
        Sunrise: 'Güneş',
        Dhuhr: 'Öğle',
        Asr: 'İkindi',
        Maghrib: 'Akşam',
        Isha: 'Yatsı'
    };

    let html = '';
    for (const [key, value] of Object.entries(times)) {
        if (prayerNames[key]) {
            html += `
                <div class="prayer-time-row">
                    <span>${prayerNames[key]}</span>
                    <span class="time">${value}</span>
                </div>
            `;
        }
    }
    timesList.innerHTML = html;
}
