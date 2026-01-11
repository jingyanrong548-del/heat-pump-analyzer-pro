(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function s(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerPolicy&&(l.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?l.credentials="include":o.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function n(o){if(o.ep)return;o.ep=!0;const l=s(o);fetch(o.href,l)}})();const Oe={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},f={hp:{cop:3,opex:2.5},electric:{price:.7,calorific:3.6,factor:.57,boilerEff:98,opex:.4,capex:50},gas:{price:4.2,calorific:36,factor:1.97,boilerEff:92,opex:1.8,capex:80},coal:{price:1e3,calorific:21,factor:2.42,boilerEff:80,opex:6.8,capex:60},fuel:{price:8e3,calorific:42,factor:3.1,boilerEff:90,opex:1.9,capex:70},biomass:{price:850,calorific:15,factor:0,boilerEff:85,opex:6.3,capex:75},steam:{price:280,calorific:2.8,factor:.35,boilerEff:95,opex:0,capex:0}},Ae={water:{mass:100,tempIn:15,tempOut:60},steam:{mass:10,pressure:.8,feedTemp:20}};function k(e,t=2){const s=parseFloat(e);return isNaN(s)?"-":(s/1e4).toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function ae(e,t=2){const s=parseFloat(e);return isNaN(s)?"-":s.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function me(e,t=2){const s=parseFloat(e);return isNaN(s)?"-":s.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function D(e,t=1){const s=parseFloat(e);return isNaN(s)?"-":(s*100).toFixed(t)+"%"}function Fe(e,t,s,n,o){if(!t||!s)return{error:"请输入有效的燃料消耗量和热值"};const l=t*s/1e3;let r=0;if(n==="water"){const{mass:c,tempIn:d,tempOut:g}=o;if(!c||d===void 0||!g)return{error:"请输入完整的热水参数"};const m=g-d;r=4.186*(c*1e3)*m/1e6}else if(n==="steam"){const{mass:c,pressure:d,feedTemp:g}=o;if(!c||!d||g===void 0)return{error:"请输入完整的蒸汽参数"};const m=2770,C=4.186*g;r=c*1e3*(m-C)/1e6}return l<=0?{error:"计算得出的投入能量无效"}:{efficiency:r/l*100,inputEnergy:l,outputEnergy:r,error:null}}const Ee="heat_pump_lang",ke="zh",ge={zh:{page:{title:"工业热泵效益分析器",subtitle:"V9.0.0 | 工业热泵",benefitAnalysis:"效益分析",dashboard:"实时评估看板"},lang:{zh:"中文",en:"English",switch:"切换语言"},button:{reset:"重置",enableComparison:"启用对比",calculate:"运行计算",saveScenario:"暂存当前方案",export:"导出",exportReport:"导出报告",config:"配置参数",confirm:"确认",cancel:"取消",close:"关闭",delete:"删除",clear:"清空",undo:"撤销",add:"添加",calc:"开始计算",apply:"应用结果"},card:{annualSaving:"年节省金额",irr:"内部收益率 (IRR)",pbp:"动态回收期",co2Reduction:"年碳减排"},tab:{charts:"图表分析",dataTable:"详细数据",conclusion:"智能结论",scenarios:"方案对比"},accordion:{project:"1. 项目与负荷",scheme:"2. 方案与投资",operating:"3. 运行参数",financial:"4. 财务模型"},project:{name:"项目名称",namePlaceholder:"示例项目",loadMode:"负荷计算模式",modeA:"模式 A",modeB:"模式 B",modeC:"模式 C",annualMethod:"年时法",totalMethod:"总量法",intermittentMethod:"间歇法",heatingLoad:"制热负荷 (设计值)",operatingHours:"年运行小时 (h)",annualHeating:"年总加热量",operatingHoursReverse:"年运行小时 (反推)",dailyHours:"日运行 (h)",annualDays:"年天数 (d)",loadFactor:"平均负荷率 (%)"},scheme:{systemMode:"系统模式 (System Mode)",pureHP:"1. 纯热泵",hybrid:"2. 混合动力",hpInvestment:"热泵投资 (万)",storageInvestment:"储能投资 (万)",hybridConfig:"混合动力配置",auxHeaterType:"辅助热源类型",hpLoadShare:"热泵承担负荷 (%)",auxLoadNote:"剩余由辅热承担",auxHeaterInvestment:"辅热投资 (万)",auxHeaterOpex:"辅热运维 (万)",comparisonConfig:"对比基准配置",electric:"电锅炉",gas:"天然气",coal:"燃煤",fuel:"燃油",biomass:"生物质",steam:"蒸汽",investment:"投资(万)"},operating:{hpSPF:"工业热泵 SPF (能效)",keyIndicator:"关键指标",priceConfig:"电价配置 (元/kWh)",greenPower:"启用绿电 (零碳模式)",gasPrice:"气价 (元/m³)",coalPrice:"煤价 (元/t)",steamPrice:"汽价 (元/t)",fuelPrice:"油价 (元/t)",biomassPrice:"生物质 (元/t)",boilerEfficiency:"锅炉效率 (%)",advancedParams:"高级能源参数 (单位换算)",emission:"排放",calorific:"热值",opex:"运维成本 (万/年)",hpOpex:"工业热泵",electricAux:"电加热 (Electric)",gasBoiler:"天然气锅炉 (Gas)",coalBoiler:"燃煤锅炉 (Coal)",fuelBoiler:"燃油锅炉 (Fuel)",biomassBoiler:"生物质锅炉 (Biomass)",steamNetwork:"管网蒸汽 (Steam)",pipeSteam:"管道蒸汽",reverseCalc:"反推"},financial:{businessModel:"投资模式 (Business Model)",selfInvest:"1. 业主自投",bot:"2. 能源托管/BOT",analysisYears:"分析年限 (年)",discountRate:"折现率 (%)",botParams:"BOT 参数设置",annualRevenue:"年服务费收入 (万)",equityRatio:"自有资金比例 (%)",energyInflation:"能源涨幅(%)",opexInflation:"运维涨幅(%)",author:"创作：荆炎荣",usageCounter:"累计运行：{count} 次",disclaimer:"免责声明：本工具计算结果仅供参考，不作为最终投资决策依据。具体参数请咨询专业设计院。"},effCalc:{title:"🔥 锅炉效率反推助手",fuelType:"燃料类型",fuelAmount:"燃料消耗量",outputType:"输出类型",hotWater:"热水",steam:"蒸汽",waterMass:"产水量 (吨)",waterInTemp:"进水温度 (℃)",waterOutTemp:"出水温度 (℃)",steamMass:"产汽量 (吨)",steamPressure:"蒸汽压力 (MPa)",feedTemp:"补水温度 (℃)",result:"计算效率结果"},table:{scenarioName:"方案名称",unitSteamCost:"折算吨汽成本",savingRate:"综合节能率",investment:"投资(万)",annualTotalCost:"年总成本(万)",annualSaving:"年节省(万)",staticPayback:"静态回收期",dynamicPayback:"动态回收期",lccTotal:"LCC(万)",co2Reduction:"碳减排(吨)",action:"操作",schemeName:"方案名称",lccTotalFull:"LCC总值(万)"},dataTable:{hpScheme:"工业热泵 (本方案)",note1:"注：LCC (全生命周期成本) 已包含资金时间价值，折现率",note2:"折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。",year:"年",immediately:"立即",na:"N/A",cannotRecover:"无法回收"},conclusion:{recommend:"🚀 推荐投资",average:"⚖️ 投资回报一般",compared:"相比于",hpScheme:"工业热泵方案预计每年可节省",yuan:"万元",savingRateText:"综合费用节能率达",hpCost:"您的热泵供热成本相当于",perTonSteam:"元/吨蒸汽",cost:"的成本为",perTon:"元/吨",lifetimeSaving:"全生命周期（{years}年）累计节省",dynamicPaybackText:"动态回收期为"},scenario:{empty:"暂无暂存方案",saved:"方案已暂存",savePrompt:"请先运行计算，再暂存方案。",clearConfirm:"确定要清空所有暂存方案吗？",scenario:"方案",modePure:"热泵",modeHybrid:"混合",modeBOT:"(BOT)"},chart:{annualCostComparison:"年度成本对比",lccBreakdown:"LCC 成本构成",energyCost:"能源成本",opexCost:"运维成本",perYear:"万元/年",initialInvestment:"初始投资",lifetimeEnergy:"全周期能源",lifetimeOpex:"全周期运维",residualValue:"残值回收",total:"总计"},message:{welcome:'👋 欢迎使用！请在左侧配置参数，然后点击"运行计算"开启分析。',noData:"暂无分析数据",noDataPrompt:'请在左侧侧边栏输入项目参数，<br>并点击 <span class="font-bold text-blue-500">"运行计算"</span> 按钮。',pleaseConfig:"请点击配置参数...",pleaseCalculate:"请先进行计算",keepOneTier:"至少保留一个电价时段",resetConfirm:"确定要恢复默认参数吗？",pleaseCalculateFirst:"请先运行计算，再暂存方案。"},modal:{confirm:"确认",cancel:"取消"},common:{unit:{year:"年",ton:"吨",tenThousand:"万",yuan:"元",percent:"%",yuanPerTonSteam:"元/吨蒸汽",yuanPerYear:"元/年"},comparison:{gas:"天然气锅炉",coal:"燃煤锅炉",fuel:"燃油锅炉",electric:"电锅炉",steam:"管网蒸汽",biomass:"生物质锅炉"},fuelShort:{gas:"气",coal:"煤",fuel:"油",biomass:"生物",steam:"蒸汽"},fuelName:{gas:"天然气",coal:"燃煤",fuel:"燃油",biomass:"生物质"}}},en:{page:{title:"Industrial Heat Pump Benefit Analyzer",subtitle:"V9.0.0 | Industrial Heat Pump",benefitAnalysis:"Benefit Analysis",dashboard:"Real-time Evaluation Dashboard"},lang:{zh:"中文",en:"English",switch:"Switch Language"},button:{reset:"Reset",enableComparison:"Enable Comparison",calculate:"Run Calculation",saveScenario:"Save Current Scenario",export:"Export",exportReport:"Export Report",config:"Configure Parameters",confirm:"Confirm",cancel:"Cancel",close:"Close",delete:"Delete",clear:"Clear",undo:"Undo",add:"Add",calc:"Calculate",apply:"Apply Result"},card:{annualSaving:"Annual Savings",irr:"Internal Rate of Return (IRR)",pbp:"Dynamic Payback Period",co2Reduction:"Annual CO₂ Reduction"},tab:{charts:"Chart Analysis",dataTable:"Detailed Data",conclusion:"Smart Conclusion",scenarios:"Scenario Comparison"},accordion:{project:"1. Project & Load",scheme:"2. Scheme & Investment",operating:"3. Operating Parameters",financial:"4. Financial Model"},project:{name:"Project Name",namePlaceholder:"Sample Project",loadMode:"Load Calculation Mode",modeA:"Mode A",modeB:"Mode B",modeC:"Mode C",annualMethod:"Annual Hours Method",totalMethod:"Total Amount Method",intermittentMethod:"Intermittent Method",heatingLoad:"Heating Load (Design Value)",operatingHours:"Annual Operating Hours (h)",annualHeating:"Annual Total Heating Demand",operatingHoursReverse:"Annual Operating Hours (Reverse)",dailyHours:"Daily Operating (h)",annualDays:"Annual Days (d)",loadFactor:"Average Load Factor (%)"},scheme:{systemMode:"System Mode",pureHP:"1. Pure Heat Pump",hybrid:"2. Hybrid System",hpInvestment:"Heat Pump Investment (10k CNY)",storageInvestment:"Storage Investment (10k CNY)",hybridConfig:"Hybrid System Configuration",auxHeaterType:"Auxiliary Heat Source Type",hpLoadShare:"Heat Pump Load Share (%)",auxLoadNote:"Remaining by Auxiliary Heater",auxHeaterInvestment:"Aux Heater Investment (10k CNY)",auxHeaterOpex:"Aux Heater O&M (10k CNY)",comparisonConfig:"Comparison Baseline Configuration",electric:"Electric Boiler",gas:"Natural Gas",coal:"Coal",fuel:"Fuel Oil",biomass:"Biomass",steam:"Steam",investment:"Investment (10k CNY)"},operating:{hpSPF:"Industrial Heat Pump SPF (Efficiency)",keyIndicator:"Key Indicator",priceConfig:"Electricity Price Configuration (CNY/kWh)",greenPower:"Enable Green Power (Zero Carbon Mode)",gasPrice:"Gas Price (CNY/m³)",coalPrice:"Coal Price (CNY/t)",steamPrice:"Steam Price (CNY/t)",fuelPrice:"Fuel Price (CNY/t)",biomassPrice:"Biomass (CNY/t)",boilerEfficiency:"Boiler Efficiency (%)",advancedParams:"Advanced Energy Parameters (Unit Conversion)",emission:"Emission",calorific:"Calorific Value",opex:"O&M Cost (10k CNY/year)",hpOpex:"Industrial Heat Pump",electricAux:"Electric Heating",gasBoiler:"Natural Gas Boiler",coalBoiler:"Coal Boiler",fuelBoiler:"Fuel Oil Boiler",biomassBoiler:"Biomass Boiler",steamNetwork:"Steam Network",pipeSteam:"Pipeline Steam",reverseCalc:"Reverse Calc"},financial:{businessModel:"Business Model",selfInvest:"1. Owner Investment",bot:"2. Energy Management/BOT",analysisYears:"Analysis Period (years)",discountRate:"Discount Rate (%)",botParams:"BOT Parameter Settings",annualRevenue:"Annual Service Revenue (10k CNY)",equityRatio:"Equity Ratio (%)",energyInflation:"Energy Inflation Rate (%)",opexInflation:"O&M Inflation Rate (%)",author:"Created by: Jing Yanrong",usageCounter:"Total Runs: {count}",disclaimer:"Disclaimer: The calculation results of this tool are for reference only and do not constitute the final investment decision basis. Please consult professional design institutes for specific parameters."},effCalc:{title:"🔥 Boiler Efficiency Calculator",fuelType:"Fuel Type",fuelAmount:"Fuel Consumption",outputType:"Output Type",hotWater:"Hot Water",steam:"Steam",waterMass:"Water Output (ton)",waterInTemp:"Inlet Temperature (℃)",waterOutTemp:"Outlet Temperature (℃)",steamMass:"Steam Output (ton)",steamPressure:"Steam Pressure (MPa)",feedTemp:"Feed Water Temperature (℃)",result:"Efficiency Result"},table:{scenarioName:"Scenario Name",unitSteamCost:"Unit Steam Cost",savingRate:"Energy Saving Rate",investment:"Investment (10k CNY)",annualTotalCost:"Annual Total Cost (10k CNY)",annualSaving:"Annual Saving (10k CNY)",staticPayback:"Static Payback Period",dynamicPayback:"Dynamic Payback Period",lccTotal:"LCC (10k CNY)",co2Reduction:"CO₂ Reduction (ton)",action:"Action",schemeName:"Scheme Name",lccTotalFull:"LCC Total (10k CNY)"},dataTable:{hpScheme:"Industrial Heat Pump (This Scheme)",note1:"* Note: LCC (Life Cycle Cost) includes time value of money, discount rate",note2:"* Unit steam cost is calculated based on standard steam calorific value (approx. 698kWh/ton).",year:"years",immediately:"Immediate",na:"N/A",cannotRecover:"Cannot Recover"},conclusion:{recommend:"🚀 Recommended Investment",average:"⚖️ Average Return on Investment",compared:"Compared to",hpScheme:"the industrial heat pump scheme is expected to save",yuan:"10k CNY",savingRateText:"per year, with a comprehensive energy saving rate of",hpCost:"Your heat pump heating cost is equivalent to",perTonSteam:"CNY/ton steam",cost:", while",perTon:"cost is",lifetimeSaving:"CNY/ton. The cumulative savings over the full life cycle ({years} years) is",dynamicPaybackText:"10k CNY. The dynamic payback period is"},scenario:{empty:"No Saved Scenarios",saved:"Scenario Saved",savePrompt:"Please run calculation first, then save scenario.",clearConfirm:"Are you sure you want to clear all saved scenarios?",scenario:"Scenario",modePure:"Heat Pump",modeHybrid:"Hybrid",modeBOT:"(BOT)"},chart:{annualCostComparison:"Annual Cost Comparison",lccBreakdown:"LCC Cost Breakdown",energyCost:"Energy Cost",opexCost:"O&M Cost",perYear:"10k CNY/year",initialInvestment:"Initial Investment",lifetimeEnergy:"Lifetime Energy",lifetimeOpex:"Lifetime O&M",residualValue:"Residual Value",total:"Total"},message:{welcome:'👋 Welcome! Please configure parameters on the left, then click "Run Calculation" to start analysis.',noData:"No Analysis Data",noDataPrompt:'Please enter project parameters in the left sidebar,<br>and click the <span class="font-bold text-blue-500">"Run Calculation"</span> button.',pleaseConfig:"Please click to configure parameters...",pleaseCalculate:"Please calculate first",keepOneTier:"Keep at least one electricity price tier",resetConfirm:"Are you sure you want to reset to default parameters?",pleaseCalculateFirst:"Please run calculation first, then save scenario."},modal:{confirm:"Confirm",cancel:"Cancel"},common:{unit:{year:"years",ton:"ton",tenThousand:"10k",yuan:"CNY",percent:"%",yuanPerTonSteam:"CNY/ton steam",yuanPerYear:"CNY/year"},comparison:{gas:"Natural Gas Boiler",coal:"Coal Boiler",fuel:"Fuel Oil Boiler",electric:"Electric Boiler",steam:"Steam Network",biomass:"Biomass Boiler"}}}};let fe=ke;function a(e,t={}){const s=e.split(".");let n=ge[fe];for(const o of s)if(n&&typeof n=="object"&&o in n)n=n[o];else return console.warn(`Translation key not found: ${e}`),e;return typeof n=="string"&&Object.keys(t).length>0?n.replace(/\{(\w+)\}/g,(o,l)=>t[l]!==void 0?t[l]:o):n||e}function Be(e){return ge[e]?(fe=e,localStorage.setItem(Ee,e),document.documentElement.setAttribute("lang",e==="zh"?"zh-CN":"en"),!0):!1}function He(){return fe}function Ne(){const e=localStorage.getItem(Ee),t=e&&ge[e]?e:ke;Be(t)}const G={activeTab:"charts",notifierTimeout:null};function je(){De(),qe(),We(),ie(G.activeTab)}function De(){document.querySelectorAll(".accordion-header").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("aria-controls"),n=document.getElementById(s),o=t.getAttribute("aria-expanded")==="true";Ye(t,n,!o)})})}function Ye(e,t,s){!e||!t||(s?(t.classList.remove("hidden"),requestAnimationFrame(()=>{t.classList.add("open"),e.setAttribute("aria-expanded","true")})):(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),setTimeout(()=>{e.getAttribute("aria-expanded")==="false"&&t.classList.add("hidden")},300)))}function qe(){document.querySelectorAll(".tab-link").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault();const n=t.dataset.tab;n&&ie(n)})})}function ie(e){document.querySelectorAll(".tab-link").forEach(t=>{t.dataset.tab===e?t.classList.add("tab-active"):t.classList.remove("tab-active")}),document.querySelectorAll(".tab-content").forEach(t=>{t.id===`tab-${e}`?(t.classList.remove("hidden"),_e(t)):t.classList.add("hidden")}),G.activeTab=e}function _e(e){e.querySelectorAll("canvas").forEach(s=>{window.dispatchEvent(new Event("resize"))})}function We(){const e=document.getElementById("input-sidebar"),t=document.getElementById("mobile-open-config"),s=document.getElementById("mobile-sidebar-close"),n=document.getElementById("calculateBtn");if(!e)return;const o=l=>{l?(e.classList.remove("translate-y-full"),e.classList.add("translate-y-0"),document.body.style.overflow="hidden"):(e.classList.remove("translate-y-0"),e.classList.add("translate-y-full"),document.body.style.overflow="")};t&&t.addEventListener("click",()=>o(!0)),s&&s.addEventListener("click",()=>o(!1)),n&&n.addEventListener("click",()=>{window.innerWidth<768&&(o(!1),setTimeout(()=>Se(),300))})}function Ue(e){const t=document.getElementById("export-report-btn");t&&(t.disabled=!1,t.classList.remove("opacity-50","cursor-not-allowed"),t.classList.add("hover:bg-blue-700","shadow-md"))}function Se(){const e=document.getElementById("main-results-area");e&&(e.scrollIntoView({behavior:"smooth",block:"start"}),window.scrollTo({top:0,behavior:"smooth"}))}function ze(){const e=document.getElementById("report-placeholder"),t=document.getElementById("report-content");e&&e.classList.add("hidden"),t&&t.classList.remove("hidden"),ie(G.activeTab)}function U(e,t,s=null){const n=document.getElementById(`card-${e}`);n&&(n.textContent=t,s&&(n.className=n.className.replace(/text-(green|yellow|red|gray)-\d+/,""),n.classList.add(...s.split(" "))))}function he(e,t="info",s=3e3){const n=document.getElementById("global-notifier"),o=document.getElementById("global-notifier-text");!n||!o||(G.notifierTimeout&&clearTimeout(G.notifierTimeout),o.textContent=e,n.className="fixed top-8 right-8 z-[100] max-w-lg p-6 rounded-2xl shadow-2xl transition-all duration-300 transform",t==="success"?n.classList.add("bg-green-100","text-green-800"):t==="error"?n.classList.add("bg-red-100","text-red-800"):n.classList.add("bg-blue-100","text-blue-800"),n.classList.remove("translate-x-full","hidden"),G.notifierTimeout=setTimeout(()=>{n.classList.add("translate-x-full"),setTimeout(()=>n.classList.add("hidden"),300)},s))}const J=window.innerWidth<768,Ie=J?11:16,Ve=J?12:18,Ge=J?14:20;Chart.defaults.font.family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Noto Sans SC', sans-serif";Chart.defaults.font.size=Ie;Chart.defaults.color="#1C1C1E";Chart.defaults.scale.grid.color="#E5E5EA";Chart.defaults.scale.grid.lineWidth=1;Chart.defaults.plugins.legend.labels.font={size:Ve,weight:"500"};Chart.defaults.plugins.legend.labels.boxWidth=J?12:20;Chart.defaults.plugins.legend.labels.padding=J?10:25;Chart.defaults.plugins.tooltip.backgroundColor="rgba(28, 28, 30, 0.95)";Chart.defaults.plugins.tooltip.titleFont={size:Ge,weight:"600"};Chart.defaults.plugins.tooltip.bodyFont={size:Ie};Chart.defaults.plugins.tooltip.padding=12;Chart.defaults.plugins.tooltip.cornerRadius=8;const F={hp:{fill:"rgba(0, 122, 255, 0.85)"},gas:{fill:"rgba(255, 149, 0, 0.85)"},fuel:{fill:"rgba(255, 59, 48, 0.85)"},coal:{fill:"rgba(142, 142, 147, 0.85)"},biomass:{fill:"rgba(52, 199, 89, 0.85)"},electric:{fill:"rgba(175, 82, 222, 0.85)"},steam:{fill:"rgba(0, 199, 190, 0.85)"},opex:"rgba(255, 204, 0, 0.85)"};let P={cost:null,lcc:null};function Je(){P.cost&&(P.cost.destroy(),P.cost=null),P.lcc&&(P.lcc.destroy(),P.lcc=null)}function Ke(e,t,s,n){const o=r=>{if(!r)return"#cbd5e1";const i=r.toLowerCase();return i.includes("热泵")||i.includes("hp")?F.hp.fill:i.includes("气")||i.includes("gas")?F.gas.fill:i.includes("油")||i.includes("fuel")||i.includes("oil")?F.fuel.fill:i.includes("煤")||i.includes("coal")?F.coal.fill:i.includes("生物")||i.includes("bio")?F.biomass.fill:i.includes("电")||i.includes("elec")?F.electric.fill:i.includes("蒸汽")||i.includes("steam")?F.steam.fill:"#9ca3af"},l=t.map(r=>o(r));return P.cost=new Chart(e,{type:"bar",data:{labels:t,datasets:[{label:a("chart.energyCost"),data:s,backgroundColor:l,borderRadius:4,stack:"Stack 0",barPercentage:.6},{label:a("chart.opexCost"),data:n,backgroundColor:F.opex,borderRadius:4,stack:"Stack 0",barPercentage:.6}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",align:"end"},tooltip:{callbacks:{label:r=>{let i=r.dataset.label||"";return i&&(i+=": "),r.parsed.y!==null&&(i+=parseFloat(r.parsed.y).toFixed(2)+" "+a("common.unit.tenThousand")),i},footer:r=>{let i=0;return r.forEach(function(c){i+=c.parsed.y}),a("chart.total")+": "+i.toFixed(2)+" "+a("common.unit.tenThousand")}}}},scales:{y:{beginAtZero:!0,title:{display:!J,text:a("chart.perYear"),font:{size:14,weight:"500"}},stacked:!0,border:{display:!1},ticks:{padding:10}},x:{stacked:!0,grid:{display:!1},ticks:{font:{weight:"500"},maxRotation:45,minRotation:0}}}}}),P.cost}function Ze(e,t){const s=t.map(n=>Math.abs(n));return P.lcc=new Chart(e,{type:"doughnut",data:{labels:[a("chart.initialInvestment"),a("chart.lifetimeEnergy"),a("chart.lifetimeOpex"),a("chart.residualValue")],datasets:[{data:s,backgroundColor:["rgba(255, 59, 48, 0.85)","rgba(0, 122, 255, 0.85)","rgba(255, 204, 0, 0.85)","rgba(52, 199, 89, 0.85)"],borderWidth:0,hoverOffset:15}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"60%",plugins:{legend:{position:"right",labels:{padding:20}},tooltip:{callbacks:{label:n=>{const o=n.raw,l=n.chart._metasets[n.datasetIndex].total,r=(o/l*100).toFixed(1)+"%",i=n.label;return i===a("chart.residualValue")?` ${i}: -${o.toFixed(1)} ${a("common.unit.tenThousand")} (${r})`:` ${i}: ${o.toFixed(1)} ${a("common.unit.tenThousand")} (${r})`}}}}}}),P.lcc}let E=null,L=[],de=[];const u=e=>`value="${e}" data-default="${e}"`,ve={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},b="w-full px-4 md:px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-base md:text-lg font-medium text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none placeholder-gray-400 h-11 md:h-12 shadow-apple-sm",p="block text-sm font-medium text-gray-700 mb-2 md:mb-3 tracking-wide",Xe="bg-white p-1 mb-4 md:mb-6";function Qe(){return`
        <div class="${Xe}">
            <label class="${p}">${a("project.name")}</label>
            <input type="text" id="projectName" ${u(a("project.namePlaceholder"))} class="${b}">
        </div>
        <div class="pt-4 md:pt-6 border-t border-gray-200">
            <label class="${p} mb-3 md:mb-4">${a("project.loadMode")}</label>
            <div class="grid grid-cols-3 gap-2 md:gap-3">
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="annual" class="peer sr-only" checked>
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-apple-sm">
                        <span class="text-sm md:text-base font-medium text-gray-800 peer-checked:text-blue-600">${a("project.modeA")}</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">${a("project.annualMethod")}</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="total" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-apple-sm">
                        <span class="text-sm md:text-base font-medium text-gray-800 peer-checked:text-blue-600">${a("project.modeB")}</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">${a("project.totalMethod")}</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="daily" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-apple-sm">
                        <span class="text-sm md:text-base font-medium text-gray-800 peer-checked:text-blue-600">${a("project.modeC")}</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">${a("project.intermittentMethod")}</span>
                    </div>
                </label>
            </div>
        </div>
        <div id="input-group-load" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${p} !mb-0">${a("project.heatingLoad")}</label>
                    <select id="heatingLoadUnit" class="text-xs md:text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-2 py-1 cursor-pointer hover:bg-blue-100 transition"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </div>
                <input type="number" id="heatingLoad" ${u("1000")} class="${b}" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-hours-a" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <label class="${p}">${a("project.operatingHours")}</label>
                <input type="number" id="operatingHours" ${u("2000")} class="${b}" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-total" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${p} !mb-0">${a("project.annualHeating")}</label>
                    <select id="annualHeatingUnit" class="text-xs md:text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-2 py-1 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </div>
                <input type="number" id="annualHeating" ${u("2000000")} class="${b}" data-validation="isPositive">
            </div>
            <div>
                <label class="${p}">${a("project.operatingHoursReverse")}</label>
                <input type="number" id="operatingHours_B" ${u("2000")} class="${b}" placeholder="自动计算">
            </div>
        </div>
        <div id="input-group-daily" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${p}">${a("project.dailyHours")}</label>
                    <input type="number" id="dailyHours" ${u("8")} class="${b}">
                </div>
                <div>
                    <label class="${p}">${a("project.annualDays")}</label>
                    <input type="number" id="annualDays" ${u("300")} class="${b}">
                </div>
            </div>
            <div>
                <label class="${p}">${a("project.loadFactor")}</label>
                <input type="number" id="loadFactor" ${u("70")} class="${b}">
            </div>
        </div>
    `}function et(){return`
        <div class="mb-6">
            <label class="${p} mb-3">${a("scheme.systemMode")}</label>
            <div class="flex bg-gray-100 p-1 rounded-xl">
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="systemMode" value="pure" class="peer sr-only" checked>
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-blue-500 peer-checked:shadow-apple-sm transition-all">${a("scheme.pureHP")}</span>
                </label>
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="systemMode" value="hybrid" class="peer sr-only">
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-blue-500 peer-checked:shadow-apple-sm transition-all">${a("scheme.hybrid")}</span>
                </label>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <div>
                <label class="${p}">${a("scheme.hpInvestment")}</label>
                <input type="number" id="hpCapex" ${u(f.hp.capex||"200")} class="${b}" data-validation="isPositive">
            </div>
            <div>
                <label class="${p}">${a("scheme.storageInvestment")}</label>
                <input type="number" id="storageCapex" ${u("0")} class="${b}">
            </div>
        </div>
        <div id="hybrid-params" class="hidden mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl animate-fadeIn">
             <h4 class="text-sm font-semibold text-orange-800 mb-4 flex items-center"><span class="mr-2">🔥</span>${a("scheme.hybridConfig")}</h4>
             <div class="space-y-4">
                 <div>
                    <label class="${p} text-orange-900">${a("scheme.auxHeaterType")}</label>
                    <select id="hybridAuxHeaterType" class="w-full px-3 py-2 border border-orange-200 rounded-xl text-base font-medium text-orange-900 focus:ring-2 focus:ring-orange-500 bg-white">
                        <option value="electric">${a("operating.electricAux")}</option>
                        <option value="gas">${a("operating.gasBoiler")}</option>
                        <option value="coal">${a("operating.coalBoiler")}</option>
                        <option value="fuel">${a("operating.fuelBoiler")}</option>
                        <option value="biomass">${a("operating.biomassBoiler")}</option>
                        <option value="steam">${a("operating.steamNetwork")}</option>
                    </select>
                 </div>
                 <div>
                    <label class="${p} flex justify-between text-orange-900">
                        <span>${a("scheme.hpLoadShare")}</span>
                        <span class="text-xs text-orange-600 font-normal">${a("scheme.auxLoadNote")}</span>
                    </label>
                    <input type="number" id="hybridLoadShare" ${u("50")} class="${b} border-orange-200 focus:border-orange-500 text-orange-900">
                 </div>
                 <div class="grid grid-cols-2 gap-3">
                     <div>
                        <label class="${p} text-orange-900">${a("scheme.auxHeaterInvestment")}</label>
                        <input type="number" id="hybridAuxHeaterCapex" ${u("30")} class="${b} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                     <div>
                        <label class="${p} text-orange-900">${a("scheme.auxHeaterOpex")}</label>
                        <input type="number" id="hybridAuxHeaterOpex" ${u("0.5")} class="${b} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                 </div>
             </div>
        </div>
        <div class="pt-4 md:pt-6 border-t border-gray-200">
             <label class="block text-base font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                <span class="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>${a("scheme.comparisonConfig")}
             </label>
             <div class="space-y-2 md:space-y-3">
                ${[{k:"gas",key:"gas"},{k:"coal",key:"coal"},{k:"electric",key:"electric"},{k:"steam",key:"steam"},{k:"fuel",key:"fuel"},{k:"biomass",key:"biomass"}].map(e=>{const t=f[e.k].capex;return`
                    <div class="flex items-center justify-between group related-to-${e.k} transition-all duration-200 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${e.k}" data-target="${e.k}" class="comparison-toggle w-5 h-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" checked>
                            <label for="compare_${e.k}" class="ml-3 text-sm md:text-base font-medium text-gray-700 cursor-pointer select-none">${a(`scheme.${e.key}`)}</label>
                        </div>
                        <div class="flex items-center gap-2 md:gap-3">
                            <span class="text-xs text-gray-400 font-bold hidden md:inline">${a("scheme.investment")}</span>
                            <div class="relative w-20 md:w-24">
                                <input type="number" id="${e.k}BoilerCapex" ${u(t)} class="w-full px-2 py-1.5 border border-gray-200 rounded-xl text-sm md:text-base font-medium text-right focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all text-gray-700" placeholder="0">
                            </div>
                            <input type="hidden" id="${e.k}SalvageRate" value="${e.k==="steam"?0:5}">
                        </div>
                    </div>
                    `}).join("")}
             </div>
        </div>
    `}function tt(){return`
        <div>
            <label class="${p} flex justify-between items-center">
                <span>${a("operating.hpSPF")}</span>
                <span class="text-blue-500 text-[10px] md:text-xs font-medium bg-blue-100 px-2 py-0.5 rounded-lg">${a("operating.keyIndicator")}</span>
            </label>
            <input type="number" id="hpCop" ${u(f.hp.cop)} step="0.1" class="${b} !text-xl md:!text-2xl !text-blue-600" data-validation="isStrictlyPositive">
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200 space-y-4 md:space-y-6">
             <div>
                <div class="flex justify-between items-center mb-2 md:mb-4">
                    <label class="${p} !mb-0">${a("operating.priceConfig")}</label>
                    <button type="button" id="addPriceTierBtn" class="text-[10px] md:text-xs font-medium text-blue-500 bg-white border border-blue-200 hover:bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg transition">+ ${a("button.add")}</button>
                </div>
                <div id="priceTiersContainer" class="space-y-2 md:space-y-3 mb-2 md:mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${f.electric.price}" class="track-change"> 
                <label class="flex items-center cursor-pointer p-2 md:p-3 bg-green-50/50 border border-green-200 rounded-xl hover:border-green-300 transition">
                    <input type="checkbox" id="greenPowerToggle" class="w-4 h-4 md:w-5 md:h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 track-change">
                    <span class="ml-2 md:ml-3 text-sm md:text-base font-medium text-green-800">${a("operating.greenPower")}</span>
                </label>
             </div>
             <div class="grid grid-cols-2 gap-3 md:gap-4">
                 <div class="related-to-gas"><label class="${p}">${a("operating.gasPrice")}</label><input type="number" id="gasPrice" ${u(f.gas.price)} class="${b}"></div>
                 <div class="related-to-coal"><label class="${p}">${a("operating.coalPrice")}</label><input type="number" id="coalPrice" ${u(f.coal.price)} class="${b}"></div>
                 <div class="related-to-steam"><label class="${p}">${a("operating.steamPrice")}</label><input type="number" id="steamPrice" ${u(f.steam.price)} class="${b}"></div>
                 <div class="related-to-fuel"><label class="${p}">${a("operating.fuelPrice")}</label><input type="number" id="fuelPrice" ${u(f.fuel.price)} class="${b}"></div>
                 <div class="related-to-biomass"><label class="${p}">${a("operating.biomassPrice")}</label><input type="number" id="biomassPrice" ${u(f.biomass.price)} class="${b}"></div>
             </div>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${p} mb-2 md:mb-4">${a("operating.boilerEfficiency")}</label>
            <div class="space-y-2 md:space-y-3">
                ${[{id:"gas",key:"gas"},{id:"coal",key:"coal"},{id:"electric",key:"electric"},{id:"steam",key:"pipeSteam"},{id:"fuel",key:"fuel"},{id:"biomass",key:"biomass"}].map(e=>{const t={gas:a("scheme.gas"),coal:a("scheme.coal"),electric:a("scheme.electric"),pipeSteam:a("operating.pipeSteam"),fuel:a("scheme.fuel"),biomass:a("scheme.biomass")},s={gas:f.gas.boilerEff,coal:f.coal.boilerEff,electric:f.electric.boilerEff,pipeSteam:f.steam.boilerEff,fuel:f.fuel.boilerEff,biomass:f.biomass.boilerEff},n={gas:!0,coal:!0,electric:!1,pipeSteam:!1,fuel:!0,biomass:!0},o=s[e.key]||s[e.id],l=n[e.key]!==void 0?n[e.key]:n[e.id],r=t[e.key]||t[e.id];return`
                    <div class="flex items-center gap-2 related-to-${e.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-16 md:w-24 shrink-0 text-right pr-2">${r}</span>
                        <div class="flex-1 flex items-center gap-2 min-w-0">
                            <input type="number" id="${e.id}BoilerEfficiency" ${u(o)} class="flex-1 px-2 md:px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-base md:text-lg font-medium text-gray-800 focus:bg-white focus:border-blue-500 transition-all text-center h-9 md:h-10 min-w-0">
                            ${l?`<button type="button" class="eff-calc-btn shrink-0 text-blue-500 bg-blue-50 hover:bg-blue-100 text-[10px] md:text-xs font-medium px-2 md:px-3 py-2 rounded-lg border border-blue-100 transition-colors whitespace-nowrap" data-target="${e.id}BoilerEfficiency" data-fuel="${e.id}">${a("operating.reverseCalc")}</button>`:""}
                        </div>
                    </div>
                `}).join("")}
            </div>
        </div>
        <div class="mt-4 md:mt-6 pt-4 border-t border-dashed border-gray-200">
            <details class="group">
                <summary class="flex justify-between items-center font-medium cursor-pointer list-none text-gray-600 hover:text-blue-500 transition-colors text-sm md:text-base select-none py-2 bg-gray-50 rounded-xl px-3">
                    <span>⚙️ ${a("operating.advancedParams")}</span>
                    <span class="transition group-open:rotate-180"><svg fill="none" height="20" width="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span>
                </summary>
                <div class="text-gray-500 mt-3 grid grid-cols-1 gap-3 animate-fadeIn">
                    <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200">
                        <span class="text-xs md:text-sm font-medium text-gray-700">${a("operating.electricAux").replace(" (Electric)","")} (Electric)</span>
                        <div class="flex items-center"><span class="text-[10px] md:text-xs mr-2 font-bold">${a("operating.emission")}</span><input id="gridFactor" type="number" ${u(f.electric.factor)} class="w-16 md:w-20 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-xs md:text-sm"><span class="ml-1 md:ml-2 text-[10px] md:text-xs font-bold">kg/kWh</span></div>
                    </div>
                    ${[{k:"gas",labelKey:"gas",u:"m³"},{k:"coal",labelKey:"coal",u:"kg"},{k:"fuel",labelKey:"fuel",u:"kg"},{k:"biomass",labelKey:"biomass",u:"kg"},{k:"steam",labelKey:"steam",u:"kg"}].map(e=>{const t=a(`common.fuelShort.${e.k}`);return`
                        <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200 related-to-${e.k}">
                            <span class="text-xs md:text-sm font-medium text-gray-700">${t}</span>
                            <div class="flex items-center gap-1 md:gap-2">
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold">${a("operating.calorific")}</span>
                                    <input id="${e.k}Calorific" type="number" ${u(f[e.k].calorific)} class="w-12 md:w-16 p-1 border border-gray-300 rounded-lg text-right font-medium text-gray-900 text-[10px] md:text-sm">
                                    <select id="${e.k}CalorificUnit" class="ml-0.5 md:ml-1 p-1 border border-gray-300 rounded-lg bg-white text-[10px] md:text-xs font-medium w-12 md:w-16 track-change unit-converter" data-target-input="${e.k}Calorific">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                    </select>
                                    <span class="text-xs font-medium text-gray-500 ml-1">/${e.u}</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-medium hidden lg:inline">${a("operating.emission")}</span>
                                    <input id="${e.k}Factor" type="number" ${u(f[e.k].factor)} class="w-12 md:w-16 p-1 border border-gray-300 rounded-lg text-right font-medium text-gray-900 text-[10px] md:text-sm">
                                    <span class="text-[10px] md:text-xs font-medium text-gray-500 ml-0.5">kg/${e.u}</span>
                                </div>
                            </div>
                        </div>`}).join("")}
                </div>
            </details>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${p} mb-3 md:mb-4">${a("operating.opex")}</label>
            <div class="space-y-3 md:space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm md:text-base font-medium text-blue-600 w-20 md:w-24">${a("operating.hpOpex")}</span>
                    <input type="number" id="hpOpexCost" ${u(f.hp.opex)} class="flex-1 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl text-base md:text-lg font-medium text-blue-700 text-center h-10 md:h-12 shadow-apple-sm">
                </div>
                ${[{id:"gas",key:"gas"},{id:"coal",key:"coal"},{id:"electric",key:"electric"},{id:"steam",key:"steam"},{id:"fuel",key:"fuel"},{id:"biomass",key:"biomass"}].map(e=>{const t={gas:a("scheme.gas"),coal:a("scheme.coal"),electric:a("scheme.electric"),steam:a("scheme.steam"),fuel:a("scheme.fuel"),biomass:a("scheme.biomass")},s={gas:f.gas.opex,coal:f.coal.opex,electric:f.electric.opex,steam:f.steam.opex,fuel:f.fuel.opex,biomass:f.biomass.opex},n=t[e.key]||t[e.id],o=s[e.key]||s[e.id];return`
                    <div class="flex items-center justify-between related-to-${e.id}">
                        <span class="text-sm md:text-base font-medium text-gray-600 w-20 md:w-24">${n}</span>
                        <input type="number" id="${e.id}OpexCost" ${u(o)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-xl text-base md:text-lg font-medium text-gray-700 text-center h-10 md:h-12">
                    </div>
                `}).join("")}
            </div>
        </div>
    `}function at(){return`
        <div class="mb-6">
            <label class="${p} mb-3">${a("financial.businessModel")}</label>
            <div class="flex bg-gray-100 p-1 rounded-xl">
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="financeMode" value="self" class="peer sr-only" checked>
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-purple-600 peer-checked:shadow-apple-sm transition-all">${a("financial.selfInvest")}</span>
                </label>
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="financeMode" value="bot" class="peer sr-only">
                    <span class="block text-center py-2 rounded-lg text-sm font-medium text-gray-600 peer-checked:bg-white peer-checked:text-purple-600 peer-checked:shadow-apple-sm transition-all">${a("financial.bot")}</span>
                </label>
            </div>
        </div>
        <div class="space-y-4 md:space-y-6">
            <div>
                <label class="${p}">${a("financial.analysisYears")}</label>
                <input type="number" id="lccYears" ${u("15")} class="${b}">
            </div>
            <div>
                <label class="${p}">${a("financial.discountRate")}</label>
                <input type="number" id="discountRate" ${u("8")} class="${b}">
            </div>
            <div id="bot-params" class="hidden p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-4 animate-fadeIn">
                <h4 class="text-sm font-semibold text-purple-800 mb-2 flex items-center"><span class="mr-2">💰</span>${a("financial.botParams")}</h4>
                <div><label class="${p}">${a("financial.annualRevenue")}</label><input type="number" id="botAnnualRevenue" ${u("150")} class="${b} border-purple-200 focus:border-purple-500 text-purple-900"></div>
                <div><label class="${p}">${a("financial.equityRatio")}</label><input type="number" id="botEquityRatio" ${u("30")} class="${b} border-purple-200 focus:border-purple-500 text-purple-900"></div>
            </div>
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${p}">${a("financial.energyInflation")}</label>
                    <input type="number" id="energyInflationRate" ${u("3")} class="${b}">
                </div>
                <div>
                    <label class="${p}">${a("financial.opexInflation")}</label>
                    <input type="number" id="opexInflationRate" ${u("5")} class="${b}">
                </div>
            </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-200 text-center pb-24">
            <p class="text-sm font-medium text-gray-700">${a("financial.author")}</p>
            <p id="usage-counter" class="text-xs text-blue-500 font-medium mt-1">${a("financial.usageCounter",{count:0})}</p>
            <p class="text-[10px] text-gray-400 mt-2 leading-tight px-4">${a("financial.disclaimer")}</p>
        </div>
    `}function Te(e){se("accordion-project",a("accordion.project"),Qe()),se("accordion-scheme",a("accordion.scheme"),et()),se("accordion-operating",a("accordion.operating"),tt()),se("accordion-financial",a("accordion.financial"),at()),je(),lt(),rt(),Pe(),ot(),nt();const t=document.getElementById("report-placeholder");t&&(t.innerHTML=`
            <div class="flex flex-col items-center justify-center p-10 opacity-60">
                <svg class="w-24 h-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-4a2 2 0 012-2h2a2 2 0 012 2v4M9 17h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <h3 class="text-2xl font-bold text-gray-400 mb-2">${a("message.noData")}</h3>
                <p class="text-gray-400">${a("message.noDataPrompt")}</p>
            </div>
        `);const s=document.getElementById("calculateBtn");s&&s.addEventListener("click",()=>{st(),e()}),it("heatingLoadUnit","heatingLoad");const n=document.getElementById("addPriceTierBtn");n&&n.addEventListener("click",()=>{Ce(),e()}),Ce("平均电价",f.electric.price,"100"),mt(),dt();const o=document.getElementById("btn-reset-params");o&&o.addEventListener("click",ct);const l=document.getElementById("enableScenarioComparison");l&&(l.addEventListener("change",()=>{const r=document.getElementById("saveScenarioBtn"),i=document.querySelector('.tab-link[data-tab="scenarios"]');l.checked?(r&&r.classList.remove("hidden"),i&&i.classList.remove("hidden")):(r&&r.classList.add("hidden"),i&&i.classList.add("hidden"))}),l.dispatchEvent(new Event("change"))),window.updateSimplePriceTier=function(r){}}function nt(){document.getElementById("scenario-table-wrapper");const e=document.getElementById("tab-scenarios");e&&(e.innerHTML=`
             <div id="scenario-table-wrapper" class="hidden overflow-x-auto">
                 <table class="min-w-full divide-y divide-gray-200" id="scenario-comparison-table">
                     <thead class="bg-gray-100">
                         <tr>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.scenarioName")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.unitSteamCost")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.savingRate")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.investment")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.annualTotalCost")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.annualSaving")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.dynamicPayback")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">IRR</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.lccTotal")}</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">${a("table.co2Reduction")}</th>
                             <th class="px-4 py-3"><span class="sr-only">${a("table.action")}</span></th>
                         </tr>
                     </thead>
                     <tbody class="bg-white divide-y divide-gray-100 text-lg font-medium"></tbody>
                 </table>
             </div>
             <div id="scenario-empty-msg" class="text-center text-gray-400 py-10 text-lg font-medium">${a("scenario.empty")}</div>
             <div class="mt-8 flex justify-end gap-4">
                 <button id="undoClearBtn" class="hidden text-base font-bold text-blue-600 hover:text-blue-800">${a("button.undo")}</button>
                 <button id="clearScenariosBtn" class="hidden text-base font-bold text-red-600 hover:text-red-800">${a("button.clear")}</button>
             </div>
        `,document.getElementById("scenario-table-wrapper"));const t=document.getElementById("saveScenarioBtn");if(t){const n=t.cloneNode(!0);t.parentNode.replaceChild(n,t),n.addEventListener("click",()=>{if(!E){alert(a("message.pleaseCalculateFirst"));return}let o=a("scenario.modePure");E.inputs.isHybridMode&&(o=a("scenario.modeHybrid")),E.inputs.isBOTMode&&(o+=a("scenario.modeBOT"));const l=E.comparisons.sort((i,c)=>c.annualSaving-i.annualSaving)[0],r={id:Date.now(),name:`${a("scenario.scenario")}${L.length+1}：${E.inputs.projectName} [${o}]`,unitSteamCost:E.hp.unitSteamCost,savingRate:l?l.savingRate:0,invest:E.hp.initialInvestment,annualTotalCost:E.hp.annualTotalCost,annualSaving:l?l.annualSaving:0,dynamicPBP:l?l.dynamicPBP:"-",irr:l?l.irr:null,lcc:E.hp.lcc.total,co2:l?l.co2Reduction:0,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};L.push(r),re(),ie("scenarios"),he&&he(a("scenario.saved"),"success")})}const s=document.getElementById("tab-scenarios");s&&(s.onclick=n=>{if(n.target.id==="clearScenariosBtn"){if(L.length===0)return;if(confirm(a("scenario.clearConfirm"))){de=[...L],L=[],re();const o=document.getElementById("undoClearBtn");o&&(o.classList.remove("hidden"),setTimeout(()=>o.classList.add("hidden"),5e3))}}n.target.id==="undoClearBtn"&&(L=[...de],de=[],re(),n.target.classList.add("hidden"))})}function re(){const e=document.querySelector("#scenario-comparison-table tbody"),t=document.getElementById("scenario-table-wrapper"),s=document.getElementById("scenario-empty-msg"),n=document.getElementById("clearScenariosBtn");if(e){if(e.innerHTML="",L.length===0){t&&t.classList.add("hidden"),s&&s.classList.remove("hidden"),n&&n.classList.add("hidden");return}t&&t.classList.remove("hidden"),s&&s.classList.add("hidden"),n&&n.classList.remove("hidden"),L.forEach((o,l)=>{const r=document.createElement("tr");r.className=l%2===0?"bg-white":"bg-gray-50",r.innerHTML=`
            <td class="px-4 py-3 text-sm font-bold text-gray-800 whitespace-nowrap">${o.name} <span class="text-xs text-gray-400 ml-1">${o.timestamp}</span></td>
            <td class="px-4 py-3 text-sm text-blue-600 font-bold whitespace-nowrap">${ae(o.unitSteamCost,1)}</td>
            <td class="px-4 py-3 text-sm text-green-600 font-bold whitespace-nowrap">${D(o.savingRate)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${k(o.invest)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${k(o.annualTotalCost)}</td>
            <td class="px-4 py-3 text-sm font-bold text-green-600 whitespace-nowrap">${k(o.annualSaving)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap text-center">${o.dynamicPBP} 年</td>
            <td class="px-4 py-3 text-sm font-bold whitespace-nowrap text-center ${o.irr>.08?"text-green-600":"text-yellow-600"}">${o.irr?D(o.irr):"-"}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${k(o.lcc)}</td>
            <td class="px-4 py-3 text-sm text-green-600 whitespace-nowrap">${me(o.co2,1)}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
                <button class="text-red-400 hover:text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded" onclick="removeScenario(${o.id})">删除</button>
            </td>
        `,e.appendChild(r)})}}window.removeScenario=function(e){L=L.filter(t=>t.id!==e),re()};function ot(){document.querySelectorAll('input[name="calcMode"]').forEach(o=>o.addEventListener("change",we)),we(),document.querySelectorAll(".comparison-toggle").forEach(o=>o.addEventListener("change",$e)),$e(),document.querySelectorAll('input[name="systemMode"]').forEach(o=>o.addEventListener("change",l=>{const r=l.target.value,i=document.getElementById("hybrid-params");r==="hybrid"?i.classList.remove("hidden"):i.classList.add("hidden")})),document.querySelectorAll('input[name="financeMode"]').forEach(o=>o.addEventListener("change",l=>{const r=l.target.value,i=document.getElementById("bot-params");r==="bot"?i.classList.remove("hidden"):i.classList.add("hidden")}))}function st(){let e=parseInt(localStorage.getItem("heat_pump_usage_count")||"0");e++,localStorage.setItem("heat_pump_usage_count",e),Pe(e)}function Pe(e=null){e===null&&(e=parseInt(localStorage.getItem("heat_pump_usage_count")||"0")),document.querySelectorAll("#usage-counter").forEach(s=>s.textContent=a("financial.usageCounter",{count:e}))}function rt(){document.querySelectorAll(".unit-converter").forEach(e=>{e.dataset.prevUnit=e.value,e.addEventListener("change",t=>{const s=e.dataset.targetInput,n=document.getElementById(s),o=e.value,l=e.dataset.prevUnit;if(n&&n.value){const r=parseFloat(n.value),i=ve[l],c=ve[o];if(i&&c){const d=r*(i/c);n.value=parseFloat(d.toPrecision(5)),n.classList.add("text-blue-600","font-bold"),n.classList.remove("text-gray-900")}}e.dataset.prevUnit=o})})}function lt(){document.querySelectorAll("input[data-default], select[data-default]").forEach(e=>{e.addEventListener("input",()=>{if(e.type==="checkbox")return;e.value!=e.dataset.default?(e.classList.add("text-blue-600","border-blue-500"),e.classList.remove("text-gray-900","border-gray-300")):(e.classList.remove("text-blue-600","border-blue-500"),e.classList.add("text-gray-900","border-gray-300"))})})}function Ce(e="",t="",s=""){const n=document.getElementById("priceTiersContainer");if(!n)return;const o=document.createElement("div");o.className="price-tier-entry flex gap-2 items-center mb-2",o.innerHTML=`
        <input type="text" class="tier-name w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="时段" value="${e}">
        <input type="number" class="tier-price w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="价格" value="${t}">
        <span class="text-gray-400 text-base font-bold">@</span>
        <input type="number" class="tier-dist w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="%" value="${s}">
        <button type="button" class="text-red-500 hover:text-red-700 px-2 text-xl font-bold remove-tier-btn transition">×</button>
    `,o.querySelector(".remove-tier-btn").addEventListener("click",()=>{var l;n.children.length>1?(o.remove(),(l=document.getElementById("calculateBtn"))==null||l.click()):alert(a("message.keepOneTier"))}),o.querySelectorAll("input").forEach(l=>{l.addEventListener("change",()=>{var r;return(r=document.getElementById("calculateBtn"))==null?void 0:r.click()})}),n.appendChild(o)}function se(e,t,s){const n=document.getElementById(e);n&&(n.innerHTML=`
        <button class="accordion-header flex justify-between items-center w-full px-4 md:px-6 py-4 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200 cursor-pointer" type="button" aria-expanded="true" aria-controls="${e}-content">
            <span class="text-lg font-semibold text-gray-900 tracking-wide">${t}</span>
            <svg class="accordion-icon w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div id="${e}-content" class="accordion-content open px-4 md:px-6 py-4 md:py-6 border-t border-gray-100">
            ${s}
        </div>
    `)}function we(){const e=document.querySelector('input[name="calcMode"]:checked').value;document.getElementById("input-group-load").classList.toggle("hidden",e==="total"),document.getElementById("input-group-hours-a").classList.toggle("hidden",e!=="annual"),document.getElementById("input-group-total").classList.toggle("hidden",e!=="total"),document.getElementById("input-group-daily").classList.toggle("hidden",e!=="daily")}function $e(){document.querySelectorAll(".comparison-toggle").forEach(e=>{const t=e.dataset.target;document.querySelectorAll(`.related-to-${t}`).forEach(n=>{const o=n.querySelectorAll("input:not(.comparison-toggle), button");e.checked?(n.classList.remove("opacity-40","grayscale"),o.forEach(l=>l.disabled=!1)):(n.classList.add("opacity-40","grayscale"),o.forEach(l=>l.disabled=!0))})})}function it(e,t,s){const n=document.getElementById(e),o=document.getElementById(t);!n||!o||n.addEventListener("change",()=>{})}function ct(){confirm(a("message.resetConfirm"))&&location.reload()}function dt(){const e=document.getElementById("export-report-btn");e&&e.addEventListener("click",()=>{if(!E){alert(a("message.pleaseCalculate"));return}buildPrintReport(E),setTimeout(()=>{window.print()},500)})}function ut(e){var C,w;const t=h=>{const B=document.getElementById(h);return B&&parseFloat(B.value)||0},s=(h,B)=>{let R=t(h);const S=document.getElementById(B);return S&&R>0?{value:R,unit:S.value}:{value:R,unit:"MJ"}},n=[];document.querySelectorAll(".price-tier-entry").forEach(h=>{n.push({name:h.querySelector(".tier-name").value,price:parseFloat(h.querySelector(".tier-price").value)||0,dist:parseFloat(h.querySelector(".tier-dist").value)||0})}),n.length===0&&n.push({name:"默认",price:.7,dist:100});const o=document.querySelector('input[name="calcMode"]:checked').value;let l=0,r=0,i=0;o==="annual"?(l=t("heatingLoad"),r=t("operatingHours"),i=l*r):o==="total"?(i=t("annualHeating"),r=t("operatingHours_B"),l=r>0?i/r:0):(l=t("heatingLoad"),r=t("dailyHours")*t("annualDays")*(t("loadFactor")/100),i=l*r);const c=((C=document.getElementById("greenPowerToggle"))==null?void 0:C.checked)||!1,d=document.querySelector('input[name="systemMode"]:checked').value==="hybrid",g=document.querySelector('input[name="financeMode"]:checked').value==="bot",m=((w=document.getElementById("hybridAuxHeaterType"))==null?void 0:w.value)||"electric";return{projectName:document.getElementById("projectName").value,analysisMode:"standard",isHybridMode:d,hybridLoadShare:d?t("hybridLoadShare"):100,hybridAuxHeaterCapex:d?t("hybridAuxHeaterCapex")*1e4:0,hybridAuxHeaterType:m,hybridAuxHeaterOpex:d?t("hybridAuxHeaterOpex")*1e4:0,isBOTMode:g,botAnnualRevenue:t("botAnnualRevenue")*1e4,botEquityRatio:t("botEquityRatio")/100,priceTiers:n,heatingLoad:l,operatingHours:r,annualHeatingDemandKWh:i,lccYears:t("lccYears"),discountRate:t("discountRate")/100,energyInflationRate:t("energyInflationRate")/100,opexInflationRate:t("opexInflationRate")/100,hpHostCapex:t("hpCapex")*1e4,hpStorageCapex:t("storageCapex")*1e4,hpSalvageRate:t("hpSalvageRate")/100,hpCop:t("hpCop"),hpOpexCost:t("hpOpexCost")*1e4,gasCalorificObj:s("gasCalorific","gasCalorificUnit"),coalCalorificObj:s("coalCalorific","coalCalorificUnit"),fuelCalorificObj:s("fuelCalorific","fuelCalorificUnit"),biomassCalorificObj:s("biomassCalorific","biomassCalorificUnit"),steamCalorificObj:s("steamCalorific","steamCalorificUnit"),gridFactor:c?0:t("gridFactor"),gasFactor:t("gasFactor"),coalFactor:t("coalFactor"),fuelFactor:t("fuelFactor"),biomassFactor:t("biomassFactor"),steamFactor:t("steamFactor"),gasBoilerCapex:t("gasBoilerCapex")*1e4,gasSalvageRate:.05,gasBoilerEfficiency:t("gasBoilerEfficiency")/100,gasPrice:t("gasPrice"),gasOpexCost:t("gasOpexCost")*1e4,fuelBoilerCapex:t("fuelBoilerCapex")*1e4,fuelSalvageRate:.05,fuelBoilerEfficiency:t("fuelBoilerEfficiency")/100,fuelPrice:t("fuelPrice"),fuelOpexCost:t("fuelOpexCost")*1e4,coalBoilerCapex:t("coalBoilerCapex")*1e4,coalSalvageRate:.05,coalBoilerEfficiency:t("coalBoilerEfficiency")/100,coalPrice:t("coalPrice"),coalOpexCost:t("coalOpexCost")*1e4,steamCapex:t("steamBoilerCapex")*1e4,steamSalvageRate:0,steamEfficiency:.98,steamPrice:t("steamPrice"),steamOpexCost:t("steamOpexCost")*1e4,compare:{gas:document.getElementById("compare_gas").checked,coal:document.getElementById("compare_coal").checked,fuel:document.getElementById("compare_fuel").checked,electric:document.getElementById("compare_electric").checked,steam:document.getElementById("compare_steam").checked,biomass:document.getElementById("compare_biomass").checked},biomassBoilerCapex:t("biomassBoilerCapex")*1e4,biomassSalvageRate:0,biomassBoilerEfficiency:t("biomassBoilerEfficiency")/100,biomassPrice:t("biomassPrice"),biomassOpexCost:t("biomassOpexCost")*1e4,electricBoilerCapex:t("electricBoilerCapex")*1e4,electricSalvageRate:.05,electricBoilerEfficiency:t("electricBoilerEfficiency")/100,electricOpexCost:t("electricOpexCost")*1e4,isGreenElectricity:c}}function pt(e){E=e,ze(),Se(),Ue();const t=document.getElementById("saveScenarioBtn");t&&(t.disabled=!1,t.classList.remove("opacity-50","cursor-not-allowed"),t.classList.add("hover:bg-gray-200"));const s=e.comparisons.sort((r,i)=>i.annualSaving-r.annualSaving)[0],n="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-semibold text-gray-900 mt-2 md:mt-3 tracking-tight truncate";if(s){U("annual-saving",`${k(s.annualSaving)} ${a("common.unit.tenThousand")}`,n);let r="--";s.irr===null||s.irr===-1/0||s.irr<-1?r=a("dataTable.cannotRecover"):r=D(s.irr),U("irr",r,n),U("pbp",`${s.dynamicPBP} ${a("dataTable.year")}`,n),U("co2-reduction",`${me(s.co2Reduction,1)} ${a("common.unit.ton")}`,n)}else U("annual-saving","--",n),U("irr","--",n);setTimeout(()=>{Je();const r=[a("scenario.modePure"),...e.comparisons.map(m=>m.name)],i=[e.hp.annualEnergyCost/1e4,...e.comparisons.map(m=>m.annualEnergyCost/1e4)],c=[e.hp.annualOpex/1e4,...e.comparisons.map(m=>m.annualOpex/1e4)],d=document.getElementById("costComparisonChart");d&&Ke(d,r,i,c);const g=document.getElementById("lccBreakdownChart");if(g){const m=e.hp.lcc;Ze(g,[m.capex/1e4,m.energy/1e4,m.opex/1e4,m.residual/1e4])}},100);const o=document.getElementById("tab-data-table");o&&(o.innerHTML=`
            <div class="overflow-x-auto pb-6">
                <table class="min-w-full text-base md:text-lg text-left text-gray-700">
                    <thead class="text-sm md:text-base font-semibold text-gray-900 uppercase bg-gray-100 border-b-2 border-gray-200">
                        <tr>
                            <th class="px-4 py-4 whitespace-nowrap">${a("table.scenarioName")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${a("table.unitSteamCost")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${a("table.savingRate")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${a("table.annualTotalCost")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">${a("table.annualSaving")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">${a("table.staticPayback")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">${a("table.dynamicPayback")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">IRR</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${a("table.lccTotalFull")}</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${a("table.co2Reduction")}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr class="bg-blue-50/50 border-b border-gray-100 font-semibold text-gray-900">
                            <td class="px-4 py-4 whitespace-nowrap">${a("dataTable.hpScheme")}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-blue-600">${ae(e.hp.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">${k(e.hp.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${k(e.hp.lcc.total)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${e.comparisons.map(r=>`
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-4 whitespace-nowrap font-semibold text-gray-800">${r.name}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${ae(r.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-semibold text-green-600">${D(r.savingRate)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${k(r.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-semibold text-green-600">${k(r.annualSaving)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-medium">${r.paybackPeriod||"-"}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-medium">${r.dynamicPBP} ${a("dataTable.year")}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-semibold text-blue-500">${r.irr===null||r.irr<-1?'<span class="text-gray-400">N/A</span>':D(r.irr)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium hidden lg:table-cell">${k(r.lccTotal)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-green-600 font-semibold hidden lg:table-cell">${me(r.co2Reduction,1)}</td>
                        </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            <p class="text-sm text-gray-400 mt-4 md:mt-6">* ${a("dataTable.note1")} ${D(e.inputs.discountRate)}。<br>* ${a("dataTable.note2")}</p>
        `);const l=document.getElementById("tab-conclusion");if(l&&s){const r=s.irr>.08;l.innerHTML=`
            <div class="p-6 md:p-8 ${r?"bg-green-50 border border-green-200":"bg-yellow-50 border border-yellow-200"} rounded-2xl">
                <h3 class="text-xl md:text-3xl font-semibold ${r?"text-green-800":"text-yellow-800"} mb-4">${a(r?"conclusion.recommend":"conclusion.average")}</h3>
                <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                    ${a("conclusion.compared")} <strong>${s.name}</strong>，${a("conclusion.hpScheme")} <strong>${k(s.annualSaving)} ${a("conclusion.yuan")}</strong>，${a("conclusion.savingRateText")} <strong>${D(s.savingRate)}</strong>。
                    <br><br>
                    ${a("conclusion.hpCost")} <strong>${ae(e.hp.unitSteamCost,1)} ${a("conclusion.perTonSteam")}</strong>，${s.name}${a("conclusion.cost")} <strong>${ae(s.unitSteamCost,1)} ${a("conclusion.perTon")}</strong>。
                    <br><br>
                    ${a("conclusion.lifetimeSaving",{years:e.inputs.lccYears})} <strong>${k(s.lccSaving)} ${a("conclusion.yuan")}</strong>。${a("conclusion.dynamicPaybackText")} ${s.dynamicPBP} ${a("dataTable.year")}。
                </p>
            </div>
        `}}let ue=null;function mt(){const e=document.getElementById("eff-calc-modal"),t=document.getElementById("eff-calc-close-btn"),s=document.getElementById("ec-calc-btn"),n=document.getElementById("ec-apply-btn"),o=document.getElementById("ec-fuel-unit");if(!e)return;const l=i=>{const c=Ae[i];c&&(i==="water"?(document.getElementById("ec-water-mass").value=c.mass,document.getElementById("ec-water-in-temp").value=c.tempIn,document.getElementById("ec-water-out-temp").value=c.tempOut):(document.getElementById("ec-steam-mass").value=c.mass,document.getElementById("ec-steam-pressure").value=c.pressure,document.getElementById("ec-steam-feed-temp").value=c.feedTemp))};document.querySelectorAll('input[name="ec-output-type"]').forEach(i=>{i.addEventListener("change",c=>{const d=c.target.value,g=document.getElementById("ec-water-params"),m=document.getElementById("ec-steam-params");d==="water"?(g.classList.remove("hidden"),m.classList.add("hidden")):(g.classList.add("hidden"),m.classList.remove("hidden")),l(d)})}),document.body.addEventListener("click",i=>{const c=i.target.closest(".eff-calc-btn");if(c){i.preventDefault();const d=c.dataset.target,g=c.dataset.fuel;ue=d;const m=document.getElementById("ec-fuel-type");m&&(m.value=g,o.textContent=g==="gas"?"m³":"kg"),document.querySelector('input[name="ec-output-type"][value="water"]').click(),e.classList.remove("hidden")}}),t&&t.addEventListener("click",()=>e.classList.add("hidden")),s&&s.addEventListener("click",()=>{const i=document.getElementById("ec-fuel-type").value,c=parseFloat(document.getElementById("ec-fuel-amount").value);let d=0;i==="gas"?d=parseFloat(document.getElementById("gasCalorific").value):i==="fuel"?d=parseFloat(document.getElementById("fuelCalorific").value):i==="coal"?d=parseFloat(document.getElementById("coalCalorific").value):i==="biomass"&&(d=parseFloat(document.getElementById("biomassCalorific").value));const g=document.querySelector('input[name="ec-output-type"]:checked').value;let m={};g==="water"?m={mass:parseFloat(document.getElementById("ec-water-mass").value),tempIn:parseFloat(document.getElementById("ec-water-in-temp").value),tempOut:parseFloat(document.getElementById("ec-water-out-temp").value)}:m={mass:parseFloat(document.getElementById("ec-steam-mass").value),pressure:parseFloat(document.getElementById("ec-steam-pressure").value),feedTemp:parseFloat(document.getElementById("ec-steam-feed-temp").value)};const C=Fe(i,c,d,g,m),w=document.getElementById("ec-result-display");C.error?(w.textContent="Error",w.className="text-3xl font-black text-red-500 tracking-tight",n.disabled=!0):(w.textContent=C.efficiency.toFixed(1)+" %",w.className="text-3xl font-semibold text-blue-500 tracking-tight",n.disabled=!1,n.dataset.value=C.efficiency.toFixed(1))}),n&&n.addEventListener("click",()=>{var i;if(ue&&n.dataset.value){const c=document.getElementById(ue);c&&(c.value=n.dataset.value,e.classList.add("hidden"),(i=document.getElementById("calculateBtn"))==null||i.click())}})}const z=e=>({gas:a("common.comparison.gas"),coal:a("common.comparison.coal"),fuel:a("common.comparison.fuel"),biomass:a("common.comparison.biomass"),electric:a("common.comparison.electric"),steam:a("common.comparison.steam")})[e]||e,Le=697.8;function V(e){if(!e||!e.value)return 0;const t=Oe[e.unit]||1;return e.value*t}function gt(e){const{heatingLoad:t,operatingHours:s,annualHeatingDemandKWh:n,lccYears:o,discountRate:l,energyInflationRate:r,opexInflationRate:i,hpHostCapex:c,hpStorageCapex:d,hpSalvageRate:g,hpCop:m,hpOpexCost:C,priceTiers:w,gridFactor:h,isHybridMode:B,hybridLoadShare:R,hybridAuxHeaterCapex:S,hybridAuxHeaterType:ne,hybridAuxHeaterOpex:M}=e;let I=0;if(w&&w.length>0){let x=0,$=0;w.forEach(v=>{$+=v.price*v.dist,x+=v.dist}),I=x>0?$/x:.7}else I=.7;const O=B?R/100:1,K=n*O,Z=n*(1-O),X=K/m,Y=X*I,oe=X*h/1e3;let H=0,A=0;if(B&&Z>0){let x=0,$=1,v=0,T=0,j="ton";switch(ne){case"gas":x=e.gasPrice,$=e.gasBoilerEfficiency,v=V(e.gasCalorificObj),T=e.gasFactor,j="m3";break;case"coal":x=e.coalPrice,$=e.coalBoilerEfficiency,v=V(e.coalCalorificObj),T=e.coalFactor,j="ton";break;case"fuel":x=e.fuelPrice,$=e.fuelBoilerEfficiency,v=V(e.fuelCalorificObj),T=e.fuelFactor,j="ton";break;case"biomass":x=e.biomassPrice,$=e.biomassBoilerEfficiency,v=V(e.biomassCalorificObj),T=e.biomassFactor,j="ton";break;case"steam":x=e.steamPrice,$=e.steamEfficiency,v=V(e.steamCalorificObj),T=e.steamFactor,j="ton";break;case"electric":default:x=I,$=e.electricBoilerEfficiency,v=3.6,T=h,j="kwh";break}if($>0&&v>0){const ce=Z*3.6/(v*$);j==="ton"?H=ce/1e3*x:H=ce*x,A=ce*T/1e3}}const q=c+d+(B?S:0),Q=Y+H,y=C+(B?M:0),_=Q+y,ee=oe+A;let N=q,W=0,te=0;for(let x=1;x<=o;x++){const $=Q*Math.pow(1+r,x-1),v=y*Math.pow(1+i,x-1),T=1/Math.pow(1+l,x);W+=$*T,te+=v*T}const ye=q*g/Math.pow(1+l,o);N=N+W+te-ye;const xe=n/Le,Me=xe>0?_/xe:0;return{avgElecPrice:I,initialInvestment:q,annualEnergyCost:Q,annualOpex:y,annualTotalCost:_,co2:ee,unitSteamCost:Me,breakdown:{hpEnergy:Y,auxEnergy:H,hpOpex:C,auxOpex:B?M:0},lcc:{total:N,capex:q,energy:W,opex:te,residual:-ye}}}function ft(e,t){const s=[],n=e.annualHeatingDemandKWh/Le,o=(l,r,i,c,d,g,m,C,w)=>{let h=0;if(typeof d=="object"?h=V(d):h=d,i<=0||h<=0)return null;let R=e.annualHeatingDemandKWh*3.6/(h*i),S=0;w==="ton"?S=R/1e3*c:S=R*c;const ne=R*m/1e3,M=S+g;let I=r;for(let y=1;y<=e.lccYears;y++){const _=S*Math.pow(1+e.energyInflationRate,y-1),ee=g*Math.pow(1+e.opexInflationRate,y-1);I+=(_+ee)/Math.pow(1+e.discountRate,y)}I-=r*C/Math.pow(1+e.discountRate,e.lccYears);const O=t.initialInvestment-r,K=M-t.annualTotalCost,Z=[-O];let X="> "+e.lccYears,Y=-O,oe=!1,H=0;for(let y=1;y<=e.lccYears;y++){const _=S*Math.pow(1+e.energyInflationRate,y-1)+g*Math.pow(1+e.opexInflationRate,y-1),ee=t.annualEnergyCost*Math.pow(1+e.energyInflationRate,y-1)+t.annualOpex*Math.pow(1+e.opexInflationRate,y-1),N=_-ee;Z.push(N),H+=N;const W=N/Math.pow(1+e.discountRate,y),te=Y;if(Y+=W,!oe&&Y>=0){const be=Math.abs(te)/W;X=(y-1+be).toFixed(1),oe=!0}}let A=null;O>0?H<O?A=null:A=bt(Z):t.annualTotalCost<M?A=9.99:A=null;const q=M>0?K/M:0,Q=n>0?M/n:0;return{name:l,initialInvestment:r,annualEnergyCost:S,annualOpex:g,annualTotalCost:M,co2:ne,lccTotal:I,annualSaving:K,savingRate:q,unitSteamCost:Q,paybackPeriod:O>0?(O/K).toFixed(1)+" "+a("dataTable.year"):a("dataTable.immediately"),dynamicPBP:X,irr:A,lccSaving:I-t.lcc.total,co2Reduction:ne-t.co2}};return e.compare.gas&&s.push(o(z("gas"),e.gasBoilerCapex,e.gasBoilerEfficiency,e.gasPrice,e.gasCalorificObj,e.gasOpexCost,e.gasFactor,e.gasSalvageRate,"m3")),e.compare.coal&&s.push(o(z("coal"),e.coalBoilerCapex,e.coalBoilerEfficiency,e.coalPrice,e.coalCalorificObj,e.coalOpexCost,e.coalFactor,e.coalSalvageRate,"ton")),e.compare.fuel&&s.push(o(z("fuel"),e.fuelBoilerCapex,e.fuelBoilerEfficiency,e.fuelPrice,e.fuelCalorificObj,e.fuelOpexCost,e.fuelFactor,e.fuelSalvageRate,"ton")),e.compare.biomass&&s.push(o(z("biomass"),e.biomassBoilerCapex,e.biomassBoilerEfficiency,e.biomassPrice,e.biomassCalorificObj,e.biomassOpexCost,e.biomassFactor,e.biomassSalvageRate,"ton")),e.compare.electric&&s.push(o(z("electric"),e.electricBoilerCapex,e.electricBoilerEfficiency,t.avgElecPrice,3.6,e.electricOpexCost,e.gridFactor,e.electricSalvageRate,"kwh")),e.compare.steam&&s.push(o(z("steam"),e.steamCapex,e.steamEfficiency,e.steamPrice,e.steamCalorificObj,e.steamOpexCost,e.steamFactor,e.steamSalvageRate,"ton")),s.filter(l=>l!==null)}function bt(e,t=.1){let o=t;for(let l=0;l<100;l++){let r=0,i=0;for(let d=0;d<e.length;d++)r+=e[d]/Math.pow(1+o,d),i-=d*e[d]/Math.pow(1+o,d+1);const c=o-r/i;if(Math.abs(c-o)<1e-6)return c;o=c}return null}function pe(){const e=ut();if(!e)return;const t=gt(e),s=ft(e,t),n={inputs:e,hp:t,comparisons:s,isHybridMode:e.isHybridMode};pt(n)}let le=null;function yt(){le&&(Te(le),setTimeout(()=>le(),500))}function xt(){const e=document.getElementById("lang-switch-btn");e&&e.addEventListener("click",()=>{const s=He()==="zh"?"en":"zh";Be(s),Re(),yt()})}function Re(){Object.entries({"page-title":"page.title","sidebar-title":"page.benefitAnalysis","sidebar-subtitle":"page.subtitle","dashboard-title":"page.dashboard","enable-comparison-label":"button.enableComparison","calculate-btn-text":"button.calculate","save-scenario-btn-text":"button.saveScenario","mobile-config-btn-text":"button.config","export-btn-text-short":"button.export","export-btn-text-full":"button.exportReport","card-annual-saving-label":"card.annualSaving","card-irr-label":"card.irr","card-pbp-label":"card.pbp","card-co2-label":"card.co2Reduction","placeholder-text":"message.pleaseConfig","chart-cost-title":"chart.annualCostComparison","chart-lcc-title":"chart.lccBreakdown"}).forEach(([t,s])=>{const n=document.getElementById(t);n&&(n.textContent=a(s))}),document.querySelectorAll("[data-i18n]").forEach(t=>{const s=t.getAttribute("data-i18n");s&&(t.textContent=a(s))}),document.querySelectorAll("option[data-i18n]").forEach(t=>{const s=t.getAttribute("data-i18n");s&&(t.textContent=a(s))})}document.addEventListener("DOMContentLoaded",()=>{console.log("Heat Pump Analyzer V9.0.0 (i18n) Initializing..."),Ne(),Re(),le=pe,Te(pe),xt(),setTimeout(()=>pe(),500)});
