// ui-setup.js (V13.0 - UPDATED VERSION)
import { fuelData, converters, MJ_PER_KCAL } from '../config.js';

// --- 模块内部状态 ---
let spfStandardValue = "3.0"; // 模式一 (标准) 的SPF默认值
let spfHybridValue = "4.0";   // 模式二 (混合) 的SPF默认值
let spfBotValue = "3.5";      // 模式三 (BOT) 的SPF默认值
let currentMode = 'standard'; // V11.0: 跟踪当前模式

// --- 私有辅助函数 ---

/**
 * 设置单位换算下拉框的监听
 */
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
                 console.error("Missing conversion factor for", c.inputId, "to unit", targetUnit);
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

    const biomassCalorificSelect = document.getElementById('biomassCalorificUnit');
    if(biomassCalorificSelect) { 
        biomassCalorificSelect.value = 'kcal/kg';
        biomassCalorificSelect.dispatchEvent(new Event('change'));
    }
}


// V13.0 新增: 对比基准关联项动态显隐功能
// =================================================================
/**
 * 设置对比基准复选框的事件监听器。
 * 当勾选或取消勾选某个能源时，会动态显示或隐藏整个应用中所有与之相关的输入项。
 * 这个新版本将完全替换旧的 opacity/disabled 逻辑。
 */
