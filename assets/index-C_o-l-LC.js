(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();const ie={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},p={hp:{cop:3,opex:2.5},electric:{price:.7,calorific:3.6,factor:.57,boilerEff:98,opex:.4,capex:50},gas:{price:4.2,calorific:36,factor:1.97,boilerEff:92,opex:1.8,capex:80},coal:{price:1e3,calorific:21,factor:2.42,boilerEff:80,opex:6.8,capex:60},fuel:{price:8e3,calorific:42,factor:3.1,boilerEff:90,opex:1.9,capex:70},biomass:{price:850,calorific:15,factor:0,boilerEff:85,opex:6.3,capex:75},steam:{price:280,calorific:2.8,factor:.35,boilerEff:95,opex:0,capex:0}},ce={water:{mass:100,tempIn:15,tempOut:60},steam:{mass:10,pressure:.8,feedTemp:20}};function B(e,t=2){const o=parseFloat(e);return isNaN(o)?"-":(o/1e4).toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function q(e,t=2){const o=parseFloat(e);return isNaN(o)?"-":o.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function X(e,t=2){const o=parseFloat(e);return isNaN(o)?"-":o.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function j(e,t=1){const o=parseFloat(e);return isNaN(o)?"-":(o*100).toFixed(t)+"%"}function de(e,t,o,s,n){if(!t||!o)return{error:"请输入有效的燃料消耗量和热值"};const a=t*o/1e3;let r=0;if(s==="water"){const{mass:i,tempIn:d,tempOut:c}=n;if(!i||d===void 0||!c)return{error:"请输入完整的热水参数"};const g=c-d;r=4.186*(i*1e3)*g/1e6}else if(s==="steam"){const{mass:i,pressure:d,feedTemp:c}=n;if(!i||!d||c===void 0)return{error:"请输入完整的蒸汽参数"};const g=2770,y=4.186*c;r=i*1e3*(g-y)/1e6}return a<=0?{error:"计算得出的投入能量无效"}:{efficiency:r/a*100,inputEnergy:a,outputEnergy:r,error:null}}const V={activeTab:"charts"};function ue(){pe(),ge(),me(),K(V.activeTab)}function pe(){document.querySelectorAll(".accordion-header").forEach(t=>{t.addEventListener("click",()=>{const o=t.getAttribute("aria-controls"),s=document.getElementById(o),n=t.getAttribute("aria-expanded")==="true";fe(t,s,!n)})})}function fe(e,t,o){!e||!t||(o?(t.classList.remove("hidden"),requestAnimationFrame(()=>{t.classList.add("open"),e.setAttribute("aria-expanded","true")})):(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),setTimeout(()=>{e.getAttribute("aria-expanded")==="false"&&t.classList.add("hidden")},300)))}function ge(){document.querySelectorAll(".tab-link").forEach(t=>{t.addEventListener("click",o=>{o.preventDefault();const s=t.dataset.tab;s&&K(s)})})}function K(e){document.querySelectorAll(".tab-link").forEach(t=>{t.dataset.tab===e?t.classList.add("tab-active"):t.classList.remove("tab-active")}),document.querySelectorAll(".tab-content").forEach(t=>{t.id===`tab-${e}`?(t.classList.remove("hidden"),be(t)):t.classList.add("hidden")}),V.activeTab=e}function be(e){e.querySelectorAll("canvas").forEach(o=>{window.dispatchEvent(new Event("resize"))})}function me(){const e=document.getElementById("input-sidebar"),t=document.getElementById("mobile-open-config"),o=document.getElementById("mobile-sidebar-close"),s=document.getElementById("calculateBtn");if(!e)return;const n=a=>{a?(e.classList.remove("translate-y-full"),e.classList.add("translate-y-0"),document.body.style.overflow="hidden"):(e.classList.remove("translate-y-0"),e.classList.add("translate-y-full"),document.body.style.overflow="")};t&&t.addEventListener("click",()=>n(!0)),o&&o.addEventListener("click",()=>n(!1)),s&&s.addEventListener("click",()=>{window.innerWidth<768&&(n(!1),setTimeout(()=>le(),300))})}function ye(e){const t=document.getElementById("export-report-btn");t&&(t.disabled=!1,t.classList.remove("opacity-50","cursor-not-allowed"),t.classList.add("hover:bg-blue-700","shadow-md"))}function le(){const e=document.getElementById("main-results-area");e&&(e.scrollIntoView({behavior:"smooth",block:"start"}),window.scrollTo({top:0,behavior:"smooth"}))}function xe(){const e=document.getElementById("report-placeholder"),t=document.getElementById("report-content");e&&e.classList.add("hidden"),t&&t.classList.remove("hidden"),K(V.activeTab)}function O(e,t,o=null){const s=document.getElementById(`card-${e}`);s&&(s.textContent=t,o&&(s.className=s.className.replace(/text-(green|yellow|red|gray)-\d+/,""),s.classList.add(...o.split(" "))))}const M=window.innerWidth<768,oe=M?11:16,he=M?12:18,ve=M?14:20;Chart.defaults.font.family="'Inter', 'Noto Sans SC', sans-serif";Chart.defaults.font.size=oe;Chart.defaults.color="#475569";Chart.defaults.scale.grid.color="#e2e8f0";Chart.defaults.scale.grid.lineWidth=1;Chart.defaults.plugins.legend.labels.font={size:he,weight:"bold"};Chart.defaults.plugins.legend.labels.boxWidth=M?12:20;Chart.defaults.plugins.legend.labels.padding=M?10:25;Chart.defaults.plugins.tooltip.backgroundColor="rgba(15, 23, 42, 0.95)";Chart.defaults.plugins.tooltip.titleFont={size:ve,weight:"bold"};Chart.defaults.plugins.tooltip.bodyFont={size:oe};Chart.defaults.plugins.tooltip.padding=12;Chart.defaults.plugins.tooltip.cornerRadius=8;const k={hp:{fill:"rgba(37, 99, 235, 0.9)"},gas:{fill:"rgba(234, 88, 12, 0.9)"},fuel:{fill:"rgba(220, 38, 38, 0.9)"},coal:{fill:"rgba(71, 85, 105, 0.9)"},biomass:{fill:"rgba(22, 163, 74, 0.9)"},electric:{fill:"rgba(147, 51, 234, 0.9)"},steam:{fill:"rgba(8, 145, 178, 0.9)"},opex:"#f59e0b"};let w={cost:null,lcc:null};function Ee(){w.cost&&(w.cost.destroy(),w.cost=null),w.lcc&&(w.lcc.destroy(),w.lcc=null)}function we(e,t,o,s){const n=r=>{if(!r)return"#cbd5e1";const l=r.toLowerCase();return l.includes("热泵")||l.includes("hp")?k.hp.fill:l.includes("气")||l.includes("gas")?k.gas.fill:l.includes("油")||l.includes("fuel")||l.includes("oil")?k.fuel.fill:l.includes("煤")||l.includes("coal")?k.coal.fill:l.includes("生物")||l.includes("bio")?k.biomass.fill:l.includes("电")||l.includes("elec")?k.electric.fill:l.includes("蒸汽")||l.includes("steam")?k.steam.fill:"#9ca3af"},a=t.map(r=>n(r));return w.cost=new Chart(e,{type:"bar",data:{labels:t,datasets:[{label:"能源成本",data:o,backgroundColor:a,borderRadius:4,stack:"Stack 0",barPercentage:.6},{label:"运维成本",data:s,backgroundColor:k.opex,borderRadius:4,stack:"Stack 0",barPercentage:.6}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",align:"end"},tooltip:{callbacks:{label:r=>{let l=r.dataset.label||"";return l&&(l+=": "),r.parsed.y!==null&&(l+=parseFloat(r.parsed.y).toFixed(2)+" 万"),l},footer:r=>{let l=0;return r.forEach(function(i){l+=i.parsed.y}),"总计: "+l.toFixed(2)+" 万"}}}},scales:{y:{beginAtZero:!0,title:{display:!M,text:"万元/年",font:{size:14,weight:"bold"}},stacked:!0,border:{display:!1},ticks:{padding:10}},x:{stacked:!0,grid:{display:!1},ticks:{font:{weight:"bold"},maxRotation:45,minRotation:0}}}}}),w.cost}function Ce(e,t){const o=t.map(s=>Math.abs(s));return w.lcc=new Chart(e,{type:"doughnut",data:{labels:["初始投资","全周期能源","全周期运维","残值回收"],datasets:[{data:o,backgroundColor:["#ef4444","#3b82f6","#f59e0b","#10b981"],borderWidth:0,hoverOffset:15}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"60%",plugins:{legend:{position:"right",labels:{padding:20}},tooltip:{callbacks:{label:s=>{const n=s.raw,a=s.chart._metasets[s.datasetIndex].total,r=(n/a*100).toFixed(1)+"%",l=s.label;return l==="残值回收"?` ${l}: -${n.toFixed(1)} 万 (${r})`:` ${l}: ${n.toFixed(1)} 万 (${r})`}}}}}}),w.lcc}let G=null;const u=e=>`value="${e}" data-default="${e}"`,b="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-lg font-bold text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder-gray-400 h-12 shadow-sm",f="block text-sm font-bold text-gray-600 mb-2 tracking-wide",$e="bg-white p-1 mb-6";function Be(){return`
        <div class="${$e}">
            <label class="${f}">项目名称</label>
            <input type="text" id="projectName" ${u("示例项目")} class="${b}">
        </div>

        <div class="pt-6 border-t border-gray-200">
            <label class="${f} mb-4">计算模式</label>
            <div class="grid grid-cols-3 gap-3">
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="annual" class="peer sr-only" checked>
                    <div class="p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 A</span>
                        <span class="text-xs text-gray-500 mt-1">年时法</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="total" class="peer sr-only">
                    <div class="p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 B</span>
                        <span class="text-xs text-gray-500 mt-1">总量法</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="daily" class="peer sr-only">
                    <div class="p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 C</span>
                        <span class="text-xs text-gray-500 mt-1">间歇法</span>
                    </div>
                </label>
            </div>
        </div>

        <div id="input-group-load" class="space-y-6 mt-6">
            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="${f} !mb-0">制热负荷 (设计值)</label>
                    <select id="heatingLoadUnit" class="text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer hover:bg-blue-100 transition"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </div>
                <input type="number" id="heatingLoad" ${u("1000")} class="${b}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-hours-a" class="space-y-6 mt-6">
            <div>
                <label class="${f}">年运行小时 (h)</label>
                <input type="number" id="operatingHours" ${u("2000")} class="${b}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-total" class="space-y-6 mt-6 hidden">
            <div>
                <div class="flex justify-between items-center mb-2">
                    <label class="${f} !mb-0">年总加热量</label>
                    <select id="annualHeatingUnit" class="text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </div>
                <input type="number" id="annualHeating" ${u("2000000")} class="${b}" data-validation="isPositive">
            </div>
            <div>
                <label class="${f}">年运行小时 (反推)</label>
                <input type="number" id="operatingHours_B" ${u("2000")} class="${b}" placeholder="自动计算">
            </div>
        </div>

        <div id="input-group-daily" class="space-y-6 mt-6 hidden">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="${f}">日运行 (h)</label>
                    <input type="number" id="dailyHours" ${u("8")} class="${b}">
                </div>
                <div>
                    <label class="${f}">年天数 (d)</label>
                    <input type="number" id="annualDays" ${u("300")} class="${b}">
                </div>
            </div>
            <div>
                <label class="${f}">平均负荷率 (%)</label>
                <input type="number" id="loadFactor" ${u("70")} class="${b}">
            </div>
        </div>
    `}function ke(){return`
        <div class="hidden">
            <input type="radio" id="modeStandard" name="schemeAMode" value="standard" checked>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-8">
            <div>
                <label class="${f}">热泵投资 (万)</label>
                <input type="number" id="hpCapex" ${u(p.hp.capex||"200")} class="${b}" data-validation="isPositive">
            </div>
            <div>
                <label class="${f}">储能投资 (万)</label>
                <input type="number" id="storageCapex" ${u("0")} class="${b}">
            </div>
        </div>
        <div class="pt-6 border-t border-gray-200">
             <label class="block text-base font-bold text-gray-800 mb-4 flex items-center">
                <span class="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></span>对比基准配置
             </label>
             <div class="space-y-3">
                ${[{k:"gas",n:"天然气"},{k:"coal",n:"燃煤"},{k:"electric",n:"电锅炉"},{k:"steam",n:"蒸汽"},{k:"fuel",n:"燃油"},{k:"biomass",n:"生物质"}].map(e=>{const t=p[e.k].capex;return`
                    <div class="flex items-center justify-between group related-to-${e.k} transition-all duration-200 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${e.k}" data-target="${e.k}" class="comparison-toggle w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" checked>
                            <label for="compare_${e.k}" class="ml-3 text-base font-bold text-gray-700 cursor-pointer select-none">${e.n}</label>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="text-xs text-gray-400 font-bold hidden md:inline">投资(万)</span>
                            <div class="relative w-24">
                                <input type="number" id="${e.k}BoilerCapex" ${u(t)} class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-base font-bold text-right focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 outline-none transition-all text-gray-700" placeholder="0">
                            </div>
                            <input type="hidden" id="${e.k}SalvageRate" value="${e.k==="steam"?0:5}">
                        </div>
                    </div>
                    `}).join("")}
             </div>
        </div>
    `}function Ie(){return`
        <div>
            <label class="${f} flex justify-between items-center">
                <span>工业热泵 SPF (能效)</span>
                <span class="text-blue-600 text-xs font-bold bg-blue-100 px-2 py-0.5 rounded">关键指标</span>
            </label>
            <input type="number" id="hpCop" ${u(p.hp.cop)} step="0.1" class="${b} !text-2xl !text-blue-700" data-validation="isStrictlyPositive">
        </div>

        <div class="pt-6 border-t border-dashed border-gray-200 space-y-6">
             <div>
                <div class="flex justify-between items-center mb-4">
                    <label class="${f} !mb-0">电价配置 (元/kWh)</label>
                    <button type="button" id="addPriceTierBtn" class="text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition">+ 添加时段</button>
                </div>
                <div id="priceTiersContainer" class="space-y-3 mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${p.electric.price}" class="track-change"> 
                
                <label class="flex items-center cursor-pointer p-3 bg-green-50/50 border border-green-200 rounded-xl hover:border-green-300 transition">
                    <input type="checkbox" id="greenPowerToggle" class="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 track-change">
                    <span class="ml-3 text-base font-bold text-green-800">启用绿电 (零碳模式)</span>
                </label>
             </div>

             <div class="grid grid-cols-2 gap-4">
                 <div class="related-to-gas">
                    <label class="${f}">气价 (元/m³)</label>
                    <input type="number" id="gasPrice" ${u(p.gas.price)} class="${b}">
                </div>
                <div class="related-to-coal"><label class="${f}">煤价 (元/t)</label><input type="number" id="coalPrice" ${u(p.coal.price)} class="${b}"></div>
                <div class="related-to-steam"><label class="${f}">汽价 (元/t)</label><input type="number" id="steamPrice" ${u(p.steam.price)} class="${b}"></div>
                <div class="related-to-fuel"><label class="${f}">油价 (元/t)</label><input type="number" id="fuelPrice" ${u(p.fuel.price)} class="${b}"></div>
                <div class="related-to-biomass"><label class="${f}">生物质 (元/t)</label><input type="number" id="biomassPrice" ${u(p.biomass.price)} class="${b}"></div>
             </div>
        </div>

        <div class="pt-6 border-t border-dashed border-gray-200">
            <label class="${f} mb-4">锅炉效率 (%)</label>
            <div class="space-y-3">
                ${[{id:"gas",label:"气",val:p.gas.boilerEff},{id:"coal",label:"煤",val:p.coal.boilerEff},{id:"fuel",label:"油",val:p.fuel.boilerEff},{id:"biomass",label:"生物",val:p.biomass.boilerEff}].map(e=>`
                    <div class="flex items-center justify-between related-to-${e.id}">
                        <span class="text-base font-bold text-gray-600 w-12">${e.label}</span>
                        <div class="flex-1 flex items-center space-x-2">
                            <input type="number" id="${e.id}BoilerEfficiency" ${u(e.val)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-lg font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all text-center h-10">
                            <button type="button" class="eff-calc-btn text-blue-600 bg-blue-50 hover:bg-blue-100 text-xs font-bold px-3 py-2 rounded-lg border border-blue-100 transition-colors" data-target="${e.id}BoilerEfficiency" data-fuel="${e.id}">反推</button>
                        </div>
                    </div>
                `).join("")}
                <div class="hidden">
                    <input type="number" id="electricBoilerEfficiency" value="98">
                    <input type="number" id="steamEfficiency" value="98">
                </div>
            </div>
        </div>

        <div class="mt-6 pt-4 border-t border-dashed border-gray-200">
            <details class="group">
                <summary class="flex justify-between items-center font-bold cursor-pointer list-none text-gray-500 hover:text-blue-600 transition-colors text-base select-none py-2 bg-gray-50 rounded-lg px-3">
                    <span>⚙️ 高级能源参数</span>
                    <span class="transition group-open:rotate-180">
                        <svg fill="none" height="20" width="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                </summary>
                <div class="text-gray-500 mt-4 grid grid-cols-1 gap-3 animate-fadeIn">
                    <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200">
                        <span class="text-sm font-bold text-gray-700">电 (Electric)</span>
                        <div class="flex items-center"><span class="text-xs mr-2 font-bold">排放</span><input id="gridFactor" type="number" ${u(p.electric.factor)} class="w-20 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-sm"><span class="ml-2 text-xs font-bold">kg/kWh</span></div>
                    </div>
                    ${["gas|气|m³","coal|煤|kg","fuel|油|kg","biomass|生物|kg","steam|蒸汽|kg"].map(e=>{const[t,o,s]=e.split("|");return`
                        <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center border border-gray-200 related-to-${t}">
                            <span class="text-sm font-bold text-gray-700">${o} (${t})</span>
                            <div class="flex items-center gap-2">
                                <div class="flex items-center"><span class="text-xs mr-1 font-bold">热值</span><input id="${t}Calorific" type="number" ${u(p[t].calorific)} class="w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-sm">
                                    <select id="${t}CalorificUnit" class="ml-1 p-1 border border-gray-300 rounded bg-white text-xs font-bold w-16 track-change">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                    </select>
                                </div>
                                <div class="flex items-center"><span class="text-xs mr-1 font-bold">排放</span><input id="${t}Factor" type="number" ${u(p[t].factor)} class="w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-sm"></div>
                            </div>
                        </div>`}).join("")}
                </div>
            </details>
        </div>

        <div class="pt-6 border-t border-dashed border-gray-200">
            <label class="${f} mb-4">运维成本 (万/年)</label>
            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-base font-bold text-blue-600 w-24">工业热泵</span>
                    <input type="number" id="hpOpexCost" ${u(p.hp.opex)} class="flex-1 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-lg font-bold text-blue-800 text-center h-12 shadow-sm">
                </div>
                ${[{id:"gas",label:"天然气",val:p.gas.opex},{id:"coal",label:"燃煤",val:p.coal.opex},{id:"electric",label:"电锅炉",val:p.electric.opex},{id:"steam",label:"蒸汽",val:p.steam.opex},{id:"fuel",label:"燃油",val:p.fuel.opex},{id:"biomass",label:"生物质",val:p.biomass.opex}].map(e=>`
                    <div class="flex items-center justify-between related-to-${e.id}">
                        <span class="text-base font-bold text-gray-600 w-24">${e.label}</span>
                        <input type="number" id="${e.id}OpexCost" ${u(e.val)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-lg font-bold text-gray-700 text-center h-12">
                    </div>
                `).join("")}
            </div>
        </div>
    `}function Le(){return`
        <div class="space-y-6">
            <div>
                <label class="${f}">分析年限 (年)</label>
                <input type="number" id="lccYears" ${u("15")} class="${b}">
            </div>
            <div>
                <label class="${f}">折现率 (%)</label>
                <input type="number" id="discountRate" ${u("8")} class="${b}">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="${f}">能源涨幅(%)</label>
                    <input type="number" id="energyInflationRate" ${u("3")} class="${b}">
                </div>
                <div>
                    <label class="${f}">运维涨幅(%)</label>
                    <input type="number" id="opexInflationRate" ${u("5")} class="${b}">
                </div>
            </div>
        </div>
    `}function Se(e){D("accordion-project","1. 项目与负荷",Be()),D("accordion-scheme","2. 方案与投资",ke()),D("accordion-operating","3. 运行参数",Ie()),D("accordion-financial","4. 财务模型",Le()),ue(),Fe();const t=document.getElementById("calculateBtn");t&&t.addEventListener("click",()=>e()),Te("heatingLoadUnit","heatingLoad"),document.querySelectorAll('input[name="calcMode"]').forEach(l=>l.addEventListener("change",ee)),ee(),document.querySelectorAll(".comparison-toggle").forEach(l=>l.addEventListener("change",te)),te();const n=document.getElementById("addPriceTierBtn");n&&n.addEventListener("click",()=>{Q(),e()}),Q("平均电价",p.electric.price,"100"),Ae(),Re();const a=document.getElementById("btn-reset-params");a&&a.addEventListener("click",Pe);const r=document.getElementById("enableScenarioComparison");r&&(r.addEventListener("change",()=>{const l=document.getElementById("saveScenarioBtn"),i=document.querySelector('.tab-link[data-tab="scenarios"]');r.checked?(l&&l.classList.remove("hidden"),i&&i.classList.remove("hidden")):(l&&l.classList.add("hidden"),i&&i.classList.add("hidden"))}),r.dispatchEvent(new Event("change"))),window.updateSimplePriceTier=function(l){}}function Fe(){document.querySelectorAll("input[data-default], select[data-default]").forEach(e=>{e.addEventListener("input",()=>{if(e.type==="checkbox")return;e.value!=e.dataset.default?(e.classList.add("text-blue-600","border-blue-500"),e.classList.remove("text-gray-900","border-gray-300")):(e.classList.remove("text-blue-600","border-blue-500"),e.classList.add("text-gray-900","border-gray-300"))})})}function Q(e="",t="",o=""){const s=document.getElementById("priceTiersContainer");if(!s)return;const n=document.createElement("div");n.className="price-tier-entry flex gap-2 items-center mb-2",n.innerHTML=`
        <input type="text" class="tier-name w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="时段" value="${e}">
        <input type="number" class="tier-price w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="价格" value="${t}">
        <span class="text-gray-400 text-base font-bold">@</span>
        <input type="number" class="tier-dist w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="%" value="${o}">
        <button type="button" class="text-red-500 hover:text-red-700 px-2 text-xl font-bold remove-tier-btn transition">×</button>
    `,n.querySelector(".remove-tier-btn").addEventListener("click",()=>{var a;s.children.length>1?(n.remove(),(a=document.getElementById("calculateBtn"))==null||a.click()):alert("至少保留一个电价时段")}),n.querySelectorAll("input").forEach(a=>{a.addEventListener("change",()=>{var r;return(r=document.getElementById("calculateBtn"))==null?void 0:r.click()})}),s.appendChild(n)}function D(e,t,o){const s=document.getElementById(e);s&&(s.innerHTML=`
        <button class="accordion-header flex justify-between items-center w-full px-4 py-4 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200 cursor-pointer" type="button" aria-expanded="true" aria-controls="${e}-content">
            <span class="text-lg font-extrabold text-gray-900 tracking-wide">${t}</span>
            <svg class="accordion-icon w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div id="${e}-content" class="accordion-content open px-4 py-4 border-t border-gray-100">
            ${o}
        </div>
    `)}function ee(){const e=document.querySelector('input[name="calcMode"]:checked').value;document.getElementById("input-group-load").classList.toggle("hidden",e==="total"),document.getElementById("input-group-hours-a").classList.toggle("hidden",e!=="annual"),document.getElementById("input-group-total").classList.toggle("hidden",e!=="total"),document.getElementById("input-group-daily").classList.toggle("hidden",e!=="daily")}function te(){document.querySelectorAll(".comparison-toggle").forEach(e=>{const t=e.dataset.target;document.querySelectorAll(`.related-to-${t}`).forEach(s=>{const n=s.querySelectorAll("input:not(.comparison-toggle), button");e.checked?(s.classList.remove("opacity-40","grayscale"),n.forEach(a=>a.disabled=!1)):(s.classList.add("opacity-40","grayscale"),n.forEach(a=>a.disabled=!0))})})}function Te(e,t,o){const s=document.getElementById(e),n=document.getElementById(t);!s||!n||s.addEventListener("change",()=>{})}function Pe(){confirm("确定要恢复默认参数吗？")&&location.reload()}function Re(){const e=document.getElementById("export-report-btn");e&&e.addEventListener("click",()=>{if(!G){alert("请先进行计算");return}buildPrintReport(G),setTimeout(()=>{window.print()},500)})}function Oe(e){var d;const t=c=>{const g=document.getElementById(c);return g&&parseFloat(g.value)||0},o=(c,g)=>{let y=t(c);const h=document.getElementById(g);return h&&y>0?{value:y,unit:h.value}:{value:y,unit:"MJ"}},s=[];document.querySelectorAll(".price-tier-entry").forEach(c=>{s.push({name:c.querySelector(".tier-name").value,price:parseFloat(c.querySelector(".tier-price").value)||0,dist:parseFloat(c.querySelector(".tier-dist").value)||0})}),s.length===0&&s.push({name:"默认",price:.7,dist:100});const n=document.querySelector('input[name="calcMode"]:checked').value;let a=0,r=0,l=0;n==="annual"?(a=t("heatingLoad"),r=t("operatingHours"),l=a*r):n==="total"?(l=t("annualHeating"),r=t("operatingHours_B"),a=r>0?l/r:0):(a=t("heatingLoad"),r=t("dailyHours")*t("annualDays")*(t("loadFactor")/100),l=a*r);const i=((d=document.getElementById("greenPowerToggle"))==null?void 0:d.checked)||!1;return{projectName:document.getElementById("projectName").value,analysisMode:"standard",isHybridMode:!1,priceTiers:s,heatingLoad:a,operatingHours:r,annualHeatingDemandKWh:l,lccYears:t("lccYears"),discountRate:t("discountRate")/100,energyInflationRate:t("energyInflationRate")/100,opexInflationRate:t("opexInflationRate")/100,hpHostCapex:t("hpCapex")*1e4,hpStorageCapex:t("storageCapex")*1e4,hpSalvageRate:t("hpSalvageRate")/100,hpCop:t("hpCop"),hpOpexCost:t("hpOpexCost")*1e4,gasCalorificObj:o("gasCalorific","gasCalorificUnit"),coalCalorificObj:o("coalCalorific","coalCalorificUnit"),fuelCalorificObj:o("fuelCalorific","fuelCalorificUnit"),biomassCalorificObj:o("biomassCalorific","biomassCalorificUnit"),steamCalorificObj:o("steamCalorific","steamCalorificUnit"),gridFactor:i?0:t("gridFactor"),gasFactor:t("gasFactor"),coalFactor:t("coalFactor"),fuelFactor:t("fuelFactor"),biomassFactor:t("biomassFactor"),steamFactor:t("steamFactor"),gasBoilerCapex:t("gasBoilerCapex")*1e4,gasSalvageRate:.05,gasBoilerEfficiency:t("gasBoilerEfficiency")/100,gasPrice:t("gasPrice"),gasOpexCost:t("gasOpexCost")*1e4,fuelBoilerCapex:t("fuelBoilerCapex")*1e4,fuelSalvageRate:.05,fuelBoilerEfficiency:t("fuelBoilerEfficiency")/100,fuelPrice:t("fuelPrice"),fuelOpexCost:t("fuelOpexCost")*1e4,coalBoilerCapex:t("coalBoilerCapex")*1e4,coalSalvageRate:.05,coalBoilerEfficiency:t("coalBoilerEfficiency")/100,coalPrice:t("coalPrice"),coalOpexCost:t("coalOpexCost")*1e4,steamCapex:t("steamBoilerCapex")*1e4,steamSalvageRate:0,steamEfficiency:.98,steamPrice:t("steamPrice"),steamOpexCost:t("steamOpexCost")*1e4,compare:{gas:document.getElementById("compare_gas").checked,coal:document.getElementById("compare_coal").checked,fuel:document.getElementById("compare_fuel").checked,electric:document.getElementById("compare_electric").checked,steam:document.getElementById("compare_steam").checked,biomass:document.getElementById("compare_biomass").checked},biomassBoilerCapex:t("biomassBoilerCapex")*1e4,biomassSalvageRate:0,biomassBoilerEfficiency:t("biomassBoilerEfficiency")/100,biomassPrice:t("biomassPrice"),biomassOpexCost:t("biomassOpexCost")*1e4,electricBoilerCapex:t("electricBoilerCapex")*1e4,electricSalvageRate:.05,electricBoilerEfficiency:t("electricBoilerEfficiency")/100,electricOpexCost:t("electricOpexCost")*1e4,isGreenElectricity:i}}function Me(e){G=e,xe(),le(),ye();const t=e.comparisons.sort((a,r)=>r.annualSaving-a.annualSaving)[0],o="text-3xl md:text-4xl xl:text-5xl font-black text-gray-800 mt-2 md:mt-3 tracking-tighter truncate";if(t){O("annual-saving",`${B(t.annualSaving)} 万`,o);let a="--";t.irr===null||t.irr===-1/0||t.irr<-1?a="无法回收":a=j(t.irr),O("irr",a,o),O("pbp",`${t.dynamicPBP} 年`,o),O("co2-reduction",`${X(t.co2Reduction,1)} 吨`,o)}else O("annual-saving","--",o),O("irr","--",o);setTimeout(()=>{Ee();const a=["热泵",...e.comparisons.map(c=>c.name)],r=[e.hp.annualEnergyCost/1e4,...e.comparisons.map(c=>c.annualEnergyCost/1e4)],l=[e.hp.annualOpex/1e4,...e.comparisons.map(c=>c.annualOpex/1e4)],i=document.getElementById("costComparisonChart");i&&we(i,a,r,l);const d=document.getElementById("lccBreakdownChart");if(d){const c=e.hp.lcc;Ce(d,[c.capex/1e4,c.energy/1e4,c.opex/1e4,c.residual/1e4])}},100);const s=document.getElementById("tab-data-table");s&&(s.innerHTML=`
            <div class="overflow-x-auto pb-6">
                <table class="min-w-full text-base md:text-lg text-left text-gray-700">
                    <thead class="text-sm md:text-base font-extrabold text-gray-900 uppercase bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                            <th class="px-4 py-4 whitespace-nowrap">方案名称</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">折算吨汽成本</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">综合节能率</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">年总成本(万)</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right">年节省(万)</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">动态回收期</th>
                            <th class="px-4 py-4 whitespace-nowrap text-center">IRR</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">LCC总值(万)</th>
                            <th class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">碳减排(吨)</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr class="bg-blue-50/50 border-b border-gray-100 font-bold text-gray-900">
                            <td class="px-4 py-4 whitespace-nowrap">工业热泵 (本方案)</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-blue-800">${q(e.hp.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">${B(e.hp.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${B(e.hp.lcc.total)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${e.comparisons.map(a=>`
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-4 whitespace-nowrap font-bold text-gray-800">${a.name}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${q(a.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-bold text-green-600">${j(a.savingRate)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${B(a.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-bold text-green-600">${B(a.annualSaving)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-medium">${a.dynamicPBP} 年</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-bold text-blue-600">${a.irr===null||a.irr<-1?'<span class="text-gray-400">N/A</span>':j(a.irr)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium hidden lg:table-cell">${B(a.lccTotal)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-green-600 font-bold hidden lg:table-cell">${X(a.co2Reduction,1)}</td>
                        </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            <p class="text-sm text-gray-400 mt-4 md:mt-6">* 注：LCC (全生命周期成本) 已包含资金时间价值，折现率 ${j(e.inputs.discountRate)}。<br>* 折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。</p>
        `);const n=document.getElementById("tab-conclusion");if(n&&t){const a=t.irr>.08;n.innerHTML=`
            <div class="p-6 md:p-8 ${a?"bg-green-50 border border-green-200":"bg-yellow-50 border border-yellow-200"} rounded-2xl">
                <h3 class="text-xl md:text-3xl font-extrabold ${a?"text-green-800":"text-yellow-800"} mb-4">${a?"🚀 推荐投资":"⚖️ 投资回报一般"}</h3>
                <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                    相比于 <strong>${t.name}</strong>，工业热泵方案预计每年可节省 <strong>${B(t.annualSaving)} 万元</strong>，综合费用节能率达 <strong>${j(t.savingRate)}</strong>。
                    <br><br>
                    您的热泵供热成本相当于 <strong>${q(e.hp.unitSteamCost,1)} 元/吨蒸汽</strong>，而${t.name}的成本为 <strong>${q(t.unitSteamCost,1)} 元/吨</strong>。
                    <br><br>
                    全生命周期（${e.inputs.lccYears}年）累计节省 <strong>${B(t.lccSaving)} 万元</strong>。动态回收期为 ${t.dynamicPBP} 年。
                </p>
            </div>`}}let J=null;function Ae(){const e=document.getElementById("eff-calc-modal"),t=document.getElementById("eff-calc-close-btn"),o=document.getElementById("ec-calc-btn"),s=document.getElementById("ec-apply-btn"),n=document.getElementById("ec-fuel-unit");if(!e)return;const a=l=>{const i=ce[l];i&&(l==="water"?(document.getElementById("ec-water-mass").value=i.mass,document.getElementById("ec-water-in-temp").value=i.tempIn,document.getElementById("ec-water-out-temp").value=i.tempOut):(document.getElementById("ec-steam-mass").value=i.mass,document.getElementById("ec-steam-pressure").value=i.pressure,document.getElementById("ec-steam-feed-temp").value=i.feedTemp))};document.querySelectorAll('input[name="ec-output-type"]').forEach(l=>{l.addEventListener("change",i=>{const d=i.target.value,c=document.getElementById("ec-water-params"),g=document.getElementById("ec-steam-params");d==="water"?(c.classList.remove("hidden"),g.classList.add("hidden")):(c.classList.add("hidden"),g.classList.remove("hidden")),a(d)})}),document.body.addEventListener("click",l=>{const i=l.target.closest(".eff-calc-btn");if(i){l.preventDefault();const d=i.dataset.target,c=i.dataset.fuel;J=d;const g=document.getElementById("ec-fuel-type");g&&(g.value=c,n.textContent=c==="gas"?"m³":"kg"),document.querySelector('input[name="ec-output-type"][value="water"]').click(),e.classList.remove("hidden")}}),t&&t.addEventListener("click",()=>e.classList.add("hidden")),o&&o.addEventListener("click",()=>{const l=document.getElementById("ec-fuel-type").value,i=parseFloat(document.getElementById("ec-fuel-amount").value);let d=0;l==="gas"?d=parseFloat(document.getElementById("gasCalorific").value):l==="fuel"?d=parseFloat(document.getElementById("fuelCalorific").value):l==="coal"?d=parseFloat(document.getElementById("coalCalorific").value):l==="biomass"&&(d=parseFloat(document.getElementById("biomassCalorific").value));const c=document.querySelector('input[name="ec-output-type"]:checked').value;let g={};c==="water"?g={mass:parseFloat(document.getElementById("ec-water-mass").value),tempIn:parseFloat(document.getElementById("ec-water-in-temp").value),tempOut:parseFloat(document.getElementById("ec-water-out-temp").value)}:g={mass:parseFloat(document.getElementById("ec-steam-mass").value),pressure:parseFloat(document.getElementById("ec-steam-pressure").value),feedTemp:parseFloat(document.getElementById("ec-steam-feed-temp").value)};const y=de(l,i,d,c,g),h=document.getElementById("ec-result-display");y.error?(h.textContent="Error",h.className="text-3xl font-black text-red-500 tracking-tight",s.disabled=!0):(h.textContent=y.efficiency.toFixed(1)+" %",h.className="text-3xl font-black text-blue-600 tracking-tight",s.disabled=!1,s.dataset.value=y.efficiency.toFixed(1))}),s&&s.addEventListener("click",()=>{var l;if(J&&s.dataset.value){const i=document.getElementById(J);i&&(i.value=s.dataset.value,e.classList.add("hidden"),(l=document.getElementById("calculateBtn"))==null||l.click())}})}const ne=697.8;function Ne(e){if(!e||!e.value)return 0;const t=ie[e.unit]||1;return e.value*t}function je(e){const{heatingLoad:t,operatingHours:o,annualHeatingDemandKWh:s,lccYears:n,discountRate:a,energyInflationRate:r,opexInflationRate:l,hpHostCapex:i,hpStorageCapex:d,hpSalvageRate:c,hpCop:g,hpOpexCost:y,priceTiers:h,gridFactor:F}=e;let A=0;if(h&&h.length>0){let x=0,R=0;h.forEach(S=>{R+=S.price*S.dist,x+=S.dist}),A=x>0?R/x:.7}else A=.7;const I=s/g,v=I*A,H=I*F/1e3,C=v+y,$=i+d;let E=$,L=0,T=0;for(let x=1;x<=n;x++){const R=v*Math.pow(1+r,x-1),S=y*Math.pow(1+l,x-1),m=1/Math.pow(1+a,x);L+=R*m,T+=S*m}const P=$*c/Math.pow(1+a,n);E=E+L+T-P;const N=s/ne,_=N>0?C/N:0;return{avgElecPrice:A,initialInvestment:$,annualEnergyCost:v,annualOpex:y,annualTotalCost:C,co2:H,unitSteamCost:_,lcc:{total:E,capex:$,energy:L,opex:T,residual:-P}}}function He(e,t){const o=[],s=e.annualHeatingDemandKWh/ne,n=(a,r,l,i,d,c,g,y,h)=>{let F=0;if(typeof d=="object"?F=Ne(d):F=d,l<=0||F<=0)return null;let I=e.annualHeatingDemandKWh*3.6/(F*l),v=0;h==="ton"?v=I/1e3*i:v=I*i;const H=I*g/1e3,C=v+c;let $=r;for(let m=1;m<=e.lccYears;m++){const U=v*Math.pow(1+e.energyInflationRate,m-1),Y=c*Math.pow(1+e.opexInflationRate,m-1);$+=(U+Y)/Math.pow(1+e.discountRate,m)}$-=r*y/Math.pow(1+e.discountRate,e.lccYears);const E=t.initialInvestment-r,L=C-t.annualTotalCost,T=[-E];let W="> "+e.lccYears,P=-E,N=!1,_=0;for(let m=1;m<=e.lccYears;m++){const U=v*Math.pow(1+e.energyInflationRate,m-1)+c*Math.pow(1+e.opexInflationRate,m-1),Y=t.annualEnergyCost*Math.pow(1+e.energyInflationRate,m-1)+t.annualOpex*Math.pow(1+e.opexInflationRate,m-1),z=U-Y;T.push(z),_+=z;const Z=z/Math.pow(1+e.discountRate,m),se=P;if(P+=Z,!N&&P>=0){const re=Math.abs(se)/Z;W=(m-1+re).toFixed(1),N=!0}}let x=null;E>0?_<E?x=null:x=_e(T):t.annualTotalCost<C?x=9.99:x=null;const R=C>0?L/C:0,S=s>0?C/s:0;return{name:a,initialInvestment:r,annualEnergyCost:v,annualOpex:c,annualTotalCost:C,co2:H,lccTotal:$,annualSaving:L,savingRate:R,unitSteamCost:S,paybackPeriod:E>0?(E/L).toFixed(1)+" 年":"立即",dynamicPBP:W,irr:x,lccSaving:$-t.lcc.total,co2Reduction:H-t.co2}};return e.compare.gas&&o.push(n("天然气锅炉",e.gasBoilerCapex,e.gasBoilerEfficiency,e.gasPrice,e.gasCalorificObj,e.gasOpexCost,e.gasFactor,e.gasSalvageRate,"m3")),e.compare.coal&&o.push(n("燃煤锅炉",e.coalBoilerCapex,e.coalBoilerEfficiency,e.coalPrice,e.coalCalorificObj,e.coalOpexCost,e.coalFactor,e.coalSalvageRate,"ton")),e.compare.fuel&&o.push(n("燃油锅炉",e.fuelBoilerCapex,e.fuelBoilerEfficiency,e.fuelPrice,e.fuelCalorificObj,e.fuelOpexCost,e.fuelFactor,e.fuelSalvageRate,"ton")),e.compare.biomass&&o.push(n("生物质锅炉",e.biomassBoilerCapex,e.biomassBoilerEfficiency,e.biomassPrice,e.biomassCalorificObj,e.biomassOpexCost,e.biomassFactor,e.biomassSalvageRate,"ton")),e.compare.electric&&o.push(n("电锅炉",e.electricBoilerCapex,e.electricBoilerEfficiency,t.avgElecPrice,3.6,e.electricOpexCost,e.gridFactor,e.electricSalvageRate,"kwh")),e.compare.steam&&o.push(n("管网蒸汽",e.steamCapex,e.steamEfficiency,e.steamPrice,e.steamCalorificObj,e.steamOpexCost,e.steamFactor,e.steamSalvageRate,"ton")),o.filter(a=>a!==null)}function _e(e,t=.1){let n=t;for(let a=0;a<100;a++){let r=0,l=0;for(let d=0;d<e.length;d++)r+=e[d]/Math.pow(1+n,d),l-=d*e[d]/Math.pow(1+n,d+1);const i=n-r/l;if(Math.abs(i-n)<1e-6)return i;n=i}return null}function ae(){const e=Oe();if(!e)return;const t=je(e),o=He(e,t);Me({inputs:e,hp:t,comparisons:o,isHybridMode:!1})}document.addEventListener("DOMContentLoaded",()=>{console.log("Phoenix Plan V18.5 Engine (Corrected Units) Initializing..."),Se(ae),setTimeout(()=>ae(),500)});
