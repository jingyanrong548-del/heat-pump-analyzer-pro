// main.js (FIXED VERSION)
import '../css/style.css';
import { initializeInputSetup, readAllInputs } from './ui/ui-setup.js';
import { initializeScenarioControls, saveHpScenario } from './ui/ui-scenario.js';
import * as uiRenderer from './ui/ui-renderer.js';
import { runAnalysis } from './core/core-calculator.js';

// --- 核心状态 ---
let detailedCalculations = {}; 
let resultsAreShown = false;
let resultsAreStale = false;

function markResultsAsStale() {
    if (resultsAreShown) {
        resultsAreStale = true;
        uiRenderer.setStaleDisplay(true);
        uiRenderer.setSaveButtonState('disabled', '暂存当前工业热泵方案 (请先计算)');
    }
}

function onCalculateClick() {
    uiRenderer.setStaleDisplay(false);
    const inputs = readAllInputs(
        uiRenderer.showPriceTierError, 
        uiRenderer.showGlobalNotification
    );
    if (!inputs) {
        return;
    }

    const results = runAnalysis(inputs);
    
    detailedCalculations = results;
    resultsAreShown = true;
    resultsAreStale = false;

    uiRenderer.showResults(true);
    uiRenderer.renderResults(results);

    // Use a timeout to ensure the DOM is updated before binding buttons
    setTimeout(() => {
        bindPostCalculationButtons(results);
    }, 0);
    
    if (results.analysisMode !== 'bot') {
        uiRenderer.setSaveButtonState('enabled');
    } else {
        uiRenderer.setSaveButtonState('disabled', 'BOT 模式不支持暂存');
    }
}

function bindPostCalculationButtons(results) {
    const { inputs, comparisons, isHybridMode, analysisMode } = results; 
    const hpSystemDetails = (analysisMode === 'bot') ? results.hp : (isHybridMode ? results.hybridSystem : results.hp);

    const setupButtonListener = (buttonId, callback) => {
        const button = document.getElementById(buttonId);
        if (button) {
            // Clone and replace to remove old listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.addEventListener('click', callback);
        } else {
            console.warn(`Button with id '${buttonId}' not found after calculation.`);
        }
    };

    setupButtonListener('toggle-details-btn', (e) => {
        const details = document.getElementById('calculation-details');
        if (!details) return;
        const isVisible = !details.classList.contains('hidden');
        details.classList.toggle('hidden');
        e.target.textContent = !isVisible ? '隐藏详细计算过程 (含公式)' : '显示详细计算过程 (含公式)';
        if (!isVisible) uiRenderer.populateCalculationDetails(detailedCalculations);
    });

    setupButtonListener('toggle-risk-btn', (e) => {
        const details = document.getElementById('risk-analysis-details');
        if (!details) return;
        const isVisible = !details.classList.contains('hidden');
        details.classList.toggle('hidden');
        e.target.textContent = !isVisible ? '隐藏投资风险及对策分析' : '显示投资风险及对策分析';
        if (!isVisible) uiRenderer.populateRiskAnalysisDetails(analysisMode);
    });

    setupButtonListener('printReportBtn', () => {
        uiRenderer.buildPrintReport(detailedCalculations);
        window.print();
    });

    setupButtonListener('saveScenarioBtn', () => {
        const projectName = inputs.projectName || '未命名方案';
        const hpCop = inputs.hpCop;
        
        if (analysisMode === 'bot') {
            uiRenderer.showGlobalNotification('BOT 模式的方案暂存功能正在开发中', 'info');
            return;
        }

        if (hpSystemDetails && comparisons && comparisons.length > 0) {
            const baselineComparison = comparisons.find(c => c.key === 'gas') || comparisons[0];
            saveHpScenario(projectName, hpSystemDetails, hpCop, baselineComparison);
            uiRenderer.setSaveButtonState('saved');
        } else if (hpSystemDetails && (!comparisons || comparisons.length === 0)) {
             uiRenderer.showGlobalNotification('无法暂存，因为没有勾选任何对比方案。', 'error');
        } else {
            uiRenderer.showGlobalNotification('无法暂存，计算数据不存在。', 'error');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeInputSetup(
        markResultsAsStale,
        uiRenderer.showGlobalNotification 
    );
    
    initializeScenarioControls(
        uiRenderer.showConfirmModal,
        uiRenderer.showGlobalNotification
    );
    
    // --- FIX START ---
    // Added a null check for the main calculate button.
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', onCalculateClick);
    } else {
        console.error("FATAL: Main 'calculateBtn' not found. Application cannot start.");
        // Optionally, display an error message to the user on the page itself.
        const appContainer = document.querySelector('.container');
        if (appContainer) {
            appContainer.innerHTML = '<div class="text-center p-8 bg-red-100 text-red-700 rounded-lg"><strong>严重错误:</strong> 无法找到核心计算按钮。页面无法正常工作。</div>';
        }
    }
    // --- FIX END ---
    
    uiRenderer.initializeModalControls();
});