function setupComparisonToggles() {
    // 1. 获取所有的对比复选框元素
    const toggles = document.querySelectorAll('.comparison-toggle');

    /**
     * 根据单个复选框的当前状态，更新其关联元素的可视性。
     * @param {HTMLInputElement} toggle - 复选框元素
     */
    const updateVisibility = (toggle) => {
        // 从 data-target 属性获取能源标识 (例如: "gas", "coal")
        const target = toggle.dataset.target;
        if (!target) return;

        // 检查复选框是否被选中
        const isChecked = toggle.checked;
        
        // 查找所有带有 'related-to-...' 类的关联元素
        // 这是与 V13.0 的 index.html 紧密配合的关键
        const relatedElements = document.querySelectorAll(`.related-to-${target}`);

        // 遍历所有关联元素，根据复选框状态添加或移除 'hidden' 类
        relatedElements.forEach(el => {
            if (isChecked) {
                el.classList.remove('hidden'); // 勾选时，移除 hidden 类 (显示)
            } else {
                el.classList.add('hidden');    // 取消勾选时，添加 hidden 类 (隐藏)
            }
        });
    };

    // 2. 为每个复选框设置初始状态并绑定事件
    toggles.forEach(toggle => {
        // a. 页面加载时，立即根据默认勾选状态执行一次，以确保初始界面正确
        updateVisibility(toggle);

        // b. 添加 'change' 事件监听器，以便在用户操作时触发更新
        toggle.addEventListener('change', () => updateVisibility(toggle));
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

    if (!modeStandard || !modeHybrid || !modeBot || !hybridConfigInputs || !botConfigInputs || !comparisonTogglesContainer || !standardModeSections || !lccParamsContainer) {
        console.error('V11.0 (模式选择) UI 元素未在 HTML 中完全找到。');
        return;
    }

    const applyModeState = (newMode) => {
        const currentValue = hpCopInput.value;
        
        if (currentMode === 'standard') {
            spfStandardValue = currentValue;
        } else if (currentMode === 'hybrid') {
            spfHybridValue = currentValue;
        } else if (currentMode === 'bot') {
            spfBotValue = currentValue;
        }

        if (newMode === 'standard' || newMode === 'hybrid') {
            hybridConfigInputs.classList.toggle('hidden', newMode === 'standard');
            botConfigInputs.classList.add('hidden');
            comparisonTogglesContainer.classList.remove('hidden');
            standardModeSections.classList.remove('hidden');
            lccParamsContainer.classList.remove('hidden');
            
            calcModeRadios.forEach(radio => radio.disabled = false);
            const checkedCalcMode = document.querySelector('input[name="calcMode"]:checked');
            if (checkedCalcMode) {
                checkedCalcMode.dispatchEvent(new Event('change'));
            }

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

    modeStandard.addEventListener('change', () => {
        if (modeStandard.checked) applyModeState('standard');
    });

    modeHybrid.addEventListener('change', () => {
        if (modeHybrid.checked) applyModeState('hybrid');
    });
    
    modeBot.addEventListener('change', () => {
        if (modeBot.checked) {
            if (showGlobalNotification) {
                showGlobalNotification('模式三 (BOT 模式) 正在升级中，暂不开放。', 'info', 4000);
            }
            if (currentMode === 'standard') {
                modeStandard.checked = true;
            } else if (currentMode === 'hybrid') {
                modeHybrid.checked = true;
            } else {
                modeStandard.checked = true;
            }
        }
    });

    hpCopInput.value = spfStandardValue; 
    applyModeState('standard');
}


function setupCalculationModeToggle(markResultsAsStale) {
    const calcModeRadios = document.querySelectorAll('input[name="calcMode"]');
    const modeAContainer = document.getElementById('calcModeAContainer');
    const modeBContainer = document.getElementById('calcModeBContainer');
    const modeCContainer = document.getElementById('calcModeCContainer');
    
    const operatingHoursContainer = document.getElementById('operatingHours')?.parentElement;

    if (!modeAContainer || !modeBContainer || !modeCContainer || !operatingHoursContainer || calcModeRadios.length === 0) {
        console.error("年加热量计算模式的 UI 元素未完全找到。");
        return;
    }

    const applyCalcMode = () => {
        const selectedRadio = document.querySelector('input[name="calcMode"]:checked');
        if (!selectedRadio) return; // Exit if no radio is checked
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

    calcModeRadios.forEach(radio => {
        radio.addEventListener('change', applyCalcMode);
    });

    applyCalcMode();
}


function addNewPriceTier(name = "", price = "", dist = "", markResultsAsStale, showGlobalNotification) {
    const container = document.getElementById('priceTiersContainer');
    if (!container) {
        console.error("priceTiersContainer 未找到!");
        return;
    }
    
    const tierId = `tier-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newTier = document.createElement('div');
    newTier.className = 'price-tier-entry grid grid-cols-1 md:grid-cols-10 gap-2 items-center';
    newTier.id = tierId;

    newTier.innerHTML = `
        <div class="md:col-span-3">
            <label for="${tierId}-name" class="block text-xs font-medium text-gray-600 mb-1">时段名称 (可选)</label>
            <input type="text" id="${tierId}-name" value="${name}" placeholder="例如: 峰时" class="tier-name w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm track-change storage-mode-field">
        </div>
        <div class="md:col-span-3">
            <label for="${tierId}-price" class="block text-xs font-medium text-gray-600 mb-1">电价 (元/kWh)</label>
            <input type="number" id="${tierId}-price" value="${price}" placeholder="例如: 1.2" class="tier-price w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm track-change storage-mode-field">
        </div>
        <div class="md:col-span-3">
            <label for="${tierId}-dist" class="block text-xs font-medium text-gray-600 mb-1">运行比例 (%)</label>
            <input type="number" id="${tierId}-dist" value="${dist}" placeholder="例如: 40" class="tier-dist w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm track-change storage-mode-field">
        </div>
        <div class="md:col-span-1 flex items-end h-full">
            <button class="removePriceTierBtn w-full text-sm bg-red-100 text-red-700 font-semibold py-2 px-3 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 mt-5 md:mt-0">
                删除
            </button>
        </div>
    `;

    container.appendChild(newTier);

    newTier.querySelectorAll('input.track-change').forEach(input => {
        input.dataset.defaultValue = input.value;
        input.addEventListener('input', (event) => {
            const currentInput = event.target;
            const currentDefaultValue = currentInput.dataset.defaultValue;
            if (currentInput.classList.contains('default-param') || currentDefaultValue !== undefined) {
                currentInput.classList.toggle('default-param', currentInput.value === currentDefaultValue);
            }
            if (currentInput.classList.contains('track-change')) {
                markResultsAsStale();
            }
        });
    });

    newTier.querySelector('.removePriceTierBtn').addEventListener('click', () => {
        if (document.querySelectorAll('.price-tier-entry').length > 1) {
            newTier.remove();
            markResultsAsStale(); 
        } else {
            if(showGlobalNotification) {
                showGlobalNotification('必须至少保留一个电价时段。', 'error');
            } else {
                alert('必须至少保留一个电价时段。');
            }
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
    
    document.querySelectorAll('.price-tier-entry').forEach(tierEl => {
        tierEl.querySelectorAll('input').forEach(input => {
            if (input.value) {
                input.classList.add('default-param');
            }
        });
    });
}

function setupGreenElectricityToggle() {
    const toggle = document.getElementById('greenElectricityToggle');
    const gridFactorInput = document.getElementById('gridFactor');
    const gridFactorUnit = document.getElementById('gridFactorUnit');

    if (!toggle || !gridFactorInput || !gridFactorUnit) return;

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            gridFactorInput.value = '0';
            gridFactorInput.dataset.baseValue = '0'; 
            gridFactorInput.disabled = true;
            gridFactorUnit.disabled = true;
            gridFactorInput.classList.remove('default-param');
        } else {
            const baseValue = gridFactorInput.getAttribute('data-base-value') || "0.57";
            gridFactorInput.dataset.baseValue = baseValue;
            
            gridFactorUnit.value = 'kgCO2/kWh';
            gridFactorUnit.dispatchEvent(new Event('change'));
            
            gridFactorInput.disabled = false;
            gridFactorUnit.disabled = false;
            gridFactorInput.classList.add('default-param');
            gridFactorInput.dataset.defaultValue = gridFactorInput.value;
        }
    });
}

function setupFuelTypeSelector() {
    const fuelTypeSelect = document.getElementById('fuelType');
    if (!fuelTypeSelect) return;

    const priceInput = document.getElementById('fuelPrice');
    const calorificInput = document.getElementById('fuelCalorific');
    const factorInput = document.getElementById('fuelFactor');
    const priceTooltip = document.getElementById('fuelPriceTooltip');
    const calorificTooltip = document.getElementById('fuelCalorificTooltip');
    const factorTooltip = document.getElementById('fuelFactorTooltip');
    const calorificUnitSelect = document.getElementById('fuelCalorificUnit');
    const factorUnitSelect = document.getElementById('fuelFactorUnit');

    fuelTypeSelect.addEventListener('change', (e) => {
        const selectedFuel = e.target.value;
        const data = fuelData[selectedFuel];
        if (!data) return;

        priceInput.dataset.baseValue = data.price;
        calorificInput.dataset.baseValue = data.calorific;
        factorInput.dataset.baseValue = data.factor;

        priceInput.value = data.price;
        priceInput.dataset.defaultValue = data.price;
        priceInput.classList.add('default-param');

        if (priceTooltip) priceTooltip.innerHTML = data.priceTooltip;
        if (calorificTooltip) calorificTooltip.innerHTML = data.calorificTooltip;
        if (factorTooltip) factorTooltip.innerHTML = data.factorTooltip;

        calorificUnitSelect.value = 'MJ/kg'; 
        calorificUnitSelect.dispatchEvent(new Event('change'));
        calorificInput.dataset.defaultValue = calorificInput.value;
        calorificInput.classList.add('default-param');

        factorUnitSelect.value = 'kgCO2/t'; 
        factorUnitSelect.dispatchEvent(new Event('change'));
        factorInput.dataset.defaultValue = factorInput.value;
        factorInput.classList.add('default-param');
    });
}


export function initializeInputSetup(markResultsAsStale, showGlobalNotification) {
    setupUnitConverters();
    setupComparisonToggles(); // This now calls the new V13.0 function
    setupGreenElectricityToggle();
    setupFuelTypeSelector();
    setupPriceTierControls(markResultsAsStale, showGlobalNotification); 
    setupModeSelector(markResultsAsStale, showGlobalNotification);
    setupCalculationModeToggle(markResultsAsStale);

    const allInputs = document.querySelectorAll('input[type="number"], input[type="checkbox"], select, input[type="text"], input[type="radio"]');
    allInputs.forEach(input => {
        let defaultValue;
        if (input.type === 'checkbox') {
            defaultValue = input.checked;
        } else {
            defaultValue = input.value;
        }
        
        if (input.id === 'heatingLoad' || input.id === 'annualHeating' || input.id.endsWith('Calorific') || input.id.endsWith('Factor')) {
             if (input.dataset.baseValue === undefined) {
                input.dataset.baseValue = input.value;
             }
        }
        input.dataset.defaultValue = defaultValue;
        const inputChangeCallback = (event) => {
            const currentInput = event.target;
            
            let currentDefaultValue = currentInput.dataset.defaultValue;
            let currentValue = currentInput.value;
            
            if (currentInput.type === 'checkbox') {
                currentValue = currentInput.checked;
                currentDefaultValue = currentDefaultValue === 'true'; 
            }

            if (currentInput.classList.contains('default-param') || currentDefaultValue !== undefined) {
                currentInput.classList.toggle('default-param', currentValue === currentDefaultValue);
            }

            const container = currentInput.parentElement;
            const unitSelect = document.getElementById(currentInput.id + 'Unit');

            if (unitSelect && unitSelect.id.includes('Unit')) {
                const currentVal = parseFloat(currentInput.value);
                if (isNaN(currentVal)) {
                     const originalBaseValue = currentInput.getAttribute('data-base-value');
                     currentInput.dataset.baseValue = originalBaseValue;
                     if (currentInput.classList.contains('track-change')) {
                         markResultsAsStale();
                     }
                     return;
                }

                const currentUnit = unitSelect.value;
                const converter = converters.find(c => c.inputId === currentInput.id);
                if (!converter) return;

                const allConversions = converter.dynamicConversions ? converter.dynamicConversions() : converter.conversions;
                const conversionFactor = allConversions[currentUnit];

                if (currentVal === 0) {
                     currentInput.dataset.baseValue = 0;
                } else if (conversionFactor && conversionFactor !== 0) {
                    const newBaseValue = currentVal / conversionFactor;
                    currentInput.dataset.baseValue = newBaseValue;
                }
            }
            
            if (currentInput.classList.contains('track-change')) {
                 markResultsAsStale();
            }
        };

        if (input.tagName === 'SELECT' || input.type === 'checkbox' || input.type === 'radio') {
             input.addEventListener('change', inputChangeCallback);
        } else {
             input.addEventListener('input', inputChangeCallback);
        }
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

    const analysisMode = document.querySelector('input[name="schemeAMode"]:checked').value || 'standard';

    if (analysisMode !== 'bot') {
        if (Math.abs(totalDist - 100) > 0.1) {
            showErrorCallback(`电价时段总比例必须为 100%，当前为 ${totalDist.toFixed(1)}%！`);
            return null;
        }
        if (priceTiers.some(t => t.price <= 0 || t.dist <= 0)) {
            showErrorCallback('电价或运行比例必须大于 0！');
            return null;
        }
    }
    
    showErrorCallback(null);

    const calcModeRadio = document.querySelector('input[name="calcMode"]:checked');
    const calcMode = calcModeRadio ? calcModeRadio.value : 'annual';
    
    const heatingLoad = parseFloat(document.getElementById('heatingLoad').dataset.baseValue) || 0;
    const operatingHours = parseFloat(document.getElementById('operatingHours').value) || 0;
    const annualHeating = parseFloat(document.getElementById('annualHeating').dataset.baseValue) || 0;
    const dailyHours = parseFloat(document.getElementById('dailyHours').value) || 0;
    const annualDays = parseFloat(document.getElementById('annualDays').value) || 0;
    const loadFactor = (parseFloat(document.getElementById('loadFactor').value) || 0) / 100;

    let annualHeatingDemandKWh = 0;
    if (calcMode === 'annual') {
        annualHeatingDemandKWh = heatingLoad * operatingHours;
    } else if (calcMode === 'total') {
        annualHeatingDemandKWh = annualHeating;
    } else if (calcMode === 'daily') {
        annualHeatingDemandKWh = heatingLoad * dailyHours * annualDays * loadFactor;
    }

    const inputs = {
        analysisMode: analysisMode,
        isHybridMode: analysisMode === 'hybrid',
        lccYears: parseInt(document.getElementById('lccYears').value) || 15,
        discountRate: (parseFloat(document.getElementById('discountRate').value) || 8) / 100,
        energyInflationRate: (parseFloat(document.getElementById('energyInflationRate').value) || 3) / 100,
        opexInflationRate: (parseFloat(document.getElementById('opexInflationRate').value) || 5) / 100,
        isGreenElectricity: document.getElementById('greenElectricityToggle').checked,
        priceTiers: priceTiers,
        projectName: document.getElementById('projectName').value, 
        heatingLoad: heatingLoad,
        operatingHours: operatingHours,
        annualHeating: annualHeating,
        dailyHours: dailyHours,
        annualDays: annualDays,
        loadFactor: loadFactor,
        annualHeatingDemandKWh: annualHeatingDemandKWh,
        hpHostCapex: parseFloat(document.getElementById('hpCapex').value) * 10000 || 0,
        hpStorageCapex: parseFloat(document.getElementById('storageCapex').value) * 10000 || 0,
        hpSalvageRate: (parseFloat(document.getElementById('hpSalvageRate').value) || 0) / 100,
        gasBoilerCapex: parseFloat(document.getElementById('gasBoilerCapex').value) * 10000 || 0,
        gasSalvageRate: (parseFloat(document.getElementById('gasSalvageRate').value) || 0) / 100,
        fuelBoilerCapex: parseFloat(document.getElementById('fuelBoilerCapex').value) * 10000 || 0,
        fuelSalvageRate: (parseFloat(document.getElementById('fuelSalvageRate').value) || 0) / 100,
        coalBoilerCapex: parseFloat(document.getElementById('coalBoilerCapex').value) * 10000 || 0,
        coalSalvageRate: (parseFloat(document.getElementById('coalSalvageRate').value) || 0) / 100,
        biomassBoilerCapex: parseFloat(document.getElementById('biomassBoilerCapex').value) * 10000 || 0,
        biomassSalvageRate: (parseFloat(document.getElementById('biomassSalvageRate').value) || 0) / 100,
        electricBoilerCapex: parseFloat(document.getElementById('electricBoilerCapex').value) * 10000 || 0,
        electricSalvageRate: (parseFloat(document.getElementById('electricSalvageRate').value) || 0) / 100,
        steamCapex: parseFloat(document.getElementById('steamCapex').value) * 10000 || 0,
        steamSalvageRate: (parseFloat(document.getElementById('steamSalvageRate').value) || 0) / 100,
        hpCop: parseFloat(document.getElementById('hpCop').value) || 0,
        gasBoilerEfficiency: parseFloat(document.getElementById('gasBoilerEfficiency').value) / 100 || 0,
        fuelBoilerEfficiency: parseFloat(document.getElementById('fuelBoilerEfficiency').value) / 100 || 0,
        coalBoilerEfficiency: parseFloat(document.getElementById('coalBoilerEfficiency').value) / 100 || 0,
        biomassBoilerEfficiency: parseFloat(document.getElementById('biomassBoilerEfficiency').value) / 100 || 0,
        electricBoilerEfficiency: parseFloat(document.getElementById('electricBoilerEfficiency').value) / 100 || 0,
        steamEfficiency: parseFloat(document.getElementById('steamEfficiency').value) / 100 || 0,
        gasPrice: parseFloat(document.getElementById('gasPrice').value) || 0,
        fuelPrice: parseFloat(document.getElementById('fuelPrice').value) || 0,
        coalPrice: parseFloat(document.getElementById('coalPrice').value) || 0,
        biomassPrice: parseFloat(document.getElementById('biomassPrice').value) || 0,
        steamPrice: parseFloat(document.getElementById('steamPrice').value) || 0,
        gridFactor: (document.getElementById('greenElectricityToggle').checked) ? 0 : (parseFloat(document.getElementById('gridFactor').dataset.baseValue) || 0),
        gasFactor: parseFloat(document.getElementById('gasFactor').dataset.baseValue) || 0,
        fuelFactor: parseFloat(document.getElementById('fuelFactor').dataset.baseValue) || 0,
        coalFactor: parseFloat(document.getElementById('coalFactor').dataset.baseValue) || 0,
        biomassFactor: parseFloat(document.getElementById('biomassFactor').dataset.baseValue), 
        steamFactor: parseFloat(document.getElementById('steamFactor').dataset.baseValue) || 0,
        gasCalorific: parseFloat(document.getElementById('gasCalorific').dataset.baseValue) || 0,
        fuelCalorific: parseFloat(document.getElementById('fuelCalorific').dataset.baseValue) || 0,
        coalCalorific: parseFloat(document.getElementById('coalCalorific').dataset.baseValue) || 0,
        biomassCalorific: parseFloat(document.getElementById('biomassCalorific').dataset.baseValue) || 0,
        steamCalorific: parseFloat(document.getElementById('steamCalorific').dataset.baseValue) || 0,
        hpOpexCost: (parseFloat(document.getElementById('hpOpexCost').value) || 0) * 10000,
        gasOpexCost: (parseFloat(document.getElementById('gasOpexCost').value) || 0) * 10000,
        fuelOpexCost: (parseFloat(document.getElementById('fuelOpexCost').value) || 0) * 10000,
        coalOpexCost: (parseFloat(document.getElementById('coalOpexCost').value) || 0) * 10000,
        biomassOpexCost: (parseFloat(document.getElementById('biomassOpexCost').value) || 0) * 10000,
        electricOpexCost: (parseFloat(document.getElementById('electricOpexCost').value) || 0) * 10000,
        steamOpexCost: (parseFloat(document.getElementById('steamOpexCost').value) || 0) * 10000,
        hybridLoadShare: (parseFloat(document.getElementById('hybridLoadShare').value) || 0) / 100,
        hybridAuxHeaterType: document.getElementById('hybridAuxHeaterType').value,
        hybridAuxHeaterCapex: (parseFloat(document.getElementById('hybridAuxHeaterCapex').value) || 0) * 10000,
        hybridAuxHeaterOpex: (parseFloat(document.getElementById('hybridAuxHeaterOpex').value) || 0) * 10000,
        botAnnualRevenue: (parseFloat(document.getElementById('botAnnualRevenue').value) || 0) * 10000,
        botAnnualEnergyCost: (parseFloat(document.getElementById('botAnnualEnergyCost').value) || 0) * 10000, 
        botAnnualOpexCost: (parseFloat(document.getElementById('botAnnualOpexCost').value) || 0) * 10000, 
        botEquityRatio: (parseFloat(document.getElementById('botEquityRatio').value) || 0) / 100,
        botLoanInterestRate: (parseFloat(document.getElementById('botLoanInterestRate').value) || 0) / 100,
        botDepreciationYears: parseInt(document.getElementById('botDepreciationYears').value) || 10,
        botVatRate: (parseFloat(document.getElementById('botVatRate').value) || 0) / 100,
        botSurtaxRate: (parseFloat(document.getElementById('botSurtaxRate').value) || 0) / 100,
        botIncomeTaxRate: (parseFloat(document.getElementById('botIncomeTaxRate').value) || 0) / 100,
        compare: {
            gas: document.getElementById('compare_gas').checked,
            fuel: document.getElementById('compare_fuel').checked,
            coal: document.getElementById('compare_coal').checked,
            biomass: document.getElementById('compare_biomass').checked,
            electric: document.getElementById('compare_electric').checked,
            steam: document.getElementById('compare_steam').checked,
        }
    };

    if (analysisMode !== 'bot') {
        if (annualHeatingDemandKWh <= 0 || !inputs.hpCop) {
            if (alertNotifier) {
                alertNotifier('成本对比模式: 请确保最终的“年总加热量”大于 0，并已填写工业热泵SPF。', 'error');
            } else {
                alert('成本对比模式: 请确保最终的“年总加热量”大于 0，并已填写工业热泵SPF。');
            }
            return null;
        }
    } else {
         if (inputs.botAnnualRevenue === 0 || inputs.botAnnualEnergyCost === 0) {
            if(alertNotifier) {
                alertNotifier('BOT模式: “年销售收入”和“年能源成本”必须大于0。', 'error');
            } else {
                alert('BOT模式: “年销售收入”和“年能源成本”必须大于0。');
            }
            return null;
         }
    }

    return inputs;
}