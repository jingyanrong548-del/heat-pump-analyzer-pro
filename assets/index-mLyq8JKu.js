(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))l(a);new MutationObserver(a=>{for(const d of a)if(d.type==="childList")for(const n of d.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&l(n)}).observe(document,{childList:!0,subtree:!0});function r(a){const d={};return a.integrity&&(d.integrity=a.integrity),a.referrerPolicy&&(d.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?d.credentials="include":a.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function l(a){if(a.ep)return;a.ep=!0;const d=r(a);fetch(a.href,d)}})();const re={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},u={hp:{cop:3,opex:2.5},electric:{price:.7,calorific:3.6,factor:.57,boilerEff:98,opex:.4,capex:50},gas:{price:4.2,calorific:36,factor:1.97,boilerEff:92,opex:1.8,capex:80},coal:{price:1e3,calorific:21,factor:2.42,boilerEff:80,opex:6.8,capex:60},fuel:{price:8e3,calorific:42,factor:3.1,boilerEff:90,opex:1.9,capex:70},biomass:{price:850,calorific:15,factor:0,boilerEff:85,opex:6.3,capex:75},steam:{price:280,calorific:2.8,factor:.35,boilerEff:95,opex:0,capex:0}},de={water:{mass:100,tempIn:15,tempOut:60},steam:{mass:10,pressure:.8,feedTemp:20}};function g(e,t=2){const r=parseFloat(e);return isNaN(r)?"-":(r/1e4).toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function O(e,t=2){const r=parseFloat(e);return isNaN(r)?"-":r.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function D(e,t=2){const r=parseFloat(e);return isNaN(r)?"-":r.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function $(e,t=1){const r=parseFloat(e);return isNaN(r)?"-":(r*100).toFixed(t)+"%"}function ne(e,t,r,l,a){if(!t||!r)return{error:"请输入有效的燃料消耗量和热值"};const d=t*r/1e3;let n=0;if(l==="water"){const{mass:s,tempIn:c,tempOut:i}=a;if(!s||c===void 0||!i)return{error:"请输入完整的热水参数"};const p=i-c;n=4.186*(s*1e3)*p/1e6}else if(l==="steam"){const{mass:s,pressure:c,feedTemp:i}=a;if(!s||!c||i===void 0)return{error:"请输入完整的蒸汽参数"};const p=2770,f=4.186*i;n=s*1e3*(p-f)/1e6}return d<=0?{error:"计算得出的投入能量无效"}:{efficiency:n/d*100,inputEnergy:d,outputEnergy:n,error:null}}const Y={activeTab:"charts"};function se(){ce(),me(),ue(),G(Y.activeTab)}function ce(){document.querySelectorAll(".accordion-header").forEach(t=>{t.addEventListener("click",()=>{const r=t.getAttribute("aria-controls"),l=document.getElementById(r),a=t.getAttribute("aria-expanded")==="true";ie(t,l,!a)})})}function ie(e,t,r){!e||!t||(r?(t.classList.remove("hidden"),requestAnimationFrame(()=>{t.classList.add("open"),e.setAttribute("aria-expanded","true")})):(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),setTimeout(()=>{e.getAttribute("aria-expanded")==="false"&&t.classList.add("hidden")},300)))}function me(){document.querySelectorAll(".tab-link").forEach(t=>{t.addEventListener("click",r=>{r.preventDefault();const l=t.dataset.tab;l&&G(l)})})}function G(e){document.querySelectorAll(".tab-link").forEach(t=>{t.dataset.tab===e?t.classList.add("tab-active"):t.classList.remove("tab-active")}),document.querySelectorAll(".tab-content").forEach(t=>{t.id===`tab-${e}`?(t.classList.remove("hidden"),pe(t)):t.classList.add("hidden")}),Y.activeTab=e}function pe(e){e.querySelectorAll("canvas").forEach(r=>{window.dispatchEvent(new Event("resize"))})}function ue(){const e=document.getElementById("input-sidebar"),t=document.getElementById("mobile-open-config"),r=document.getElementById("mobile-sidebar-close"),l=document.getElementById("calculateBtn");if(!e)return;const a=d=>{d?(e.classList.remove("translate-y-full"),e.classList.add("translate-y-0"),document.body.style.overflow="hidden"):(e.classList.remove("translate-y-0"),e.classList.add("translate-y-full"),document.body.style.overflow="")};t&&t.addEventListener("click",()=>a(!0)),r&&r.addEventListener("click",()=>a(!1)),l&&l.addEventListener("click",()=>{window.innerWidth<768&&(a(!1),setTimeout(()=>te(),300))})}function xe(e){const t=document.getElementById("export-report-btn");t&&(t.disabled=!1,t.classList.remove("opacity-50","cursor-not-allowed"),t.classList.add("hover:bg-blue-700","shadow-md"))}function te(){const e=document.getElementById("main-results-area");e&&(e.scrollIntoView({behavior:"smooth",block:"start"}),window.scrollTo({top:0,behavior:"smooth"}))}function be(){const e=document.getElementById("report-placeholder"),t=document.getElementById("report-content");e&&e.classList.add("hidden"),t&&t.classList.remove("hidden"),G(Y.activeTab)}function M(e,t,r=null){const l=document.getElementById(`card-${e}`);l&&(l.textContent=t,r&&(l.className=l.className.replace(/text-(green|yellow|red|gray)-\d+/,""),l.classList.add(...r.split(" "))))}const x=window.innerWidth<768;Chart.defaults.font.family="'Inter', 'Noto Sans SC', sans-serif";Chart.defaults.font.size=x?11:20;Chart.defaults.color="#475569";Chart.defaults.scale.grid.color="#e2e8f0";Chart.defaults.scale.grid.lineWidth=x?1:1.5;Chart.defaults.plugins.legend.labels.font={size:x?12:22,weight:"bold"};Chart.defaults.plugins.legend.labels.boxWidth=x?12:24;Chart.defaults.plugins.legend.labels.padding=x?15:30;Chart.defaults.plugins.tooltip.backgroundColor="rgba(15, 23, 42, 0.95)";Chart.defaults.plugins.tooltip.titleFont={size:x?14:24,weight:"bold"};Chart.defaults.plugins.tooltip.bodyFont={size:x?12:20};Chart.defaults.plugins.tooltip.padding=x?10:20;Chart.defaults.plugins.tooltip.cornerRadius=x?6:12;Chart.defaults.plugins.tooltip.boxPadding=x?4:8;const B={hp:{fill:"rgba(37, 99, 235, 0.9)"},gas:{fill:"rgba(234, 88, 12, 0.9)"},fuel:{fill:"rgba(220, 38, 38, 0.9)"},coal:{fill:"rgba(71, 85, 105, 0.9)"},biomass:{fill:"rgba(22, 163, 74, 0.9)"},electric:{fill:"rgba(147, 51, 234, 0.9)"},steam:{fill:"rgba(8, 145, 178, 0.9)"},opex:"#f59e0b"};let C={cost:null,lcc:null};function ge(){C.cost&&(C.cost.destroy(),C.cost=null),C.lcc&&(C.lcc.destroy(),C.lcc=null)}function fe(e,t,r,l){const a=n=>{if(!n)return"#cbd5e1";const o=n.toLowerCase();return o.includes("热泵")||o.includes("hp")?B.hp.fill:o.includes("气")||o.includes("gas")?B.gas.fill:o.includes("油")||o.includes("fuel")||o.includes("oil")?B.fuel.fill:o.includes("煤")||o.includes("coal")?B.coal.fill:o.includes("生物")||o.includes("bio")?B.biomass.fill:o.includes("电")||o.includes("elec")?B.electric.fill:o.includes("蒸汽")||o.includes("steam")?B.steam.fill:"#9ca3af"},d=t.map(n=>a(n));return C.cost=new Chart(e,{type:"bar",data:{labels:t,datasets:[{label:"能源成本",data:r,backgroundColor:d,borderRadius:x?3:6,stack:"Stack 0",barPercentage:.5},{label:"运维成本",data:l,backgroundColor:B.opex,borderRadius:x?3:6,stack:"Stack 0",barPercentage:.5}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",align:"end",labels:{font:{size:x?11:22,weight:"bold"}}},tooltip:{callbacks:{label:n=>{let o=n.dataset.label||"";return o&&(o+=": "),n.parsed.y!==null&&(o+=parseFloat(n.parsed.y).toFixed(2)+" 万"),o},footer:n=>{let o=0;return n.forEach(function(s){o+=s.parsed.y}),"总计: "+o.toFixed(2)+" 万"}},footerFont:{size:x?12:22,weight:"bold"}}},scales:{y:{beginAtZero:!0,title:{display:!x,text:"万元/年",font:{size:18,weight:"bold"}},stacked:!0,border:{display:!1},ticks:{padding:x?5:10,font:{size:x?10:14}}},x:{stacked:!0,grid:{display:!1},ticks:{font:{size:x?11:18,weight:"bold"},maxRotation:x?45:0,minRotation:x?45:0}}}}}),C.cost}function ye(e,t){const r=t.map(l=>Math.abs(l));return C.lcc=new Chart(e,{type:"doughnut",data:{labels:["初始投资","全周期能源","全周期运维","残值回收"],datasets:[{data:r,backgroundColor:["#ef4444","#3b82f6","#f59e0b","#10b981"],borderWidth:0,hoverOffset:x?10:20}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"60%",plugins:{legend:{position:x?"bottom":"right",labels:{padding:x?15:25,font:{size:x?12:22,weight:"bold"}}},tooltip:{callbacks:{label:l=>{const a=l.raw,d=l.chart._metasets[l.datasetIndex].total,n=(a/d*100).toFixed(1)+"%",o=l.label;return o==="残值回收"?` ${o}: -${a.toFixed(1)} 万 (${n})`:` ${o}: ${a.toFixed(1)} 万 (${n})`}}}}}}),C.lcc}let V=null;const m=e=>`value="${e}" data-default="${e}"`;function he(){return`
        <div class="mb-6 md:mb-8">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">项目名称</label>
            <input type="text" id="projectName" ${m("示例项目")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl focus:ring-4 focus:ring-blue-500 focus:border-blue-500 track-change shadow-sm text-gray-600 transition-colors">
        </div>
        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-300">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">计算模式</label>
            <div class="grid grid-cols-3 gap-3 md:gap-6">
                <label class="cursor-pointer flex flex-col items-center p-3 md:p-6 border-2 md:border-4 border-gray-100 rounded-2xl md:rounded-3xl hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-600 transition-all">
                    <input type="radio" name="calcMode" value="annual" class="mb-2 md:mb-3 w-6 h-6 md:w-8 md:h-8 accent-blue-600" checked>
                    <span class="text-base md:text-2xl font-bold text-gray-800">模式A</span>
                    <span class="text-sm md:text-lg text-gray-500 mt-1 md:mt-2 font-bold">(年时)</span>
                </label>
                <label class="cursor-pointer flex flex-col items-center p-3 md:p-6 border-2 md:border-4 border-gray-100 rounded-2xl md:rounded-3xl hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-600 transition-all">
                    <input type="radio" name="calcMode" value="total" class="mb-2 md:mb-3 w-6 h-6 md:w-8 md:h-8 accent-blue-600">
                    <span class="text-base md:text-2xl font-bold text-gray-800">模式B</span>
                    <span class="text-sm md:text-lg text-gray-500 mt-1 md:mt-2 font-bold">(总量)</span>
                </label>
                <label class="cursor-pointer flex flex-col items-center p-3 md:p-6 border-2 md:border-4 border-gray-100 rounded-2xl md:rounded-3xl hover:bg-blue-50 has-[:checked]:bg-blue-100 has-[:checked]:border-blue-600 transition-all">
                    <input type="radio" name="calcMode" value="daily" class="mb-2 md:mb-3 w-6 h-6 md:w-8 md:h-8 accent-blue-600">
                    <span class="text-base md:text-2xl font-bold text-gray-800">模式C</span>
                    <span class="text-sm md:text-lg text-gray-500 mt-1 md:mt-2 font-bold">(间歇)</span>
                </label>
            </div>
        </div>
        <div id="input-group-load" class="space-y-6 md:space-y-8 mt-6 md:mt-8">
            <div>
                <label class="flex justify-between items-center text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">
                    <span>制热负荷 (设计值)</span>
                    <select id="heatingLoadUnit" class="text-xl md:text-3xl font-extrabold border-none bg-transparent p-0 text-blue-600 focus:ring-0 cursor-pointer hover:text-blue-800"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </label>
                <input type="number" id="heatingLoad" ${m("1000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-hours-a" class="space-y-6 md:space-y-8 mt-6 md:mt-8">
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">年运行小时 (h)</label>
                <input type="number" id="operatingHours" ${m("2000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" data-validation="isPositive">
            </div>
        </div>
        <div id="input-group-total" class="space-y-6 md:space-y-8 mt-6 md:mt-8 hidden">
            <div>
                <label class="flex justify-between items-center text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">
                    <span>年总加热量</span>
                    <select id="annualHeatingUnit" class="text-xl md:text-3xl font-extrabold border-none bg-transparent p-0 text-blue-600 focus:ring-0 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </label>
                <input type="number" id="annualHeating" ${m("2000000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" data-validation="isPositive">
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">年运行小时 (反推)</label>
                <input type="number" id="operatingHours_B" ${m("2000")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600" placeholder="输入小时数">
            </div>
        </div>
        <div id="input-group-daily" class="space-y-6 md:space-y-8 mt-6 md:mt-8 hidden">
            <div class="grid grid-cols-2 gap-4 md:gap-8">
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">日运行 (h)</label>
                    <input type="number" id="dailyHours" ${m("8")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">年天数 (d)</label>
                    <input type="number" id="annualDays" ${m("300")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">平均负荷率 (%)</label>
                <input type="number" id="loadFactor" ${m("70")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
        </div>
    `}function ve(){return`
        <div class="hidden">
            <input type="radio" id="modeStandard" name="schemeAMode" value="standard" checked>
        </div>
        <div class="grid grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">热泵投资 (万)</label>
                <div class="relative">
                    <input type="number" id="hpCapex" ${m(u.hp.capex||"200")} class="w-full pl-4 md:pl-6 pr-4 md:pr-10 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium focus:ring-4 focus:ring-blue-500 focus:border-blue-500 transition-shadow track-change shadow-sm text-gray-600" data-validation="isPositive">
                </div>
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">储能投资 (万)</label>
                <input type="number" id="storageCapex" ${m("0")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
        </div>
        <div class="pt-6 md:pt-8 border-t-2 border-gray-200">
             <label class="block text-lg md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center">
                <span class="w-2 md:w-3 h-6 md:h-8 bg-blue-600 rounded-full mr-3 md:mr-4"></span>对比基准配置
             </label>
             <div class="space-y-4 md:space-y-6">
                ${[{k:"gas",n:"天然气"},{k:"coal",n:"燃煤"},{k:"electric",n:"电锅炉"},{k:"steam",n:"蒸汽"},{k:"fuel",n:"燃油"},{k:"biomass",n:"生物质"}].map(e=>{const t=u[e.k].capex;return`
                    <div class="flex items-center justify-between group related-to-${e.k} transition-all duration-300 p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-transparent hover:border-blue-100 hover:bg-blue-50/50">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${e.k}" data-target="${e.k}" class="comparison-toggle h-8 w-8 md:h-10 md:w-10 text-blue-600 rounded-lg focus:ring-4 focus:ring-blue-500 track-change cursor-pointer accent-blue-600" checked>
                            <label for="compare_${e.k}" class="ml-3 md:ml-5 text-lg md:text-2xl text-gray-700 font-bold cursor-pointer select-none">${e.n}</label>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm md:text-xl text-gray-400 mr-2 md:mr-4 font-bold hidden md:inline">投资(万)</span>
                            <div class="relative w-28 md:w-44">
                                <input type="number" id="${e.k}BoilerCapex" ${m(t)} class="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg md:rounded-xl text-lg md:text-2xl text-right track-change focus:ring-2 focus:ring-blue-500 bg-white focus:bg-white transition-colors font-medium shadow-sm text-gray-600" placeholder="0">
                            </div>
                            <input type="hidden" id="${e.k}SalvageRate" value="${e.k==="steam"?0:5}">
                        </div>
                    </div>
                    `}).join("")}
             </div>
        </div>
    `}function we(){return`
        <div>
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4 tooltip-container">
                工业热泵 SPF (能效)
                <span class="tooltip-text text-sm md:text-lg p-2 md:p-4">全年综合性能系数</span>
            </label>
            <input type="number" id="hpCop" ${m(u.hp.cop)} step="0.1" class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-blue-300 bg-blue-50 rounded-xl md:rounded-2xl text-3xl md:text-4xl font-bold text-blue-800 track-change shadow-sm" data-validation="isStrictlyPositive">
        </div>

        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-200 space-y-6 md:space-y-8">
             <div>
                <div class="flex justify-between items-center mb-2 md:mb-4">
                    <label class="block text-lg md:text-2xl font-bold text-gray-700">电价配置 (元/kWh)</label>
                    <button type="button" id="addPriceTierBtn" class="text-sm md:text-lg text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-3 md:px-5 py-2 rounded-lg md:rounded-xl border-2 border-blue-100">+ 添加时段</button>
                </div>
                <div id="priceTiersContainer" class="space-y-2 md:space-y-4 mb-2 md:mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${u.electric.price}" class="track-change"> 
                
                <label class="flex items-center mt-4 cursor-pointer p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition">
                    <input type="checkbox" id="greenPowerToggle" class="h-6 w-6 text-green-600 rounded focus:ring-green-500 track-change">
                    <span class="ml-3 text-lg font-bold text-green-800">使用绿电 (零碳排放)</span>
                </label>
             </div>

             <div class="grid grid-cols-2 gap-4 md:gap-8">
                 <div class="related-to-gas">
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">气价 (元/m³)</label>
                    <input type="number" id="gasPrice" ${m(u.gas.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
                <div class="related-to-coal"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">煤价 (元/t)</label><input type="number" id="coalPrice" ${m(u.coal.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
                <div class="related-to-steam"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">汽价 (元/t)</label><input type="number" id="steamPrice" ${m(u.steam.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
                <div class="related-to-fuel"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">油价 (元/t)</label><input type="number" id="fuelPrice" ${m(u.fuel.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
                <div class="related-to-biomass"><label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">生物质 (元/t)</label><input type="number" id="biomassPrice" ${m(u.biomass.price)} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600"></div>
             </div>
        </div>

        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-200">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">锅炉效率 (%)</label>
            <div class="space-y-4 md:space-y-6">
                ${[{id:"gas",label:"气",val:u.gas.boilerEff},{id:"coal",label:"煤",val:u.coal.boilerEff},{id:"fuel",label:"油",val:u.fuel.boilerEff},{id:"biomass",label:"生物",val:u.biomass.boilerEff}].map(e=>`
                    <div class="flex items-center justify-between related-to-${e.id}">
                        <span class="text-lg md:text-2xl font-bold text-gray-600 w-12 md:w-20">${e.label}</span>
                        <div class="flex-1 flex items-center space-x-2 md:space-x-4">
                            <input type="number" id="${e.id}BoilerEfficiency" ${m(e.val)} class="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl text-lg md:text-2xl track-change shadow-sm text-gray-600">
                            <button type="button" class="eff-calc-btn text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm md:text-lg border-2 border-blue-200 font-bold transition-colors" data-target="${e.id}BoilerEfficiency" data-fuel="${e.id}">反推</button>
                        </div>
                    </div>
                `).join("")}
                <div class="hidden">
                    <input type="number" id="electricBoilerEfficiency" value="98">
                    <input type="number" id="steamEfficiency" value="98">
                </div>
            </div>
        </div>

        <div class="mt-6 md:mt-8 pt-6 border-t-2 border-dashed border-gray-200">
            <details class="group">
                <summary class="flex justify-between items-center font-bold cursor-pointer list-none text-gray-500 hover:text-blue-600 transition-colors">
                    <span class="text-lg md:text-2xl">⚙️ 高级能源参数 (热值 & 排放)</span>
                    <span class="transition group-open:rotate-180">
                        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                </summary>
                <div class="text-gray-500 mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fadeIn">
                    <div class="bg-gray-50 p-4 rounded-xl space-y-4">
                        <h4 class="font-bold text-gray-700 text-lg">电 (Electric)</h4>
                        <div class="flex justify-between items-center"><label>排放因子</label><input id="gridFactor" type="number" ${m(u.electric.factor)} class="w-24 p-2 border rounded text-right track-change text-gray-600"><span class="ml-2 text-sm">kgCO₂/kWh</span></div>
                    </div>
                    ${["gas|气|m³","coal|煤|kg","fuel|油|kg","biomass|生物|kg","steam|蒸汽|kg"].map(e=>{const[t,r,l]=e.split("|");return`
                        <div class="bg-gray-50 p-4 rounded-xl space-y-3 related-to-${t}">
                            <h4 class="font-bold text-gray-700 text-lg">${r} (${t})</h4>
                            <div class="flex justify-between items-center">
                                <label class="w-16">热值</label>
                                <div class="flex flex-1 items-center gap-2">
                                    <input id="${t}Calorific" type="number" ${m(u[t].calorific)} class="w-20 p-2 border rounded text-right track-change text-gray-600">
                                    <select id="${t}CalorificUnit" class="p-2 border rounded bg-white text-sm w-20 track-change">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                        <option value="kJ">kJ</option>
                                    </select>
                                    <span class="text-sm">/${l}</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <label class="w-16">排放</label>
                                <div class="flex flex-1 items-center gap-2">
                                    <input id="${t}Factor" type="number" ${m(u[t].factor)} class="w-20 p-2 border rounded text-right track-change text-gray-600">
                                    <span class="text-sm">kgCO₂/${l}</span>
                                </div>
                            </div>
                        </div>`}).join("")}
                </div>
            </details>
        </div>

        <div class="pt-6 md:pt-8 border-t-2 border-dashed border-gray-200">
            <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-4 md:mb-6">运维成本 (万/年)</label>
            <div class="space-y-4 md:space-y-6">
                <div class="flex items-center justify-between">
                    <span class="text-lg md:text-2xl font-bold text-blue-600 w-24 md:w-32">工业热泵</span>
                    <input type="number" id="hpOpexCost" ${m(u.hp.opex)} class="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-blue-200 bg-blue-50 rounded-xl md:rounded-2xl text-lg md:text-2xl track-change shadow-sm font-bold text-blue-800">
                </div>
                ${[{id:"gas",label:"天然气",val:u.gas.opex},{id:"coal",label:"燃煤",val:u.coal.opex},{id:"electric",label:"电锅炉",val:u.electric.opex},{id:"steam",label:"蒸汽",val:u.steam.opex},{id:"fuel",label:"燃油",val:u.fuel.opex},{id:"biomass",label:"生物质",val:u.biomass.opex}].map(e=>`
                    <div class="flex items-center justify-between related-to-${e.id}">
                        <span class="text-lg md:text-2xl font-bold text-gray-600 w-24 md:w-32">${e.label}</span>
                        <input type="number" id="${e.id}OpexCost" ${m(e.val)} class="flex-1 px-4 md:px-6 py-3 md:py-4 border-2 border-gray-300 rounded-xl md:rounded-2xl text-lg md:text-2xl track-change shadow-sm text-gray-600">
                    </div>
                `).join("")}
            </div>
        </div>
    `}function Ce(){return`
        <div class="space-y-6 md:space-y-8">
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">分析年限 (年)</label>
                <input type="number" id="lccYears" ${m("15")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
            <div>
                <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">折现率 (%)</label>
                <input type="number" id="discountRate" ${m("8")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
            </div>
            <div class="grid grid-cols-2 gap-4 md:gap-8">
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">能源涨幅(%)</label>
                    <input type="number" id="energyInflationRate" ${m("3")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
                <div>
                    <label class="block text-lg md:text-2xl font-bold text-gray-700 mb-2 md:mb-4">运维涨幅(%)</label>
                    <input type="number" id="opexInflationRate" ${m("5")} class="w-full px-4 md:px-6 py-3 md:py-5 border-2 border-gray-300 rounded-xl md:rounded-2xl text-xl md:text-3xl font-medium track-change shadow-sm text-gray-600">
                </div>
            </div>
        </div>
    `}function Ee(e){q("accordion-project","1. 项目与负荷",he()),q("accordion-scheme","2. 方案与投资",ve()),q("accordion-operating","3. 运行参数",we()),q("accordion-financial","4. 财务模型",Ce()),se(),ke();const t=document.getElementById("calculateBtn");t&&t.addEventListener("click",()=>e()),Be("heatingLoadUnit","heatingLoad"),document.querySelectorAll('input[name="calcMode"]').forEach(o=>o.addEventListener("change",Z)),Z(),document.querySelectorAll(".comparison-toggle").forEach(o=>o.addEventListener("change",Q)),Q();const a=document.getElementById("addPriceTierBtn");a&&a.addEventListener("click",()=>{X(),e()}),X("平均电价",u.electric.price,"100"),Pe(),Ie();const d=document.getElementById("btn-reset-params");d&&d.addEventListener("click",$e);const n=document.getElementById("enableScenarioComparison");n&&(n.addEventListener("change",()=>{const o=document.getElementById("saveScenarioBtn"),s=document.querySelector('.tab-link[data-tab="scenarios"]');n.checked?(o&&o.classList.remove("hidden"),s&&s.classList.remove("hidden")):(o&&o.classList.add("hidden"),s&&s.classList.add("hidden"))}),n.dispatchEvent(new Event("change"))),window.updateSimplePriceTier=function(o){}}function ke(){document.querySelectorAll("input[data-default], select[data-default]").forEach(e=>{e.addEventListener("input",()=>{if(e.type==="checkbox")return;e.value!=e.dataset.default?(e.classList.add("text-blue-600","font-bold"),e.classList.remove("text-gray-600")):(e.classList.remove("text-blue-600","font-bold"),e.classList.add("text-gray-600"))})})}function X(e="",t="",r=""){const l=document.getElementById("priceTiersContainer");if(!l)return;const a=document.createElement("div");a.className="price-tier-entry flex gap-2 md:gap-4 items-center mb-2 md:mb-4",a.innerHTML=`
        <input type="text" class="tier-name w-1/3 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl text-lg md:text-xl" placeholder="时段名" value="${e}">
        <input type="number" class="tier-price w-1/4 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl text-lg md:text-xl" placeholder="价格" value="${t}">
        <span class="text-gray-400 text-lg md:text-xl font-bold">@</span>
        <input type="number" class="tier-dist w-1/4 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg md:rounded-xl text-lg md:text-xl" placeholder="比例%" value="${r}">
        <button type="button" class="text-red-500 hover:text-red-700 px-2 md:px-4 text-2xl md:text-3xl font-bold remove-tier-btn">×</button>
    `,a.querySelector(".remove-tier-btn").addEventListener("click",()=>{var d;l.children.length>1?(a.remove(),(d=document.getElementById("calculateBtn"))==null||d.click()):alert("至少保留一个电价时段")}),a.querySelectorAll("input").forEach(d=>{d.addEventListener("change",()=>{var n;return(n=document.getElementById("calculateBtn"))==null?void 0:n.click()})}),l.appendChild(a)}function q(e,t,r){const l=document.getElementById(e);l&&(l.innerHTML=`
        <button class="accordion-header flex justify-between items-center w-full px-4 md:px-8 py-4 md:py-6 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200 cursor-pointer" type="button" aria-expanded="true" aria-controls="${e}-content">
            <span class="text-xl md:text-3xl font-extrabold text-gray-900">${t}</span>
            <svg class="accordion-icon w-6 h-6 md:w-8 md:h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div id="${e}-content" class="accordion-content open px-4 md:px-8 py-4 md:py-8 border-t-2 border-gray-100">
            ${r}
        </div>
    `)}function Z(){const e=document.querySelector('input[name="calcMode"]:checked').value;document.getElementById("input-group-load").classList.toggle("hidden",e==="total"),document.getElementById("input-group-hours-a").classList.toggle("hidden",e!=="annual"),document.getElementById("input-group-total").classList.toggle("hidden",e!=="total"),document.getElementById("input-group-daily").classList.toggle("hidden",e!=="daily")}function Q(){document.querySelectorAll(".comparison-toggle").forEach(e=>{const t=e.dataset.target;document.querySelectorAll(`.related-to-${t}`).forEach(l=>{const a=l.querySelectorAll("input:not(.comparison-toggle), button");e.checked?(l.classList.remove("opacity-40","grayscale"),a.forEach(d=>d.disabled=!1)):(l.classList.add("opacity-40","grayscale"),a.forEach(d=>d.disabled=!0))})})}function Be(e,t,r){const l=document.getElementById(e),a=document.getElementById(t);!l||!a||l.addEventListener("change",()=>{})}function $e(){confirm("确定要恢复默认参数吗？")&&location.reload()}function Ie(){const e=document.getElementById("export-report-btn");e&&e.addEventListener("click",()=>{if(!V){alert("请先进行计算");return}Le(V),setTimeout(()=>{window.print()},500)})}function Le(e){const t=document.getElementById("print-report-container");if(!t)return;const r=new Date().toLocaleString("zh-CN"),l=e.comparisons.sort((i,p)=>p.annualSaving-i.annualSaving)[0];let a="",d="";const n=document.getElementById("costComparisonChart"),o=document.getElementById("lccBreakdownChart");n&&(a=n.toDataURL()),o&&(d=o.toDataURL());let s="--";l&&(s=l.irr===null||l.irr===-1/0||l.irr<-1?"无法回收":$(l.irr));const c=`
        <div class="print-header text-center mb-8 border-b pb-4">
            <h1 class="text-3xl font-bold mb-2">工业热泵经济与环境效益分析报告</h1>
            <p class="text-sm text-gray-500">项目：${e.inputs.projectName} | 生成日期: ${r}</p>
        </div>
        <div class="print-section mb-8">
            <h3 class="text-xl font-bold border-l-4 border-black pl-3 mb-4 bg-gray-100 py-1">1. 分析结论摘要</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="border p-4 rounded"><p class="text-gray-500">年节省金额</p><p class="text-2xl font-bold">${l?g(l.annualSaving):"-"} 万</p></div>
                <div class="border p-4 rounded"><p class="text-gray-500">内部收益率 (IRR)</p><p class="text-2xl font-bold">${s}</p></div>
                <div class="border p-4 rounded"><p class="text-gray-500">动态回收期</p><p class="text-2xl font-bold">${l?l.dynamicPBP:"-"} 年</p></div>
                <div class="border p-4 rounded"><p class="text-gray-500">年碳减排</p><p class="text-2xl font-bold">${l?D(l.co2Reduction,1):"-"} 吨</p></div>
            </div>
        </div>
        <div class="print-section mb-8">
            <h3 class="text-xl font-bold border-l-4 border-black pl-3 mb-4 bg-gray-100 py-1">2. 核心图表分析</h3>
            <div class="flex justify-between items-start gap-4">
                <div style="width: 48%; border:1px solid #eee; padding:10px;"><h4 class="text-center font-bold mb-2">年度成本对比</h4><img src="${a}" style="width:100%;"></div>
                <div style="width: 48%; border:1px solid #eee; padding:10px;"><h4 class="text-center font-bold mb-2">LCC 成本构成</h4><img src="${d}" style="width:100%;"></div>
            </div>
        </div>
        <div class="print-section">
            <h3 class="text-xl font-bold border-l-4 border-black pl-3 mb-4 bg-gray-100 py-1">3. 详细数据对比表</h3>
            <table class="print-table w-full text-xs border-collapse border border-gray-300">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="border p-2">方案名称</th><th class="border p-2">折算吨汽成本</th><th class="border p-2">节能率</th><th class="border p-2">投资(万)</th><th class="border p-2">年总成本</th><th class="border p-2">年节省</th><th class="border p-2">回收期(年)</th><th class="border p-2">IRR</th><th class="border p-2">LCC总值</th><th class="border p-2">减排(t)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border p-2 font-bold">工业热泵</td><td class="border p-2">${O(e.hp.unitSteamCost,1)}</td><td class="border p-2">-</td><td class="border p-2">${g(e.hp.initialInvestment)}</td><td class="border p-2">${g(e.hp.annualTotalCost)}</td><td class="border p-2">-</td><td class="border p-2">-</td><td class="border p-2">-</td><td class="border p-2">${g(e.hp.lcc.total)}</td><td class="border p-2">-</td>
                    </tr>
                    ${e.comparisons.map(i=>`<tr><td class="border p-2">${i.name}</td><td class="border p-2">${O(i.unitSteamCost,1)}</td><td class="border p-2 font-bold">${$(i.savingRate)}</td><td class="border p-2">${g(i.initialInvestment)}</td><td class="border p-2">${g(i.annualTotalCost)}</td><td class="border p-2 font-bold">${g(i.annualSaving)}</td><td class="border p-2">${i.dynamicPBP}</td><td class="border p-2">${i.irr===null||i.irr<-1?"N/A":$(i.irr)}</td><td class="border p-2">${g(i.lccTotal)}</td><td class="border p-2">${D(i.co2Reduction,1)}</td></tr>`).join("")}
                </tbody>
            </table>
        </div>
        <div class="mt-8 text-xs text-gray-400 text-center border-t pt-2">Powered by Phoenix Plan V18.5</div>
    `;t.innerHTML=c}function Se(e){var c;const t=i=>{const p=document.getElementById(i);return p&&parseFloat(p.value)||0},r=(i,p)=>{let f=t(i);const h=document.getElementById(p);return h&&f>0?{value:f,unit:h.value}:{value:f,unit:"MJ"}},l=[];document.querySelectorAll(".price-tier-entry").forEach(i=>{l.push({name:i.querySelector(".tier-name").value,price:parseFloat(i.querySelector(".tier-price").value)||0,dist:parseFloat(i.querySelector(".tier-dist").value)||0})}),l.length===0&&l.push({name:"默认",price:.7,dist:100});const a=document.querySelector('input[name="calcMode"]:checked').value;let d=0,n=0,o=0;a==="annual"?(d=t("heatingLoad"),n=t("operatingHours"),o=d*n):a==="total"?(o=t("annualHeating"),n=t("operatingHours_B"),d=n>0?o/n:0):(d=t("heatingLoad"),n=t("dailyHours")*t("annualDays")*(t("loadFactor")/100),o=d*n);const s=((c=document.getElementById("greenPowerToggle"))==null?void 0:c.checked)||!1;return{projectName:document.getElementById("projectName").value,analysisMode:"standard",isHybridMode:!1,priceTiers:l,heatingLoad:d,operatingHours:n,annualHeatingDemandKWh:o,lccYears:t("lccYears"),discountRate:t("discountRate")/100,energyInflationRate:t("energyInflationRate")/100,opexInflationRate:t("opexInflationRate")/100,hpHostCapex:t("hpCapex")*1e4,hpStorageCapex:t("storageCapex")*1e4,hpSalvageRate:t("hpSalvageRate")/100,hpCop:t("hpCop"),hpOpexCost:t("hpOpexCost")*1e4,gasCalorificObj:r("gasCalorific","gasCalorificUnit"),coalCalorificObj:r("coalCalorific","coalCalorificUnit"),fuelCalorificObj:r("fuelCalorific","fuelCalorificUnit"),biomassCalorificObj:r("biomassCalorific","biomassCalorificUnit"),steamCalorificObj:r("steamCalorific","steamCalorificUnit"),gridFactor:s?0:t("gridFactor"),gasFactor:t("gasFactor"),coalFactor:t("coalFactor"),fuelFactor:t("fuelFactor"),biomassFactor:t("biomassFactor"),steamFactor:t("steamFactor"),gasBoilerCapex:t("gasBoilerCapex")*1e4,gasSalvageRate:.05,gasBoilerEfficiency:t("gasBoilerEfficiency")/100,gasPrice:t("gasPrice"),gasOpexCost:t("gasOpexCost")*1e4,fuelBoilerCapex:t("fuelBoilerCapex")*1e4,fuelSalvageRate:.05,fuelBoilerEfficiency:t("fuelBoilerEfficiency")/100,fuelPrice:t("fuelPrice"),fuelOpexCost:t("fuelOpexCost")*1e4,coalBoilerCapex:t("coalBoilerCapex")*1e4,coalSalvageRate:.05,coalBoilerEfficiency:t("coalBoilerEfficiency")/100,coalPrice:t("coalPrice"),coalOpexCost:t("coalOpexCost")*1e4,steamCapex:t("steamCapex")*1e4,steamSalvageRate:0,steamEfficiency:.98,steamPrice:t("steamPrice"),steamOpexCost:t("steamOpexCost")*1e4,compare:{gas:document.getElementById("compare_gas").checked,coal:document.getElementById("compare_coal").checked,fuel:document.getElementById("compare_fuel").checked,electric:document.getElementById("compare_electric").checked,steam:document.getElementById("compare_steam").checked,biomass:document.getElementById("compare_biomass").checked},biomassBoilerCapex:t("biomassBoilerCapex")*1e4,biomassSalvageRate:0,biomassBoilerEfficiency:t("biomassBoilerEfficiency")/100,biomassPrice:t("biomassPrice"),biomassOpexCost:t("biomassOpexCost")*1e4,electricBoilerCapex:t("electricBoilerCapex")*1e4,electricSalvageRate:.05,electricBoilerEfficiency:t("electricBoilerEfficiency")/100,electricOpexCost:t("electricOpexCost")*1e4,isGreenElectricity:s}}function Re(e){V=e,be(),te(),xe();const t=e.comparisons.sort((a,d)=>d.annualSaving-a.annualSaving)[0];if(t){M("annual-saving",`${g(t.annualSaving)} 万`);let a="--",d="text-gray-500";t.irr===null||t.irr===-1/0||t.irr<-1?(a="无法回收",d="text-gray-500"):(a=$(t.irr),d=t.irr>.08?"text-green-600":t.irr>0?"text-yellow-600":"text-gray-500"),M("irr",a,d),M("pbp",`${t.dynamicPBP} 年`),M("co2-reduction",`${D(t.co2Reduction,1)} 吨`)}else M("annual-saving","--"),M("irr","--");setTimeout(()=>{ge();const a=["热泵",...e.comparisons.map(c=>c.name)],d=[e.hp.annualEnergyCost/1e4,...e.comparisons.map(c=>c.annualEnergyCost/1e4)],n=[e.hp.annualOpex/1e4,...e.comparisons.map(c=>c.annualOpex/1e4)],o=document.getElementById("costComparisonChart");o&&fe(o,a,d,n);const s=document.getElementById("lccBreakdownChart");if(s){const c=e.hp.lcc;ye(s,[c.capex/1e4,c.energy/1e4,c.opex/1e4,c.residual/1e4])}},100);const r=document.getElementById("tab-data-table");r&&(r.innerHTML=`
            <div class="overflow-x-auto pb-6">
                <table class="min-w-full text-base md:text-xl text-left text-gray-700">
                    <thead class="text-sm md:text-lg font-extrabold text-gray-900 uppercase bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap">方案名称</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">折算吨汽成本(元)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">综合节能率</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">年总成本(万)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">年节省(万)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">动态回收期</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">IRR</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">LCC总值(万)</th>
                            <th class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">碳减排(吨)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y-2 divide-gray-100">
                        <tr class="bg-blue-50/50 border-b-2 border-gray-200 font-bold text-gray-900">
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap">工业热泵 (本方案)</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right text-blue-800">${O(e.hp.unitSteamCost,1)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">${g(e.hp.annualTotalCost)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center">-</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">${g(e.hp.lcc.total)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${e.comparisons.map(a=>`
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap font-bold text-gray-800">${a.name}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-medium">${O(a.unitSteamCost,1)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-bold text-green-600">${$(a.savingRate)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-medium">${g(a.annualTotalCost)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-bold text-green-600">${g(a.annualSaving)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center font-medium">${a.dynamicPBP} 年</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-center font-bold text-blue-600">${a.irr===null||a.irr<-1?'<span class="text-gray-400">N/A</span>':$(a.irr)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right font-medium hidden lg:table-cell">${g(a.lccTotal)}</td>
                            <td class="px-3 py-3 md:px-6 md:py-6 whitespace-nowrap text-right text-green-600 font-bold hidden lg:table-cell">${D(a.co2Reduction,1)}</td>
                        </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            <p class="text-sm md:text-lg text-gray-400 mt-4 md:mt-6">* 注：LCC (全生命周期成本) 已包含资金时间价值，折现率 ${$(e.inputs.discountRate)}。<br>* 折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。</p>
        `);const l=document.getElementById("tab-conclusion");if(l&&t){const a=t.irr>.08;l.innerHTML=`
            <div class="p-6 md:p-10 ${a?"bg-green-50 border-2 border-green-200":"bg-yellow-50 border-2 border-yellow-200"} border rounded-2xl md:rounded-3xl">
                <h3 class="text-2xl md:text-4xl font-extrabold ${a?"text-green-800":"text-yellow-800"} mb-4 md:mb-6">${a?"🚀 推荐投资":"⚖️ 投资回报一般"}</h3>
                <p class="text-lg md:text-2xl text-gray-700 leading-relaxed font-medium">
                    相比于 <strong>${t.name}</strong>，工业热泵方案预计每年可节省 <strong>${g(t.annualSaving)} 万元</strong>，综合费用节能率达 <strong>${$(t.savingRate)}</strong>。
                    <br><br>
                    您的热泵供热成本相当于 <strong>${O(e.hp.unitSteamCost,1)} 元/吨蒸汽</strong>，而${t.name}的成本为 <strong>${O(t.unitSteamCost,1)} 元/吨</strong>。
                    <br><br>
                    全生命周期（${e.inputs.lccYears}年）累计节省 <strong>${g(t.lccSaving)} 万元</strong>。动态回收期为 ${t.dynamicPBP} 年。
                </p>
            </div>`}}let J=null;function Pe(){const e=document.getElementById("eff-calc-modal"),t=document.getElementById("eff-calc-close-btn"),r=document.getElementById("ec-calc-btn"),l=document.getElementById("ec-apply-btn"),a=document.getElementById("ec-fuel-unit");if(!e)return;const d=o=>{const s=de[o];s&&(o==="water"?(document.getElementById("ec-water-mass").value=s.mass,document.getElementById("ec-water-in-temp").value=s.tempIn,document.getElementById("ec-water-out-temp").value=s.tempOut):(document.getElementById("ec-steam-mass").value=s.mass,document.getElementById("ec-steam-pressure").value=s.pressure,document.getElementById("ec-steam-feed-temp").value=s.feedTemp))};document.querySelectorAll('input[name="ec-output-type"]').forEach(o=>{o.addEventListener("change",s=>{const c=s.target.value,i=document.getElementById("ec-water-params"),p=document.getElementById("ec-steam-params");c==="water"?(i.classList.remove("hidden"),p.classList.add("hidden")):(i.classList.add("hidden"),p.classList.remove("hidden")),d(c)})}),document.body.addEventListener("click",o=>{const s=o.target.closest(".eff-calc-btn");if(s){o.preventDefault();const c=s.dataset.target,i=s.dataset.fuel;J=c;const p=document.getElementById("ec-fuel-type");p&&(p.value=i,a.textContent=i==="gas"?"m³":"kg"),document.querySelector('input[name="ec-output-type"][value="water"]').click(),e.classList.remove("hidden")}}),t&&t.addEventListener("click",()=>e.classList.add("hidden")),r&&r.addEventListener("click",()=>{const o=document.getElementById("ec-fuel-type").value,s=parseFloat(document.getElementById("ec-fuel-amount").value);let c=0;o==="gas"?c=parseFloat(document.getElementById("gasCalorific").value):o==="fuel"?c=parseFloat(document.getElementById("fuelCalorific").value):o==="coal"?c=parseFloat(document.getElementById("coalCalorific").value):o==="biomass"&&(c=parseFloat(document.getElementById("biomassCalorific").value));const i=document.querySelector('input[name="ec-output-type"]:checked').value;let p={};i==="water"?p={mass:parseFloat(document.getElementById("ec-water-mass").value),tempIn:parseFloat(document.getElementById("ec-water-in-temp").value),tempOut:parseFloat(document.getElementById("ec-water-out-temp").value)}:p={mass:parseFloat(document.getElementById("ec-steam-mass").value),pressure:parseFloat(document.getElementById("ec-steam-pressure").value),feedTemp:parseFloat(document.getElementById("ec-steam-feed-temp").value)};const f=ne(o,s,c,i,p),h=document.getElementById("ec-result-display");f.error?(h.textContent="Error",h.className="text-3xl font-black text-red-500 tracking-tight",l.disabled=!0):(h.textContent=f.efficiency.toFixed(1)+" %",h.className="text-3xl font-black text-blue-600 tracking-tight",l.disabled=!1,l.dataset.value=f.efficiency.toFixed(1))}),l&&l.addEventListener("click",()=>{var o;if(J&&l.dataset.value){const s=document.getElementById(J);s&&(s.value=l.dataset.value,e.classList.add("hidden"),(o=document.getElementById("calculateBtn"))==null||o.click())}})}const ae=697.8;function Fe(e){if(!e||!e.value)return 0;const t=re[e.unit]||1;return e.value*t}function Te(e){const{heatingLoad:t,operatingHours:r,annualHeatingDemandKWh:l,lccYears:a,discountRate:d,energyInflationRate:n,opexInflationRate:o,hpHostCapex:s,hpStorageCapex:c,hpSalvageRate:i,hpCop:p,hpOpexCost:f,priceTiers:h,gridFactor:R}=e;let A=0;if(h&&h.length>0){let y=0,T=0;h.forEach(S=>{T+=S.price*S.dist,y+=S.dist}),A=y>0?T/y:.7}else A=.7;const I=l/p,v=I*A,j=I*R/1e3,E=v+f,k=s+c;let w=k,L=0,P=0;for(let y=1;y<=a;y++){const T=v*Math.pow(1+n,y-1),S=f*Math.pow(1+o,y-1),b=1/Math.pow(1+d,y);L+=T*b,P+=S*b}const F=k*i/Math.pow(1+d,a);w=w+L+P-F;const N=l/ae,H=N>0?E/N:0;return{avgElecPrice:A,initialInvestment:k,annualEnergyCost:v,annualOpex:f,annualTotalCost:E,co2:j,unitSteamCost:H,lcc:{total:w,capex:k,energy:L,opex:P,residual:-F}}}function Me(e,t){const r=[],l=e.annualHeatingDemandKWh/ae,a=(d,n,o,s,c,i,p,f,h)=>{let R=0;if(typeof c=="object"?R=Fe(c):R=c,o<=0||R<=0)return null;let I=e.annualHeatingDemandKWh*3.6/(R*o),v=0;h==="ton"?v=I/1e3*s:v=I*s;const j=I*p/1e3,E=v+i;let k=n;for(let b=1;b<=e.lccYears;b++){const z=v*Math.pow(1+e.energyInflationRate,b-1),_=i*Math.pow(1+e.opexInflationRate,b-1);k+=(z+_)/Math.pow(1+e.discountRate,b)}k-=n*f/Math.pow(1+e.discountRate,e.lccYears);const w=t.initialInvestment-n,L=E-t.annualTotalCost,P=[-w];let W="> "+e.lccYears,F=-w,N=!1,H=0;for(let b=1;b<=e.lccYears;b++){const z=v*Math.pow(1+e.energyInflationRate,b-1)+i*Math.pow(1+e.opexInflationRate,b-1),_=t.annualEnergyCost*Math.pow(1+e.energyInflationRate,b-1)+t.annualOpex*Math.pow(1+e.opexInflationRate,b-1),U=z-_;P.push(U),H+=U;const K=U/Math.pow(1+e.discountRate,b),le=F;if(F+=K,!N&&F>=0){const oe=Math.abs(le)/K;W=(b-1+oe).toFixed(1),N=!0}}let y=null;w>0?H<w?y=null:y=Oe(P):t.annualTotalCost<E?y=9.99:y=null;const T=E>0?L/E:0,S=l>0?E/l:0;return{name:d,initialInvestment:n,annualEnergyCost:v,annualOpex:i,annualTotalCost:E,co2:j,lccTotal:k,annualSaving:L,savingRate:T,unitSteamCost:S,paybackPeriod:w>0?(w/L).toFixed(1)+" 年":"立即",dynamicPBP:W,irr:y,lccSaving:k-t.lcc.total,co2Reduction:j-t.co2}};return e.compare.gas&&r.push(a("天然气锅炉",e.gasBoilerCapex,e.gasBoilerEfficiency,e.gasPrice,e.gasCalorificObj,e.gasOpexCost,e.gasFactor,e.gasSalvageRate,"m3")),e.compare.coal&&r.push(a("燃煤锅炉",e.coalBoilerCapex,e.coalBoilerEfficiency,e.coalPrice,e.coalCalorificObj,e.coalOpexCost,e.coalFactor,e.coalSalvageRate,"ton")),e.compare.fuel&&r.push(a("燃油锅炉",e.fuelBoilerCapex,e.fuelBoilerEfficiency,e.fuelPrice,e.fuelCalorificObj,e.fuelOpexCost,e.fuelFactor,e.fuelSalvageRate,"ton")),e.compare.biomass&&r.push(a("生物质锅炉",e.biomassBoilerCapex,e.biomassBoilerEfficiency,e.biomassPrice,e.biomassCalorificObj,e.biomassOpexCost,e.biomassFactor,e.biomassSalvageRate,"ton")),e.compare.electric&&r.push(a("电锅炉",e.electricBoilerCapex,e.electricBoilerEfficiency,t.avgElecPrice,3.6,e.electricOpexCost,e.gridFactor,e.electricSalvageRate,"kwh")),e.compare.steam&&r.push(a("管网蒸汽",e.steamCapex,e.steamEfficiency,e.steamPrice,e.steamCalorificObj,e.steamOpexCost,e.steamFactor,e.steamSalvageRate,"ton")),r.filter(d=>d!==null)}function Oe(e,t=.1){let a=t;for(let d=0;d<100;d++){let n=0,o=0;for(let c=0;c<e.length;c++)n+=e[c]/Math.pow(1+a,c),o-=c*e[c]/Math.pow(1+a,c+1);const s=a-n/o;if(Math.abs(s-a)<1e-6)return s;a=s}return null}function ee(){const e=Se();if(!e)return;const t=Te(e),r=Me(e,t);Re({inputs:e,hp:t,comparisons:r,isHybridMode:!1})}document.addEventListener("DOMContentLoaded",()=>{console.log("Phoenix Plan V18.5 Engine (Corrected Units) Initializing..."),Ee(ee),setTimeout(()=>ee(),500)});
