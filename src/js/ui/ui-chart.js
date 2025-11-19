// src/js/ui/ui-chart.js
import Chart from 'chart.js/auto';

let comparisonChartInstance = null;
let lccChartInstance = null;

function destroyOldCharts() {
    if (comparisonChartInstance) { comparisonChartInstance.destroy(); comparisonChartInstance = null; }
    if (lccChartInstance) { lccChartInstance.destroy(); lccChartInstance = null; }
}

export function renderCharts(results, inputs) {
    destroyOldCharts();
    if (!results) return;

    // 适配数据结构
    const isHybrid = results.isHybridMode;
    const mainSolution = isHybrid ? results.hybridSystem : results.hp;
    const mainName = isHybrid ? (mainSolution.name || '混合系统') : '工业热泵';
    const comparisons = results.comparisons || [];
    const toWan = (val) => (val || 0) / 10000;

    const allSolutions = [
        { name: mainName, data: mainSolution },
        ...comparisons.map(c => ({ name: c.name, data: c }))
    ];

    const labels = allSolutions.map(s => s.name);
    const dataEnergy = allSolutions.map(s => toWan(s.data.energyCost));
    const dataMaint = allSolutions.map(s => {
        const total = toWan(s.data.opex);
        const energy = toWan(s.data.energyCost);
        return Math.max(0, total - energy);
    });

    // 绘制柱状图
    const ctxBar = document.getElementById('costComparisonChart');
    if (ctxBar) {
        comparisonChartInstance = new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    { label: '能源成本', data: dataEnergy, backgroundColor: 'rgba(59, 130, 246, 0.7)', stack: 's0' },
                    { label: '运维成本', data: dataMaint, backgroundColor: 'rgba(16, 185, 129, 0.7)', stack: 's0' }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
        });
    }

    // 绘制饼图
    const ctxPie = document.getElementById('lccBreakdownChart');
    if (ctxPie) {
        const capex = toWan(mainSolution.lcc.capex);
        const totalLcc = toWan(mainSolution.lcc.total);
        const lifeOpex = Math.max(0, totalLcc - capex);
        lccChartInstance = new Chart(ctxPie, {
            type: 'doughnut',
            data: {
                labels: ['初始投资', '全周期运营'],
                datasets: [{ data: [capex, lifeOpex], backgroundColor: ['#EF4444', '#3B82F6'] }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}