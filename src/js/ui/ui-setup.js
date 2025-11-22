// src/js/ui/ui-setup.js (V15.9.2 - ROBUST INPUT READING)

import { fuelData, converters, defaultParameters } from '../config.js'; 
import { validateInput, clearAllErrors } from '../ui-validator.js';

// --- 模块内部状态 ---
let spfStandardValue = "3.0"; 
let spfHybridValue = "4.0";   
let spfBotValue = "3.5";      
let currentMode = 'standard'; 

// --- Wizard UI 元素引用 ---
let stepperItems = [];
let panes = [];
let prevStepBtn, nextStepBtn, calculateBtn, resetBtn;

export function updateWizardUI(currentStep, totalSteps) {
    panes.forEach((pane, index) => {
        pane.classList.toggle('hidden', (index + 1) !== currentStep);
    });

    stepperItems.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('step-active', 'step-completed');
        if (stepNumber < currentStep) {
            step.classList.add('step-completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('step-active');
        }
    });

    if (prevStepBtn) {
        prevStepBtn.disabled = currentStep === 1;
        prevStepBtn.classList.toggle('cursor-not-allowed', currentStep === 1);
        prevStepBtn.classList.toggle('opacity-50', currentStep === 1);
    }
    
    if (nextStepBtn) {
        nextStepBtn.classList.toggle('hidden', currentStep === totalSteps);
    }
    
    if (calculateBtn) {
        calculateBtn.classList.toggle('hidden', currentStep !== totalSteps);
    }

    if (resetBtn) {
        resetBtn.classList.toggle('hidden', currentStep > 3);
    }
}

export function initializeWizard(onNext, onPrev) {
    stepperItems = Array.from(document.querySelectorAll('.stepper .step'));
    panes = Array.from(document.querySelectorAll('.wizard-pane'));
    prevStepBtn = document.getElementById('prevStepBtn');
    nextStepBtn = document.getElementById('nextStepBtn');
    calculateBtn = document.getElementById('calculateBtn');
    resetBtn = document.getElementById('btn-reset-params');

    if (!prevStepBtn || !nextStepBtn || stepperItems.length === 0 || panes.length === 0) {
        console.error("Wizard UI elements not found.");
        return;
    }

    nextStepBtn.addEventListener('click', onNext);
    prevStepBtn.addEventListener('click', onPrev);
}

function setupUnitConverters() {
    converters.forEach(c => {
        const select = document.getElementById(c.selectId);
        const input = document.getElementById(c.inputId);
        if (!select || !input) return;

        select.addEventListener('change', () => {
            const conversions = c.dynamicConversions ? c.dynamicConversions() : c.conversions;
            if (input.dataset.baseValue === undefined) {
                input.dataset.baseValue = input.value;
            }
            const baseValue = parseFloat(input.dataset.baseValue);
            const targetUnit = select.value;

            if (baseValue === 0) {
                input.value = 0;
                return;
            }

            const conversionFactor = conversions[targetUnit];
             if (conversionFactor === undefined || conversionFactor === null) {
                 return;
             }

            let precision = 3;
            if (targetUnit.includes('/t') && (c.inputId.includes('Calorific'))) precision = 1;
            if (targetUnit.includes('/kg') && (c.inputId.includes('Calorific'))) precision = 3;
            if (targetUnit.includes('GJ/')) precision = 5;
            if (targetUnit.includes('kcal/kg')) precision = 0;
            if (targetUnit.includes('kcal/m3')) precision = 0;
            if (targetUnit.includes('kcal/h')) precision = 0;

            input.value = (baseValue * conversionFactor).toFixed(precision);
        });
    });
}

