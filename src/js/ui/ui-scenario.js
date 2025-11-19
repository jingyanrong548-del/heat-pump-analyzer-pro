// src/js/ui/ui-scenario.js

import { fWan, fTon, fCop, fPercent, fYears } from '../core/utils.js';

// --- 模块内部状态 ---
let savedScenarios = [];
let lastSavedScenarios = []; // 用于恢复清空操作

// --- 全局通知功能 ---
const notifier = {
    element: null,
    iconSuccess: null,
    iconError: null,
    text: null,
    timer: null,
    init() {
        this.element = document.getElementById('global-notifier');
        this.iconSuccess = document.getElementById('global-notifier-icon-success');
        this.iconError = document.getElementById('global-notifier-icon-error');
        this.text = document.getElementById('global-notifier-text');
    }
};

/**
 * 显示全局通知
 * @param {string} message - 通知内容
 * @param {'success'|'error'|'info'} type - 通知类型
 * @param {number} duration - 显示时长 (毫秒)
 */
export function showGlobalNotification(message, type = 'info', duration = 3000) {
    if (!notifier.element) notifier.init();
    if (!notifier.element) return;

    clearTimeout(notifier.timer);

    notifier.text.textContent = message;
    
    // Reset classes
    notifier.element.className = 'fixed top-5 right-5 z-50 max-w-sm p-4 rounded-lg shadow-lg';
    notifier.iconSuccess.classList.add('hidden');
    notifier.iconError.classList.add('hidden');

    if (type === 'success') {
        notifier.element.classList.add('bg-green-100', 'text-green-700');
        notifier.iconSuccess.classList.remove('hidden');
    } else if (type === 'error') {
        notifier.element.classList.add('bg-red-100', 'text-red-700');
        notifier.iconError.classList.remove('hidden');
    } else { // info
        notifier.element.classList.add('bg-blue-100', 'text-blue-700');
        // No icon for info, or you can add one
    }

    notifier.element.classList.remove('hidden');

    notifier.timer = setTimeout(() => {
        notifier.element.classList.add('hidden');
    }, duration);
}

// --- 模态框 (Modal) 功能 ---
const modal = {
    element: null,
    title: null,
    message: null,
    cancelBtn: null,
    okBtn: null,
    init() {
        this.element = document.getElementById('confirm-modal');
        this.title = document.getElementById('confirm-modal-title');
        this.message = document.getElementById('confirm-modal-message');
        this.cancelBtn = document.getElementById('confirm-modal-cancel-btn');
        this.okBtn = document.getElementById('confirm-modal-ok-btn');
    }
};

/**
 * 初始化模态框的事件监听
 */
export function initializeModal() {
    if (!modal.element) modal.init();
    if (!modal.element) return;
    
    // 点击外部或取消按钮关闭模态框
    modal.element.addEventListener('click', (e) => {
        if (e.target.id === 'confirm-modal' || e.target.id === 'confirm-modal-cancel-btn') {
            modal.element.classList.add('hidden');
        }
    });
}

/**
 * 显示确认模态框，并返回一个Promise
 * @param {string} title - 模态框标题
 * @param {string} message - 模态框消息
 * @returns {Promise<boolean>} - 用户点击确认则 resolve(true)，否则 resolve(false)
 */
function showConfirmModal(title, message) {
    return new Promise(resolve => {
        if (!modal.element) modal.init();
        if (!modal.element) {
            resolve(window.confirm(`${title}\n${message}`)); // Fallback to native confirm
            return;
        }

        modal.title.textContent = title;
        modal.message.textContent = message;
        
        const handleOk = () => {
            modal.element.classList.add('hidden');
            resolve(true);
            cleanup();
        };

        const handleCancel = () => {
            modal.element.classList.add('hidden');
            resolve(false);
            cleanup();
        };

        const cleanup = () => {
            modal.okBtn.removeEventListener('click', handleOk);
            modal.cancelBtn.removeEventListener('click', handleCancel);
        };
        
        modal.okBtn.addEventListener('click', handleOk);
        modal.cancelBtn.addEventListener('click', handleCancel);

        modal.element.classList.remove('hidden');
    });
}

/**
 * 高阶函数：包装一个函数，使其在执行前弹出确认框
 * @param {Function} func - 需要被包装的函数
 * @param {object} options - 模态框的配置
 * @param {string} options.title - 标题
 * @param {string} options.message - 消息
 * @returns {Function} - 返回一个新的函数
 */
export function attachConfirmation(func, { title, message }) {
    return async (...args) => {
        const confirmed = await showConfirmModal(title, message);
        if (confirmed) {
            func(...args);
        }
    };
}


// --- 方案对比 (Scenario) 功能 ---

/**
 * 添加一个新方案到暂存列表
 * @param {object} scenarioData - 方案数据
 */
