// src/js/main.js (V16.0 - Auto Hide & Fixes)

import '../css/style.css'; 
import * as config from './config.js'; 
import * as storage from './storage-manager.js'; 
import { validateInput, isFormValid } from './ui-validator.js'; 
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
    initializeScenarioComparison, // 确保从 renderer 导入 UI 渲染逻辑
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

let currentStep = 1;
const TOTAL_STEPS = 4;
let resultsCache = null;
let isDirty = true;

function getCurrentInputValues() {
    const values = {};
    config.ALL_INPUT_IDS.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            values[id] = element.type === 'checkbox' || element.type === 'radio' 
                ? element.checked 
                : element.value;
        }
    });
    return values;
}

function resetToDefaults() {
    console.log("正在执行重置...");
    Object.keys(config.defaultParameters).forEach(key => {
        const element = document.getElementById(key);
        const defaultValue = config.defaultParameters[key];
        
        if (element) {
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = defaultValue === true; 
            } else {
                element.value = defaultValue;
            }
            element.dispatchEvent(new Event('change'));
            if(element.type !== 'checkbox' && element.type !== 'radio') {
                 element.dispatchEvent(new Event('input'));
            }
        }
    });
    storage.clearParams();
    // 重置也算一种“改变”，隐藏结果
    markResultsAsStale();
    showGlobalNotification('所有参数已恢复默认值，本地记忆已清除。', 'success');
}

// [核心修改] 参数改变时，直接隐藏结果区域
function markResultsAsStale() {
    isDirty = true;
    // 直接隐藏结果容器
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.classList.add('hidden');
    }
    
    // 禁用保存按钮
    const saveBtn = document.getElementById('saveScenarioBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.classList.add('cursor-not-allowed');
        saveBtn.textContent = '暂存当前方案 (请先重新计算)';
    }
}

function handleNextStep() {
    if (currentStep === 3 && isDirty && resultsCache) {
        // 如果已经隐藏了结果，这里就不需要弹窗提示“结果过时”了，因为用户看不见结果
        // 但保留通知作为友好提示
        // showGlobalNotification('参数已更改，请重新计算。', 'info');
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
            
            // 显示结果容器 (因为之前可能被隐藏了)
            const resultsContainer = document.getElementById('results-container');
            if (resultsContainer) resultsContainer.classList.remove('hidden');

            renderResults(resultsCache, inputs);
            
            isDirty = false;
            
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
        
        // 构造保存的数据快照
        const hpData = resultsCache.hp;
        const hybridData = resultsCache.hybridSystem;
        const activeData = resultsCache.isHybridMode ? hybridData : hpData;

        const scenarioData = {
            id: Date.now(), // 唯一ID
            name: scenarioName,
            mode: resultsCache.isHybridMode ? '混合' : '纯热泵',
            results: {
                capex: activeData.initialInvestment,
                opex: activeData.opex,
                lcc: activeData.lcc.total,
                irr: resultsCache.comparisons[0]?.irr || 0, // 取第一个对比项的IRR作为参考，或者可以存null
                pbp: resultsCache.comparisons[0]?.dynamicPBP || 0,
                co2: activeData.co2
            }
        };
        
        addScenario(scenarioData);
        // 调用 renderer 更新 UI
        updateScenarioComparisonUI(getScenarios(), handleDeleteScenario);
        showGlobalNotification(`方案 "${scenarioName}" 已成功暂存！`, 'success');
    });
}

function handleDeleteScenario(scenarioId) {
    deleteScenario(scenarioId);
    updateScenarioComparisonUI(getScenarios(), handleDeleteScenario);
    showGlobalNotification('方案已删除。', 'info');
}

function main() {
    console.log('Phoenix Project V16.0 Initializing...');
    
    initializeAllUI(markResultsAsStale, showGlobalNotification);
    initializeWizard(handleNextStep, handlePrevStep);

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
                element.dispatchEvent(new Event('change'));
            }
        });
    }

    config.ALL_INPUT_IDS.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                if (element.type !== 'checkbox' && element.type !== 'radio') validateInput(element);
                const currentValues = getCurrentInputValues();
                storage.saveParams(currentValues);
            });
            if (element.type === 'checkbox' || element.type === 'radio') {
                element.addEventListener('change', () => {
                     const currentValues = getCurrentInputValues();
                     storage.saveParams(currentValues);
                });
            }
        }
    });

    const resetBtn = document.getElementById('btn-reset-params'); 
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefaults);
    }

    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculate);
    }
    
    initializeModal();
    setupScenarioSaving();
    
    // 初始化多方案对比 (传递清空的回调)
    initializeScenarioComparison(
        attachConfirmation(
            () => {
                clearScenarios();
                updateScenarioComparisonUI(getScenarios(), handleDeleteScenario);
                showGlobalNotification('所有暂存方案已清空。', 'success');
            }, 
            { title: '确认清空所有方案', message: '此操作将永久删除所有已暂存的对比方案，且无法恢复。' }
        )
    );
    // 初始加载已存方案
    updateScenarioComparisonUI(getScenarios(), handleDeleteScenario);

    updateWizardUI(currentStep, TOTAL_STEPS);
    
    // 初始隐藏结果
    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) resultsContainer.classList.add('hidden');

    console.log('Application Ready.');
}

document.addEventListener('DOMContentLoaded', main);