function setupComparisonToggles() {
    const toggles = document.querySelectorAll('.comparison-toggle');
    
    const updateRelatedElementStyles = (toggle) => {
        const target = toggle.dataset.target; 
        if (!target) return;
        
        const isChecked = toggle.checked;
        const relatedContainers = document.querySelectorAll(`.related-to-${target}`);
        
        relatedContainers.forEach(container => {
            container.classList.toggle('comparison-inactive', !isChecked);
            const inputs = container.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (!input.classList.contains('comparison-toggle')) {
                    input.disabled = !isChecked;
                }
            });
        });
    };

    toggles.forEach(toggle => {
        updateRelatedElementStyles(toggle);
        toggle.addEventListener('change', () => updateRelatedElementStyles(toggle));
    });
}

function setupModeSelector(markResultsAsStale, showGlobalNotification) {
    const modeStandard = document.getElementById('modeStandard');
    const modeHybrid = document.getElementById('modeHybrid');
    const modeBot = document.getElementById('modeBot');
    const hybridConfigInputs = document.getElementById('hybridConfigInputs'); 
    const botConfigInputs = document.getElementById('botConfigInputs');
    const comparisonTogglesContainer = document.getElementById('comparisonTogglesContainer');
    const standardModeSections = document.getElementById('standardModeSections'); 
    const lccParamsContainer = document.getElementById('lccParamsContainer');
    const hpCopLabel = document.getElementById('hpCopLabel');
    const hpCopInput = document.getElementById('hpCop'); 
    const section2Title = document.getElementById('section2Title');
    const section7Title = document.getElementById('section7Title');
    const calcModeAContainer = document.getElementById('calcModeAContainer');
    const calcModeBContainer = document.getElementById('calcModeBContainer');
    const calcModeCContainer = document.getElementById('calcModeCContainer');
    const calcModeRadios = document.querySelectorAll('input[name="calcMode"]');

    if (!modeStandard) return;

    const applyModeState = (newMode) => {
        const currentValue = hpCopInput.value;
        if (currentMode === 'standard') spfStandardValue = currentValue;
        else if (currentMode === 'hybrid') spfHybridValue = currentValue;
        else if (currentMode === 'bot') spfBotValue = currentValue;

        if (newMode === 'standard' || newMode === 'hybrid') {
            hybridConfigInputs.classList.toggle('hidden', newMode === 'standard');
            botConfigInputs.classList.add('hidden');
            comparisonTogglesContainer.classList.remove('hidden');
            standardModeSections.classList.remove('hidden'); 
            lccParamsContainer.classList.remove('hidden'); 
            calcModeRadios.forEach(radio => radio.disabled = false);
            const checkedCalcMode = document.querySelector('input[name="calcMode"]:checked');
            if (checkedCalcMode) checkedCalcMode.dispatchEvent(new Event('change'));

            if (newMode === 'standard') {
                hpCopLabel.textContent = '全年综合性能系数 (SPF)';
                hpCopInput.value = spfStandardValue;
            } else {
                hpCopLabel.textContent = '工业热泵在此工况下的 SPF';
                hpCopInput.value = spfHybridValue;
            }
            section2Title.textContent = "2. 方案配置";
            section7Title.textContent = "7. 财务分析参数";
            
        } else if (newMode === 'bot') {
            hybridConfigInputs.classList.add('hidden');
            botConfigInputs.classList.remove('hidden');
            comparisonTogglesContainer.classList.add('hidden');
            standardModeSections.classList.add('hidden'); 
            lccParamsContainer.classList.remove('hidden'); 
            if (calcModeAContainer) calcModeAContainer.classList.add('hidden');
            if (calcModeBContainer) calcModeBContainer.classList.add('hidden');
            if (calcModeCContainer) calcModeCContainer.classList.add('hidden');
            calcModeRadios.forEach(radio => radio.disabled = true);
            hpCopLabel.textContent = 'BOT 项目 SPF (用于计算电费成本)';
            hpCopInput.value = spfBotValue;
            section2Title.textContent = "2. 方案与投资配置";
            section7Title.textContent = "7. BOT 财务分析参数";
        }
        
        currentMode = newMode;
        const defaultValue = (newMode === 'standard') ? "3.0" : (newMode === 'hybrid' ? "4.0" : "3.5");
        hpCopInput.classList.toggle('default-param', hpCopInput.value === defaultValue);
        markResultsAsStale();
    };

    modeStandard.addEventListener('change', () => { if (modeStandard.checked) applyModeState('standard'); });
    modeHybrid.addEventListener('change', () => { if (modeHybrid.checked) applyModeState('hybrid'); });
    modeBot.addEventListener('change', () => {
        if (modeBot.checked) {
            if (showGlobalNotification) showGlobalNotification('模式三 (BOT 模式) 正在升级中，暂不开放。', 'info', 4000);
            if (currentMode === 'standard') modeStandard.checked = true;
            else if (currentMode === 'hybrid') modeHybrid.checked = true;
            else modeStandard.checked = true;
        }
    });
    // 初始化时确保有默认选中
    if (!modeStandard.checked && !modeHybrid.checked && !modeBot.checked) {
        modeStandard.checked = true;
    }
    hpCopInput.value = spfStandardValue; 
    applyModeState(document.querySelector('input[name="schemeAMode"]:checked').value);
}

