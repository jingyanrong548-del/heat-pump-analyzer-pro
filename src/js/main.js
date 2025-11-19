import '../css/style.css';
// src/js/main.js

// --- 模块导入 ---
import * as config from './config.js'; // 导入所有配置，包括 ALL_INPUT_IDS
import * as storage from './storage-manager.js'; // [新增] 导入存储管理器
import { validateInput, isFormValid } from './ui-validator.js'; // 导入验证器
import { 
    initializeAllUI, 
    initializeWizard, 
    updateWizardUI, 
    readAllInputs 
} from './ui/ui-setup.js';
import { 
    renderResults, 
    clearResults, 
    renderError, 
    showStaleNotice,
    initializeScenarioComparison,
    updateScenarioComparisonUI 
} from './ui/ui-renderer.js';
import { calculate } from './core/core-calculator.js';
import { 
    showGlobalNotification, 
    initializeModal,
    addScenario,
    getScenarios,
    deleteScenario,
    clearScenarios,
    attachConfirmation
} from './ui/ui-scenario.js';

// --- 应用程序状态管理 ---
let currentStep = 1;
const TOTAL_STEPS = 4;
let resultsCache = null;
let isDirty = true;

// --- [新增] 辅助函数：获取当前UI所有值 ---
function getCurrentInputValues() {
    const values = {};
    // 使用 config.js 中新生成的 ID 列表
    config.ALL_INPUT_IDS.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // 如果是 checkbox，保存 checked 状态；否则保存 value
            values[id] = element.type === 'checkbox' || element.type === 'radio' 
                ? element.checked 
                : element.value;
        }
    });
    return values;
}

// --- [新增] 核心功能：恢复默认参数 ---
function resetToDefaults() {
    console.log("正在执行重置...");
    
    // 1. 遍历默认参数并应用到界面
    Object.keys(config.defaultParameters).forEach(key => {
        const element = document.getElementById(key);
        const defaultValue = config.defaultParameters[key];
        
        if (element) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = defaultValue === true; // 确保它是布尔值
            } else {
                element.value = defaultValue;
                // 重置后触发一次验证，消除之前的红色报错
                validateInput(element); 
            }
        }
    });

    // 2. 清除本地存储中的“记忆”
    storage.clearParams();
    
    // 3. 标记状态
    isDirty = true;
    clearResults();
    showGlobalNotification('所有参数已恢复默认值，本地记忆已清除。', 'success');
}

// --- 现有逻辑保持不变 ---
function markResultsAsStale() {
    if (resultsCache) {
        isDirty = true;
        showStaleNotice(true);
        const saveBtn = document.getElementById('saveScenarioBtn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.classList.add('cursor-not-allowed');
            saveBtn.textContent = '暂存当前方案 (请先重新计算)';
        }
    }
}

function handleNextStep() {
    if (currentStep === 3 && isDirty && resultsCache) {
        showGlobalNotification('参数已更改，建议重新计算以获得最新结果。', 'info');
    }
    if (currentStep < TOTAL_STEPS) {
        currentStep++;
        updateWizardUI(currentStep, TOTAL_STEPS);
    }
}

function handlePrevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateWizardUI(currentStep, TOTAL_STEPS);
    }
}

function handleCalculate() {
    if (!isFormValid()) {
        showGlobalNotification('存在无效的输入参数，请检查红色提示框并修正。', 'error');
        return;
    }
    
    const inputs = readAllInputs(
        (errorMsg) => renderError(errorMsg, 'results-content'), 
        (msg, type) => showGlobalNotification(msg, type)
    );

    if (inputs) {
        try {
            console.log("Starting calculation with inputs:", inputs);
            resultsCache = calculate(inputs);
            renderResults(resultsCache, inputs);
            isDirty = false;
            showStaleNotice(false);
            const saveBtn = document.getElementById('saveScenarioBtn');
            if (saveBtn && document.getElementById('enableScenarioComparison').checked) {
                saveBtn.disabled = false;
                saveBtn.classList.remove('cursor-not-allowed');
                saveBtn.textContent = '暂存当前工业热泵方案';
            }
            showGlobalNotification('计算成功！结果已更新。', 'success');
        } catch (error) {
            console.error("Calculation failed:", error);
            renderError(`计算时发生意外错误: ${error.message}`, 'results-content');
            showGlobalNotification('计算失败，请检查控制台获取详细信息。', 'error');
            resultsCache = null;
        }
    }
}

