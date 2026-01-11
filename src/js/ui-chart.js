// src/js/ui-chart.js
// V9.0.0: Internationalization Support

import { t } from './i18n.js';

const isMobile = window.innerWidth < 768;

// 字号回退策略：不再使用 24px，改回 16px (桌面) / 11px (手机)
const BASE_FONT_SIZE = isMobile ? 11 : 16;
const LEGEND_FONT_SIZE = isMobile ? 12 : 18;
const TITLE_FONT_SIZE = isMobile ? 14 : 20;

// import Chart from 'chart.js/auto'; 

Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Noto Sans SC', sans-serif";
Chart.defaults.font.size = BASE_FONT_SIZE; 
Chart.defaults.color = '#1C1C1E'; 

Chart.defaults.scale.grid.color = '#E5E5EA'; 
Chart.defaults.scale.grid.lineWidth = 1;

Chart.defaults.plugins.legend.labels.font = { 
    size: LEGEND_FONT_SIZE, 
    weight: '500' 
};
Chart.defaults.plugins.legend.labels.boxWidth = isMobile ? 12 : 20;
Chart.defaults.plugins.legend.labels.padding = isMobile ? 10 : 25;

Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(28, 28, 30, 0.95)';
Chart.defaults.plugins.tooltip.titleFont = { 
    size: TITLE_FONT_SIZE, 
    weight: '600' 
};
Chart.defaults.plugins.tooltip.bodyFont = { 
    size: BASE_FONT_SIZE 
};
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

const COLORS = {
    hp: { fill: 'rgba(0, 122, 255, 0.85)', border: '#007AFF' }, 
    gas: { fill: 'rgba(255, 149, 0, 0.85)', border: '#FF9500' }, 
    fuel: { fill: 'rgba(255, 59, 48, 0.85)', border: '#FF3B30' }, 
    coal: { fill: 'rgba(142, 142, 147, 0.85)', border: '#8E8E93' }, 
    biomass: { fill: 'rgba(52, 199, 89, 0.85)', border: '#34C759' }, 
    electric: { fill: 'rgba(175, 82, 222, 0.85)', border: '#AF52DE' }, 
    steam: { fill: 'rgba(0, 199, 190, 0.85)', border: '#00C7BE' },  
    opex: 'rgba(255, 204, 0, 0.85)' 
};

let charts = { cost: null, lcc: null };

export function destroyCharts() {
    if (charts.cost) { charts.cost.destroy(); charts.cost = null; }
    if (charts.lcc) { charts.lcc.destroy(); charts.lcc = null; }
}

export function createCostChart(ctx, labels, energyCosts, opexCosts) {
    const getColor = (name) => {
        if (!name) return '#cbd5e1';
        const n = name.toLowerCase();
        if (n.includes('热泵') || n.includes('hp')) return COLORS.hp.fill;
        if (n.includes('气') || n.includes('gas')) return COLORS.gas.fill;
        if (n.includes('油') || n.includes('fuel') || n.includes('oil')) return COLORS.fuel.fill;
        if (n.includes('煤') || n.includes('coal')) return COLORS.coal.fill;
        if (n.includes('生物') || n.includes('bio')) return COLORS.biomass.fill;
        if (n.includes('电') || n.includes('elec')) return COLORS.electric.fill;
        if (n.includes('蒸汽') || n.includes('steam')) return COLORS.steam.fill;
        return '#9ca3af';
    };

    const energyBgColors = labels.map(l => getColor(l));

    charts.cost = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: t('chart.energyCost'),
                    data: energyCosts,
                    backgroundColor: energyBgColors,
                    borderRadius: 4,
                    stack: 'Stack 0',
                    barPercentage: 0.6,
                },
                {
                    label: t('chart.opexCost'),
                    data: opexCosts,
                    backgroundColor: COLORS.opex,
                    borderRadius: 4,
                    stack: 'Stack 0',
                    barPercentage: 0.6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', align: 'end' },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) {
                                label += parseFloat(context.parsed.y).toFixed(2) + ' ' + t('common.unit.tenThousand');
                            }
                            return label;
                        },
                        footer: (tooltipItems) => {
                            let total = 0;
                            tooltipItems.forEach(function(tooltipItem) {
                                total += tooltipItem.parsed.y;
                            });
                            return t('chart.total') + ': ' + total.toFixed(2) + ' ' + t('common.unit.tenThousand');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: !isMobile, 
                        text: t('chart.perYear'),
                        font: { size: 14, weight: '500' } 
                    },
                    stacked: true,
                    border: { display: false },
                    ticks: { padding: 10 }
                },
                x: { 
                    stacked: true,
                    grid: { display: false },
                    ticks: { 
                        font: { weight: '500' },
                        maxRotation: 45,
                        minRotation: 0
                    } 
                }
            }
        }
    });
    return charts.cost;
}

export function createLccChart(ctx, data) {
    const plotData = data.map(v => Math.abs(v));

    charts.lcc = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [t('chart.initialInvestment'), t('chart.lifetimeEnergy'), t('chart.lifetimeOpex'), t('chart.residualValue')],
            datasets: [{
                data: plotData,
                backgroundColor: [ 'rgba(255, 59, 48, 0.85)', 'rgba(0, 122, 255, 0.85)', 'rgba(255, 204, 0, 0.85)', 'rgba(52, 199, 89, 0.85)' ],
                borderWidth: 0,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'right', 
                    labels: { padding: 20 }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const val = context.raw;
                            const total = context.chart._metasets[context.datasetIndex].total;
                            const percentage = ((val / total) * 100).toFixed(1) + '%';
                            const labelStr = context.label;
                            if (labelStr === t('chart.residualValue')) {
                                return ` ${labelStr}: -${val.toFixed(1)} ${t('common.unit.tenThousand')} (${percentage})`;
                            }
                            return ` ${labelStr}: ${val.toFixed(1)} ${t('common.unit.tenThousand')} (${percentage})`;
                        }
                    }
                }
            }
        }
    });
    return charts.lcc;
}