function setupCalculationModeToggle(markResultsAsStale) {
    const calcModeRadios = document.querySelectorAll('input[name="calcMode"]');
    const modeAContainer = document.getElementById('calcModeAContainer');
    const modeBContainer = document.getElementById('calcModeBContainer');
    const modeCContainer = document.getElementById('calcModeCContainer');
    const operatingHoursContainer = document.getElementById('operatingHours')?.parentElement;

    if (!modeAContainer) return;

    const applyCalcMode = () => {
        const selectedRadio = document.querySelector('input[name="calcMode"]:checked');
        if (!selectedRadio) return; 
        const selectedMode = selectedRadio.value;
        
        if (selectedMode === 'annual') {
            modeAContainer.classList.remove('hidden');
            modeBContainer.classList.add('hidden');
            modeCContainer.classList.add('hidden');
            operatingHoursContainer.classList.remove('hidden');
        } else if (selectedMode === 'total') {
            modeAContainer.classList.add('hidden');
            modeBContainer.classList.remove('hidden');
            modeCContainer.classList.add('hidden');
        } else if (selectedMode === 'daily') {
            modeAContainer.classList.remove('hidden');
            modeBContainer.classList.add('hidden');
            modeCContainer.classList.remove('hidden');
            operatingHoursContainer.classList.add('hidden');
        }
        markResultsAsStale();
    };
    calcModeRadios.forEach(radio => radio.addEventListener('change', applyCalcMode));
    applyCalcMode();
}

