// src/js/ui/ui-chart.js (V15.7 - Color Fix & New Chart)
import Chart from 'chart.js/auto';

let comparisonChartInstance = null;
let unitCostChartInstance = null; // 新增实例
let lccChartInstance = null;

function destroyOldCharts() {
    if (comparisonChartInstance) { comparisonChartInstance.destroy(); comparisonChartInstance = null; }
    if (unitCostChartInstance) { unitCostChartInstance.destroy(); unitCostChartInstance = null; }
    if (lccChartInstance) { lccChartInstance.destroy(); lccChartInstance = null; }
}

// [关键修复] 颜色映射表：包含所有可能的名称
// 注意：这里的键名必须和界面上显示的名称完全一致
const ENERGY_COLORS = {
    '工业热泵': '#3B82F6',   // Blue-500
    '混合系统': '#6366F1',   // Indigo-500
    '天然气锅炉': '#0EA5E9', // Sky-500
    '燃油锅炉': '#F59E0B',   // Amber-500
    '燃煤锅炉': '#374151',   // Gray-700
    '生物质锅炉': '#10B981', // Emerald-500
    '电锅炉': '#EAB308',     // Yellow-500
    '管网蒸汽': '#8B5CF6'    // Violet-500
};

export function renderCharts(results, inputs) {
    destroyOldCharts();
    if (!results) return;

    const isHybrid = results.isHybridMode;
    const mainSolution = isHybrid ? results.hybridSystem : results.hp;
    const mainName = isHybrid ? (mainSolution.name || '混合系统') : '工业热泵';
    const comparisons = results.comparisons || [];
    const toWan = (val) => (val || 0) / 10000;

    // 准备所有数据点
    const allSolutions = [
        { name: mainName, data: mainSolution },
        ...comparisons.map(c => ({ name: c.name, data: c }))
    ];

    // 提取标签和颜色
    const labels = allSolutions.map(s => s.name);
    const backgroundColors = labels.map(name => ENERGY_COLORS[name] || '#9CA3AF'); // 默认灰色

    // --- 图表 1: 年度成本总额 (堆叠) ---
    const ctxBar = document.getElementById('costComparisonChart');
    if (ctxBar) {
        const dataEnergy = allSolutions.map(s => toWan(s.data.energyCost));
        const dataMaint = allSolutions.map(s => {
            const total = toWan(s.data.opex);
            const energy = toWan(s.data.energyCost);
            return Math.max(0, total - energy);
        });

        comparisonChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { 
                        label: '能源成本', 
                        data: dataEnergy, 
                        backgroundColor: backgroundColors, // 使用多彩颜色
                        stack: 's0' 
                    },
                    { 
                        label: '运维成本', 
                        data: dataMaint, 
                        backgroundColor: '#D1D5DB', // 浅灰色
                        stack: 's0' 
                    }
                ]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: { x: { stacked: true }, y: { stacked: true } } 
            }
        });
    }

    // --- [新增] 图表 2: 吨蒸汽单价对比 (简单柱状图) ---
    const ctxUnit = document.getElementById('steamUnitCostChart');
    if (ctxUnit) {
        // 提取单价数据 (元/吨)
        const dataUnitCost = allSolutions.map(s => s.data.cost_per_steam_ton || 0);

        unitCostChartInstance = new Chart(ctxUnit, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '折算吨蒸汽成本 (元/吨)',
                    data: dataUnitCost,
                    backgroundColor: backgroundColors, // 保持颜色一致性
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }, // 不需要图例，颜色已在图1说明
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.raw.toFixed(0)} 元/吨`
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: '元/吨' } }
                }
            }
        });
    }

    // --- 图表 3: LCC 构成 ---
    const ctxPie = document.getElementById('lccBreakdownChart');
    if (ctxPie) {
        const capex = toWan(mainSolution.lcc.capex);
        const totalLcc = toWan(mainSolution.lcc.total);
        const lifeOpex = Math.max(0, totalLcc - capex);
        
        lccChartInstance = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['初始投资', '全周期运营'],
                datasets: [{ 
                    data: [capex, lifeOpex], 
                    backgroundColor: ['#EF4444', '#3B82F6'] 
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}