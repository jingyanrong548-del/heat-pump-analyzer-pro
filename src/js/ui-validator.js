// src/js/ui/ui-validator.js (V15.2 - Final Version)

/**
 * 验证规则库
 * 每个规则都是一个函数，接收输入值作为参数。
 * - 如果验证通过，返回 null。
 * - 如果验证失败，返回具体的错误信息字符串。
 */
const rules = {
    isPositive: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0) {
            return '必须是一个非负数。';
        }
        return null;
    },
    isStrictlyPositive: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num <= 0) {
            return '必须是一个大于零的数。';
        }
        return null;
    },
    isPercentage: (value) => {
        const num = parseFloat(value);
        if (isNaN(num) || num < 0 || num > 100) {
            return '必须在 0 和 100 之间。';
        }
        return null;
    },
    isRequired: (value) => {
        if (value.trim() === '') {
            return '此项为必填项。';
        }
        return null;
    }
};

/**
 * 在输入框下方显示错误信息
 * @param {HTMLElement} inputElement - 目标输入框元素
 * @param {string} message - 要显示的错误信息
 */
function displayError(inputElement, message) {
    const errorContainer = inputElement.nextElementSibling;
    if (errorContainer && errorContainer.classList.contains('error-message')) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
        inputElement.classList.add('input-error');
    }
}

/**
 * 清除输入框的错误状态
 * @param {HTMLElement} inputElement - 目标输入框元素
 */
function clearError(inputElement) {
    const errorContainer = inputElement.nextElementSibling;
    if (errorContainer && errorContainer.classList.contains('error-message')) {
        errorContainer.textContent = '';
        errorContainer.classList.add('hidden');
        inputElement.classList.remove('input-error');
    }
}

/**
 * 验证单个输入框
 * @param {HTMLElement} inputElement - 要验证的输入框元素
 * @returns {boolean} - 如果输入有效则返回 true，否则返回 false
 */
export function validateInput(inputElement) {
    const validationRules = inputElement.dataset.validation?.split(',') || [];
    
    for (const ruleName of validationRules) {
        if (rules[ruleName]) {
            const errorMessage = rules[ruleName](inputElement.value);
            if (errorMessage) {
                displayError(inputElement, errorMessage);
                return false;
            }
        }
    }
    
    clearError(inputElement);
    return true;
}

/**
 * 验证表单中所有带有 data-validation 属性的输入框
 * @returns {boolean} - 如果整个表单都有效则返回 true，否则返回 false
 */
export function isFormValid() {
    const inputsToValidate = document.querySelectorAll('[data-validation]');
    let allValid = true;
    inputsToValidate.forEach(input => {
        if (!validateInput(input)) {
            allValid = false;
        }
    });
    return allValid;
}

/**
 * 清除页面上所有输入框的错误状态。
 * 用于“一键重置”等功能。
 */
export function clearAllErrors() {
    const inputsToValidate = document.querySelectorAll('[data-validation]');
    inputsToValidate.forEach(input => {
        clearError(input); // 复用我们已有的 clearError 逻辑
    });
}