function addNewPriceTier(name = "", price = "", dist = "", markResultsAsStale, showGlobalNotification) {
    const container = document.getElementById('priceTiersContainer');
    if (!container) return;
    
    const tierId = `tier-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTier = document.createElement('div');
    newTier.className = 'price-tier-entry grid grid-cols-1 md:grid-cols-10 gap-2 items-center';
    newTier.id = tierId;

    newTier.innerHTML = `
        <div class="md:col-span-3">
            <label class="block text-xs font-medium text-gray-600 mb-1">时段名称</label>
            <input type="text" value="${name}" placeholder="例如: 峰时" class="tier-name w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm track-change">
        </div>
        <div class="md:col-span-3">
            <label class="block text-xs font-medium text-gray-600 mb-1">电价 (元/kWh)</label>
            <input type="number" value="${price}" placeholder="例如: 1.2" class="tier-price w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm track-change" data-validation="isPositive">
            <div class="error-message hidden"></div>
        </div>
        <div class="md:col-span-3">
            <label class="block text-xs font-medium text-gray-600 mb-1">运行比例 (%)</label>
            <input type="number" value="${dist}" placeholder="例如: 40" class="tier-dist w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm track-change" data-validation="isPercentage">
            <div class="error-message hidden"></div>
        </div>
        <div class="md:col-span-1 flex items-end h-full">
            <button class="removePriceTierBtn w-full text-sm bg-red-100 text-red-700 font-semibold py-2 px-3 rounded-lg hover:bg-red-200 mt-5 md:mt-0">删除</button>
        </div>
    `;
    container.appendChild(newTier);
    
    newTier.querySelectorAll('[data-validation]').forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input)); 
    });
    
    newTier.querySelectorAll('input.track-change').forEach(input => {
        input.addEventListener('input', () => markResultsAsStale());
    });

    newTier.querySelector('.removePriceTierBtn').addEventListener('click', () => {
        if (document.querySelectorAll('.price-tier-entry').length > 1) {
            newTier.remove();
            markResultsAsStale(); 
        } else {
            if(showGlobalNotification) showGlobalNotification('必须至少保留一个电价时段。', 'error');
            else alert('必须至少保留一个电价时段。');
        }
    });
}

function setupPriceTierControls(markResultsAsStale, showGlobalNotification) {
    const addBtn = document.getElementById('addPriceTierBtn');
    if (!addBtn) return;
    
    addBtn.addEventListener('click', () => {
        addNewPriceTier("", "", "", markResultsAsStale, showGlobalNotification);
        markResultsAsStale();
    });
    addNewPriceTier("平均电价", "0.7", "100", markResultsAsStale, showGlobalNotification);
}

function setupGreenElectricityToggle() {
    const toggle = document.getElementById('greenElectricityToggle');
    const gridFactorInput = document.getElementById('gridFactor');
    const gridFactorUnit = document.getElementById('gridFactorUnit');
    if (!toggle || !gridFactorInput || !gridFactorUnit) return;

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            gridFactorInput.value = '0';
            gridFactorInput.disabled = true;
            gridFactorUnit.disabled = true;
        } else {
            gridFactorInput.value = gridFactorInput.dataset.baseValue || "0.57";
            gridFactorInput.disabled = false;
            gridFactorUnit.disabled = false;
        }
    });
}

function setupFuelTypeSelector() {
    const fuelTypeSelect = document.getElementById('fuelType');
    if (!fuelTypeSelect) return;
    const priceInput = document.getElementById('fuelPrice');
    const calorificInput = document.getElementById('fuelCalorific');
    const factorInput = document.getElementById('fuelFactor');
    const calorificUnitSelect = document.getElementById('fuelCalorificUnit');
    const factorUnitSelect = document.getElementById('fuelFactorUnit');

    fuelTypeSelect.addEventListener('change', (e) => {
        const selectedFuel = e.target.value;
        const data = fuelData[selectedFuel];
        if (!data) return;
        priceInput.value = data.price;
        calorificInput.value = data.calorific;
        factorInput.value = data.factor;
        
        calorificUnitSelect.value = 'MJ/kg'; 
        factorUnitSelect.value = 'kgCO2/t'; 
        
        // Trigger changes to update base values
        calorificUnitSelect.dispatchEvent(new Event('change'));
        factorUnitSelect.dispatchEvent(new Event('change'));
        priceInput.dispatchEvent(new Event('input'));
    });
}

// 主 UI 初始化
export function initializeAllUI(markResultsAsStale, showGlobalNotification) {
    setupUnitConverters();
    setupComparisonToggles();
    setupGreenElectricityToggle();
    setupFuelTypeSelector();
    setupPriceTierControls(markResultsAsStale, showGlobalNotification); 
    setupModeSelector(markResultsAsStale, showGlobalNotification);
    setupCalculationModeToggle(markResultsAsStale);

    const inputsToValidate = document.querySelectorAll('[data-validation]');
    inputsToValidate.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        input.addEventListener('blur', () => validateInput(input));
    });
    
    // 通用 change 监听
    document.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', () => {
            if (input.classList.contains('track-change')) markResultsAsStale();
        });
         input.addEventListener('input', () => {
            if (input.classList.contains('track-change')) markResultsAsStale();
        });
    });
}

export function readAllInputs(showErrorCallback, alertNotifier) {
    const priceTiers = [];
    let totalDist = 0;
    document.querySelectorAll('.price-tier-entry').forEach(tierEl => {
        const name = tierEl.querySelector('.tier-name').value.trim() || '时段';
        const price = parseFloat(tierEl.querySelector('.tier-price').value) || 0;
        const dist = parseFloat(tierEl.querySelector('.tier-dist').value) || 0;
        totalDist += dist;
        priceTiers.push({ name, price, dist });
    });

    // [关键修复] 获取 schemeAMode 时增加防御性检查
    const modeRadio = document.querySelector('input[name="schemeAMode"]:checked');
    // 如果获取不到，说明出现异常，默认回退到 'standard'
    const analysisMode = modeRadio ? modeRadio.value : 'standard';

    if (analysisMode !== 'bot') {
        if (Math.abs(totalDist - 100) > 0.1) {
            showErrorCallback(`电价时段总比例必须为 100%，当前为 ${totalDist.toFixed(1)}%！`);
            return null;
        }
    }
    showErrorCallback(null);

    // 获取 calcMode
    const calcModeRadio = document.querySelector('input[name="calcMode"]:checked');
    const calcMode = calcModeRadio ? calcModeRadio.value : 'annual';

    const heatingLoad = parseFloat(document.getElementById('heatingLoad').dataset.baseValue) || 0;
    const operatingHours = parseFloat(document.getElementById('operatingHours').value) || 0;
    const annualHeating = parseFloat(document.getElementById('annualHeating').dataset.baseValue) || 0;
    const dailyHours = parseFloat(document.getElementById('dailyHours').value) || 0;
    const annualDays = parseFloat(document.getElementById('annualDays').value) || 0;
    const loadFactor = (parseFloat(document.getElementById('loadFactor').value) || 0) / 100;

    let annualHeatingDemandKWh = 0;
    if (calcMode === 'annual') annualHeatingDemandKWh = heatingLoad * operatingHours;
    else if (calcMode === 'total') annualHeatingDemandKWh = annualHeating;
    else if (calcMode === 'daily') annualHeatingDemandKWh = heatingLoad * dailyHours * annualDays * loadFactor;

    const getValue = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const getBaseValue = (id) => parseFloat(document.getElementById(id)?.dataset.baseValue) || 0;

    const inputs = {
        analysisMode,
        isHybridMode: analysisMode === 'hybrid',
        lccYears: parseInt(document.getElementById('lccYears').value) || 15,
        discountRate: getValue('discountRate') / 100,
        energyInflationRate: getValue('energyInflationRate') / 100,
        opexInflationRate: getValue('opexInflationRate') / 100,
        isGreenElectricity: document.getElementById('greenElectricityToggle').checked,
        priceTiers,
        projectName: document.getElementById('projectName').value, 
        heatingLoad, operatingHours, annualHeating, dailyHours, annualDays, loadFactor,
        annualHeatingDemandKWh,
        hpHostCapex: getValue('hpCapex') * 10000,
        hpStorageCapex: getValue('storageCapex') * 10000,
        hpSalvageRate: getValue('hpSalvageRate') / 100,
        gasBoilerCapex: getValue('gasBoilerCapex') * 10000,
        gasSalvageRate: getValue('gasSalvageRate') / 100,
        fuelBoilerCapex: getValue('fuelBoilerCapex') * 10000,
        fuelSalvageRate: getValue('fuelSalvageRate') / 100,
        coalBoilerCapex: getValue('coalBoilerCapex') * 10000,
        coalSalvageRate: getValue('coalSalvageRate') / 100,
        biomassBoilerCapex: getValue('biomassBoilerCapex') * 10000,
        biomassSalvageRate: getValue('biomassSalvageRate') / 100,
        electricBoilerCapex: getValue('electricBoilerCapex') * 10000,
        electricSalvageRate: getValue('electricSalvageRate') / 100,
        steamCapex: getValue('steamCapex') * 10000,
        steamSalvageRate: getValue('steamSalvageRate') / 100,
        hpCop: getValue('hpCop'),
        gasBoilerEfficiency: getValue('gasBoilerEfficiency') / 100,
        fuelBoilerEfficiency: getValue('fuelBoilerEfficiency') / 100,
        coalBoilerEfficiency: getValue('coalBoilerEfficiency') / 100,
        biomassBoilerEfficiency: getValue('biomassBoilerEfficiency') / 100,
        electricBoilerEfficiency: getValue('electricBoilerEfficiency') / 100,
        steamEfficiency: getValue('steamEfficiency') / 100,
        gasPrice: getValue('gasPrice'),
        fuelPrice: getValue('fuelPrice'),
        coalPrice: getValue('coalPrice'),
        biomassPrice: getValue('biomassPrice'),
        steamPrice: getValue('steamPrice'),
        gridFactor: document.getElementById('greenElectricityToggle').checked ? 0 : getBaseValue('gridFactor'),
        gasFactor: getBaseValue('gasFactor'),
        fuelFactor: getBaseValue('fuelFactor'),
        coalFactor: getBaseValue('coalFactor'),
        biomassFactor: getBaseValue('biomassFactor'), 
        steamFactor: getBaseValue('steamFactor'),
        gasCalorific: getBaseValue('gasCalorific'),
        fuelCalorific: getBaseValue('fuelCalorific'),
        coalCalorific: getBaseValue('coalCalorific'),
        biomassCalorific: getBaseValue('biomassCalorific'),
        steamCalorific: getBaseValue('steamCalorific'),
        hpOpexCost: getValue('hpOpexCost') * 10000,
        gasOpexCost: getValue('gasOpexCost') * 10000,
        fuelOpexCost: getValue('fuelOpexCost') * 10000,
        coalOpexCost: getValue('coalOpexCost') * 10000,
        biomassOpexCost: getValue('biomassOpexCost') * 10000,
        electricOpexCost: getValue('electricOpexCost') * 10000,
        steamOpexCost: getValue('steamOpexCost') * 10000,
        hybridLoadShare: getValue('hybridLoadShare') / 100,
        hybridAuxHeaterType: document.getElementById('hybridAuxHeaterType').value,
        hybridAuxHeaterCapex: getValue('hybridAuxHeaterCapex') * 10000,
        hybridAuxHeaterOpex: getValue('hybridAuxHeaterOpex') * 10000,
        botAnnualRevenue: getValue('botAnnualRevenue') * 10000,
        botAnnualEnergyCost: getValue('botAnnualEnergyCost') * 10000, 
        botAnnualOpexCost: getValue('botAnnualOpexCost') * 10000, 
        botEquityRatio: getValue('botEquityRatio') / 100,
        botLoanInterestRate: getValue('botLoanInterestRate') / 100,
        botDepreciationYears: parseInt(document.getElementById('botDepreciationYears').value) || 10,
        botVatRate: getValue('botVatRate') / 100,
        botSurtaxRate: getValue('botSurtaxRate') / 100,
        botIncomeTaxRate: getValue('botIncomeTaxRate') / 100,
        compare: {
            gas: document.getElementById('compare_gas').checked,
            fuel: document.getElementById('compare_fuel').checked,
            coal: document.getElementById('compare_coal').checked,
            biomass: document.getElementById('compare_biomass').checked,
            electric: document.getElementById('compare_electric').checked,
            steam: document.getElementById('compare_steam').checked,
        }
    };
    return inputs;
}