function setupScenarioSaving() {
    const saveBtn = document.getElementById('saveScenarioBtn');
    const enableToggle = document.getElementById('enableScenarioComparison');
    if (!saveBtn || !enableToggle) return;

    enableToggle.addEventListener('change', () => {
        const isEnabled = enableToggle.checked;
        saveBtn.classList.toggle('hidden', !isEnabled);
        document.getElementById('scenario-comparison-container').classList.toggle('hidden', !isEnabled);
        if (isEnabled && !isDirty && resultsCache) {
            saveBtn.disabled = false;
            saveBtn.classList.remove('cursor-not-allowed');
            saveBtn.textContent = '暂存当前工业热泵方案';
        } else {
            saveBtn.disabled = true;
            saveBtn.classList.add('cursor-not-allowed');
        }
    });

    saveBtn.addEventListener('click', () => {
        if (!resultsCache || isDirty) {
            showGlobalNotification('请先成功计算，再暂存方案。', 'error');
            return;
        }
        const projectName = document.getElementById('projectName').value || '未命名方案';
        const scenarioName = `${projectName} #${getScenarios().length + 1}`;
        
        const inputs = readAllInputs(() => {}, () => {}); // 获取输入用于保存

        const scenarioData = {
            name: scenarioName,
            inputs: inputs,
            results: {
                hpLcc: resultsCache.solutions.find(s => s.type === 'hp').totalLcc,
                hpAnnualCost: resultsCache.solutions.find(s => s.type === 'hp').avgAnnualCost,
                hpPbp: resultsCache.solutions.find(s => s.type === 'hp').pbp,
                hpIrr: resultsCache.solutions.find(s => s.type === 'hp').irr,
                hpCarbonReduction: resultsCache.solutions.find(s => s.type === 'hp').annualCarbonReduction,
            }
        };

        addScenario(scenarioData);
        updateScenarioComparisonUI(getScenarios(), handleDeleteScenario);
        showGlobalNotification(`方案 "${scenarioName}" 已成功暂存！`, 'success');
    });
}

function handleDeleteScenario(scenarioId) {
    deleteScenario(scenarioId);
    updateScenarioComparisonUI(getScenarios(), handleDeleteScenario);
    showGlobalNotification('方案已删除。', 'info');
}

// --- 应用程序主入口 ---
function main() {
    console.log('Phoenix Project V15.3 Initializing (With Memory)...');
    
    // 1. 初始化 UI
    initializeAllUI(markResultsAsStale, showGlobalNotification);
    initializeWizard(handleNextStep, handlePrevStep);

    // 2. [新增] 尝试从 localStorage 加载数据
    const savedParams = storage.loadParams();
    if (savedParams) {
        console.log("发现已保存的参数，正在加载...");
        Object.keys(savedParams).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = savedParams[id];
                } else {
                    element.value = savedParams[id];
                }
            }
        });
        // 加载完数据后，建议触发一次验证，确保UI状态正确
        // config.ALL_INPUT_IDS.forEach(id => {
        //     const el = document.getElementById(id);
        //     if(el && el.type !== 'checkbox' && el.type !== 'radio') validateInput(el);
        // });
    } else {
        console.log("未发现保存的数据，使用默认值。");
    }

    // 3. [新增] 为所有输入框绑定“实时保存”事件
    config.ALL_INPUT_IDS.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                // 验证输入
                if (element.type !== 'checkbox' && element.type !== 'radio') {
                    validateInput(element);
                }
                // 保存当前状态
                const currentValues = getCurrentInputValues();
                storage.saveParams(currentValues);
            });
            // 对于 checkbox/radio，使用 change 事件更准确
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.addEventListener('change', () => {
                     const currentValues = getCurrentInputValues();
                     storage.saveParams(currentValues);
                });
            }
        }
    });

    // 4. [修正] 绑定“恢复默认”按钮逻辑
    // 注意：这里我们需要使用 HTML 中实际定义的 ID: 'btn-reset-params'
    const resetBtn = document.getElementById('btn-reset-params'); 
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefaults);
        console.log("重置按钮已成功绑定！"); // 添加这行日志以便调试
    } else {
        console.error("错误: 无法找到 ID 为 'btn-reset-params' 的按钮，请检查 HTML。");
    }

    // 5. 绑定计算按钮
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculate);
    }
    
    // 6. 初始化其他模块
    initializeModal();
    setupScenarioSaving();
    initializeScenarioComparison(
        attachConfirmation(
            () => {
                clearScenarios();
                updateScenarioComparisonUI(getScenarios(), handleDeleteScenario);
                showGlobalNotification('所有暂存方案已清空。', 'success');
            }, 
            {
                title: '确认清空所有方案',
                message: '此操作将永久删除所有已暂存的对比方案，且无法恢复。您确定要继续吗？'
            }
        )
    );

    updateWizardUI(currentStep, TOTAL_STEPS);
    clearResults();

    console.log('Application Ready.');
}

document.addEventListener('DOMContentLoaded', main);