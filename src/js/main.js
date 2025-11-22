// src/js/main.js (V15.6 - Final Memory UI Sync Fix)

import '../css/style.css'; // 确保 CSS 被引入
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
            // 触发 change 以恢复 UI 状态（如取消置灰）
            element.dispatchEvent(new Event('change'));
            if(element.type !== 'checkbox' && element.type !== 'radio') {
                 element.dispatchEvent(new Event('input'));
            }
        }
    });
    storage.clearParams();
    isDirty = true;
    clearResults();
    showGlobalNotification('所有参数已恢复默认值，本地记忆已清除。', 'success');
}

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
            // 传入 inputs 以便图表模块使用
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
        const inputs = readAllInputs(() => {}, () => {});
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

function main() {
    console.log('Phoenix Project V15.6 Initializing...');
    
    initializeAllUI(markResultsAsStale, showGlobalNotification);
    initializeWizard(handleNextStep, handlePrevStep);

    // --- [关键修复] 加载记忆并同步 UI 状态 ---
    const savedParams = storage.loadParams();
    if (savedParams) {
        console.log("发现已保存的参数，正在加载...");
        Object.keys(savedParams).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // 1. 恢复值
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = savedParams[id];
                } else {
                    element.value = savedParams[id];
                }
                
                // 2. [新增] 立即触发 change 事件，让 UI (置灰等) 同步状态
                // 这一步非常关键，否则刷新后虽然没勾选，但界面还是亮色的
                element.dispatchEvent(new Event('change'));
            }
        });
    } else {
        console.log("未发现保存的数据，使用默认值。");
    }

    // 绑定实时保存
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

    updateWizardUI(currentStep, TOTAL_STEPS);
    clearResults();
    console.log('Application Ready.');
}

document.addEventListener('DOMContentLoaded', main);