export function addScenario(scenarioData) {
    savedScenarios.push({ id: `scenario-${Date.now()}`, ...scenarioData });
}

/**
 * 获取所有暂存的方案
 * @returns {Array}
 */
export function getScenarios() {
    return savedScenarios;
}

/**
 * 根据ID删除一个方案
 * @param {string} scenarioId - 要删除的方案ID
 */
export function deleteScenario(scenarioId) {
    savedScenarios = savedScenarios.filter(s => s.id !== scenarioId);
}

/**
 * 清空所有暂存的方案
 */
export function clearScenarios() {
    lastSavedScenarios = [...savedScenarios]; // 备份以便恢复
    savedScenarios = [];
}

/**
 * 将暂存的方案渲染到UI表格中
 */
function renderScenarioTable() {
    // (Your existing renderScenarioTable function code goes here, unchanged)
    const container = document.getElementById('scenario-comparison-container');
    const tableWrapper = document.getElementById('scenario-table-wrapper'); 
    const tableBody = document.getElementById('scenario-comparison-table')?.querySelector('tbody');
    const summaryContainer = document.getElementById('scenario-summary');
    const scenarioToggle = document.getElementById('enableScenarioComparison');
    const clearBtn = document.getElementById('clearScenariosBtn');
    const undoBtn = document.getElementById('undoClearBtn');

    if (!container || !scenarioToggle || !tableBody) return;
    if (!scenarioToggle.checked) {
        container.classList.add('hidden');
        return;
    }
    container.classList.remove('hidden'); 

    if (savedScenarios.length === 0) {
        if(tableWrapper) tableWrapper.classList.add('hidden'); 
        if(summaryContainer) summaryContainer.classList.add('hidden');
        if(clearBtn) clearBtn.classList.add('hidden'); 
        if(undoBtn && lastSavedScenarios.length > 0) undoBtn.classList.remove('hidden');
        else if (undoBtn) undoBtn.classList.add('hidden');
        return; 
    }

    if(tableWrapper) tableWrapper.classList.remove('hidden'); 
    if(summaryContainer) summaryContainer.classList.remove('hidden');
    if(clearBtn) clearBtn.classList.remove('hidden');
    if(undoBtn) undoBtn.classList.add('hidden');

    tableBody.innerHTML = '';
    if(summaryContainer) summaryContainer.innerHTML = '';

    const minLCC = Math.min(...savedScenarios.map(s => s.results.hpLcc));

    savedScenarios.forEach((s) => {
        const isBestLCC = s.results.hpLcc === minLCC;
        const row = document.createElement('tr');
        row.className = isBestLCC ? 'bg-green-50' : '';
        
        row.innerHTML = `
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium ${isBestLCC ? 'text-green-900' : 'text-gray-900'}">${s.name}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">${fWan(s.inputs.hpHostCapex + s.inputs.hpStorageCapex)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">${fCop(s.inputs.hpCop)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm ${isBestLCC ? 'font-bold text-green-700' : 'text-gray-700'}">${fWan(s.results.hpLcc)} ${isBestLCC ? ' (LCC最优)' : ''}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-blue-700">${fYears(s.results.hpPbp)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-blue-700">${fPercent(s.results.hpIrr)}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-green-700">${fTon(s.results.hpCarbonReduction)}</td>
            <td><button data-id="${s.id}" class="delete-scenario-btn text-red-500 hover:text-red-700">删除</button></td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * 初始化所有与方案对比相关的UI控件和事件
 */
export function initializeScenarioControls() {
    const clearBtn = document.getElementById('clearScenariosBtn');
    const undoBtn = document.getElementById('undoClearBtn');
    const toggle = document.getElementById('enableScenarioComparison');
    const saveBtn = document.getElementById('saveScenarioBtn');
    const tableContainer = document.getElementById('scenario-comparison-container');

    if (clearBtn) {
        clearBtn.addEventListener('click', attachConfirmation(() => {
            clearScenarios();
            renderScenarioTable();
            showGlobalNotification('方案列表已清空。', 'info');
        }, { title: '确认清空列表', message: '确定要清空所有已暂存的方案吗？' }));
    }

    if (undoBtn) {
        undoBtn.addEventListener('click', () => {
            if (lastSavedScenarios.length === 0) return; 
            savedScenarios = [...lastSavedScenarios];
            lastSavedScenarios = [];
            renderScenarioTable();
            showGlobalNotification('已恢复上次清空的列表。', 'success');
        });
    }

    if (toggle && saveBtn && tableContainer) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                saveBtn.classList.remove('hidden');
                renderScenarioTable();
            } else {
                saveBtn.classList.add('hidden');
                tableContainer.classList.add('hidden');
            }
        });
    }
}