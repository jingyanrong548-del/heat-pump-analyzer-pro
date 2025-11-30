// src/js/ui-dashboard.js
// V18.3: Mobile Sidebar Logic & Responsive Interactions

// --- 状态管理 ---
const state = {
    activeTab: 'charts', // 默认激活 '图表分析'
    accordionState: {
        'accordion-project': true,   // 默认展开
        'accordion-scheme': false,
        'accordion-operating': false,
        'accordion-financial': false
    },
    notifierTimeout: null // 用于管理通知定时器
};

/**
 * 初始化仪表盘的所有交互逻辑
 */
export function initializeDashboard() {
    setupAccordion();
    setupTabs();
    setupMobileSidebar(); // [新增] 初始化移动端侧边栏逻辑
    
    // 初始化时，触发一次Tab状态更新，确保正确显示
    switchTab(state.activeTab);
}

/**
 * 1. 侧边栏折叠面板 (Accordion) 逻辑
 */
function setupAccordion() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const contentId = header.getAttribute('aria-controls');
            const content = document.getElementById(contentId);
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // 切换当前面板状态
            toggleAccordionItem(header, content, !isExpanded);
        });
    });
}

function toggleAccordionItem(header, content, shouldOpen) {
    if (!header || !content) return;
    
    if (shouldOpen) {
        content.classList.remove('hidden');
        requestAnimationFrame(() => {
            content.classList.add('open');
            header.setAttribute('aria-expanded', 'true');
        });
    } else {
        content.classList.remove('open');
        header.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            if (header.getAttribute('aria-expanded') === 'false') {
                content.classList.add('hidden');
            }
        }, 300); 
    }
}

/**
 * 手动展开指定的 Accordion
 */
export function openAccordionGroup(groupId) {
    const container = document.getElementById(groupId);
    if (!container) return;
    
    const header = container.querySelector('.accordion-header');
    const content = container.querySelector('.accordion-content');
    
    if (header && content) {
        toggleAccordionItem(header, content, true);
        setTimeout(() => {
            header.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    }
}

/**
 * 2. 结果区标签页 (Tabs) 逻辑
 */
function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.dataset.tab;
            if (targetTab) {
                switchTab(targetTab);
            }
        });
    });
}

export function switchTab(tabId) {
    // 1. 更新 Links 状态
    document.querySelectorAll('.tab-link').forEach(link => {
        if (link.dataset.tab === tabId) {
            link.classList.add('tab-active');
        } else {
            link.classList.remove('tab-active');
        }
    });

    // 2. 更新 Content 状态
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `tab-${tabId}`) {
            content.classList.remove('hidden');
            triggerChartResize(content);
        } else {
            content.classList.add('hidden');
        }
    });

    state.activeTab = tabId;
}

function triggerChartResize(container) {
    const canvases = container.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        window.dispatchEvent(new Event('resize'));
    });
}

/**
 * 3. [新增] 移动端侧边栏逻辑
 * 控制“参数配置”抽屉的滑出与收起
 */
function setupMobileSidebar() {
    const sidebar = document.getElementById('input-sidebar');
    const openBtn = document.getElementById('mobile-open-config');     // 底部悬浮按钮
    const closeBtn = document.getElementById('mobile-sidebar-close');  // 抽屉右上角关闭按钮
    const calcBtn = document.getElementById('calculateBtn');           // 运行计算按钮

    if (!sidebar) return;

    // 切换函数：通过 CSS class 控制 translate
    const toggleSidebar = (show) => {
        if (show) {
            sidebar.classList.remove('translate-y-full');
            sidebar.classList.add('translate-y-0');
            // 防止背景滚动
            document.body.style.overflow = 'hidden';
        } else {
            sidebar.classList.remove('translate-y-0');
            sidebar.classList.add('translate-y-full');
            // 恢复背景滚动
            document.body.style.overflow = '';
        }
    };

    // 绑定事件
    if (openBtn) openBtn.addEventListener('click', () => toggleSidebar(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleSidebar(false));

    // 移动端体验优化：点击“运行计算”后自动收起抽屉，并滚动到结果顶部
    if (calcBtn) {
        calcBtn.addEventListener('click', () => {
            if (window.innerWidth < 768) { // 仅在移动端生效
                toggleSidebar(false);
                setTimeout(() => scrollToResults(), 300); // 等待抽屉收起动画结束
            }
        });
    }
}

/**
 * 4. 界面状态更新辅助函数
 */

export function setExportButtonState(isEnabled) {
    const btn = document.getElementById('export-report-btn');
    if (!btn) return;

    if (isEnabled) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.classList.add('hover:bg-blue-700', 'shadow-md');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.classList.remove('hover:bg-blue-700', 'shadow-md');
    }
}

// 滚动到结果区域 (适配新布局)
export function scrollToResults() {
    const mainArea = document.getElementById('main-results-area');
    if (mainArea) {
        // 对于新的 Flex 布局，在移动端通常是 Window 滚动，或者 Main 容器滚动
        // 这里尝试将主要结果区滚动到视口顶部
        mainArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // 兜底：如果是 body 滚动
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

export function showResultsPlaceholder() {
    const placeholder = document.getElementById('report-placeholder');
    const content = document.getElementById('report-content');
    
    if (placeholder) placeholder.classList.remove('hidden');
    if (content) content.classList.add('hidden');
    
    updateResultCard('annual-saving', '-- 万');
    updateResultCard('irr', '-- %');
    updateResultCard('pbp', '-- 年');
    updateResultCard('co2-reduction', '-- 吨');
}

export function showResultsContent() {
    const placeholder = document.getElementById('report-placeholder');
    const content = document.getElementById('report-content');
    
    if (placeholder) placeholder.classList.add('hidden');
    if (content) content.classList.remove('hidden');
    
    switchTab(state.activeTab);
}

export function updateResultCard(key, value, colorClass = null) {
    const el = document.getElementById(`card-${key}`);
    if (el) {
        el.textContent = value;
        if (colorClass) {
            // 清除旧的颜色类 (简单粗暴但有效)
            el.className = el.className.replace(/text-(green|yellow|red|gray)-\d+/, '');
            el.classList.add(...colorClass.split(' '));
        }
    }
}

export function showGlobalNotification(message, type = 'info', duration = 3000) {
    const notifier = document.getElementById('global-notifier');
    const notifierText = document.getElementById('global-notifier-text');
    
    if (!notifier || !notifierText) return;

    if (state.notifierTimeout) clearTimeout(state.notifierTimeout);

    notifierText.textContent = message;
    
    // 重置基础样式，根据类型添加颜色
    notifier.className = 'fixed top-8 right-8 z-[100] max-w-lg p-6 rounded-2xl shadow-2xl transition-all duration-300 transform';
    
    if (type === 'success') {
        notifier.classList.add('bg-green-100', 'text-green-800');
    } else if (type === 'error') {
        notifier.classList.add('bg-red-100', 'text-red-800');
    } else {
        notifier.classList.add('bg-blue-100', 'text-blue-800');
    }
    
    // 显示
    notifier.classList.remove('translate-x-full', 'hidden');
    
    state.notifierTimeout = setTimeout(() => {
        notifier.classList.add('translate-x-full');
        setTimeout(() => notifier.classList.add('hidden'), 300);
    }, duration);
}