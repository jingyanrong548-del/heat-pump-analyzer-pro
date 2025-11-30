// src/js/ui-chart.js
// V19.2: Responsive Charts (Fixed Cutoff Issue)

const isMobile = window.innerWidth < 768;

// 字号回退策略：不再使用 24px，改回 16px (桌面) / 11px (手机)
const BASE_FONT_SIZE = isMobile ? 11 : 16;
const LEGEND_FONT_SIZE = isMobile ? 12 : 18;
const TITLE_FONT_SIZE = isMobile ? 14 : 20;

// import Chart from 'chart.js/auto'; 

Chart.defaults.font.family = "'Inter', 'Noto Sans SC', sans-serif";
Chart.defaults.font.size = BASE_FONT_SIZE; 
Chart.defaults.color = '#475569'; 

Chart.defaults.scale.grid.color = '#e2e8f0'; 
Chart.defaults.scale.grid.lineWidth = 1;

Chart.defaults.plugins.legend.labels.font = { 
    size: LEGEND_FONT_SIZE, 
    weight: 'bold' 
};
Chart.defaults.plugins.legend.labels.boxWidth = isMobile ? 12 : 20;
Chart.defaults.plugins.legend.labels.padding = isMobile ? 10 : 25;

Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.95)';
Chart.defaults.plugins.tooltip.titleFont = { 
    size: TITLE_FONT_SIZE, 
    weight: 'bold' 
};
Chart.defaults.plugins.tooltip.bodyFont = { 
    size: BASE_FONT_SIZE 
};
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;

const COLORS = {
    hp: { fill: 'rgba(37, 99, 235, 0.9)', border: '#2563eb' }, 
    gas: { fill: 'rgba(234, 88, 12, 0.9)', border: '#ea580c' }, 
    fuel: { fill: 'rgba(220, 38, 38, 0.9)', border: '#dc2626' }, 
    coal: { fill: 'rgba(71, 85, 105, 0.9)', border: '#475569' }, 
    biomass: { fill: 'rgba(22, 163, 74, 0.9)', border: '#16a34a' }, 
    electric: { fill: 'rgba(147, 51, 234, 0.9)', border: '#9333ea' }, 
    steam: { fill: 'rgba(8, 145, 178, 0.9)', border: '#0891b2' },  
    opex: '#f59e0b' 
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
                    label: '能源成本',
                    data: energyCosts,
                    backgroundColor: energyBgColors,
                    borderRadius: 4,
                    stack: 'Stack 0',
                    barPercentage: 0.6,
                },
                {
                    label: '运维成本',
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
                                label += parseFloat(context.parsed.y).toFixed(2) + ' 万';
                            }
                            return label;
                        },
                        footer: (tooltipItems) => {
                            let total = 0;
                            tooltipItems.forEach(function(tooltipItem) {
                                total += tooltipItem.parsed.y;
                            });
                            return '总计: ' + total.toFixed(2) + ' 万';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { 
                        display: !isMobile, 
                        text: '万元/年',
                        font: { size: 14, weight: 'bold' } 
                    },
                    stacked: true,
                    border: { display: false },
                    ticks: { padding: 10 }
                },
                x: { 
                    stacked: true,
                    grid: { display: false },
                    ticks: { 
                        font: { weight: 'bold' },
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
            labels: ['初始投资', '全周期能源', '全周期运维', '残值回收'],
            datasets: [{
                data: plotData,
                backgroundColor: [ '#ef4444', '#3b82f6', '#f59e0b', '#10b981' ],
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
                            if (labelStr === '残值回收') {
                                return ` ${labelStr}: -${val.toFixed(1)} 万 (${percentage})`;
                            }
                            return ` ${labelStr}: ${val.toFixed(1)} 万 (${percentage})`;
                        }
                    }
                }
            }
        }
    });
    return charts.lcc;
}