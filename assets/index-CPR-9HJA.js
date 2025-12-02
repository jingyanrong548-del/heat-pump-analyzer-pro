(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))o(l);new MutationObserver(l=>{for(const a of l)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function s(l){const a={};return l.integrity&&(a.integrity=l.integrity),l.referrerPolicy&&(a.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?a.credentials="include":l.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(l){if(l.ep)return;l.ep=!0;const a=s(l);fetch(l.href,a)}})();const ve={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},m={hp:{cop:3,opex:2.5},electric:{price:.7,calorific:3.6,factor:.57,boilerEff:98,opex:.4,capex:50},gas:{price:4.2,calorific:36,factor:1.97,boilerEff:92,opex:1.8,capex:80},coal:{price:1e3,calorific:21,factor:2.42,boilerEff:80,opex:6.8,capex:60},fuel:{price:8e3,calorific:42,factor:3.1,boilerEff:90,opex:1.9,capex:70},biomass:{price:850,calorific:15,factor:0,boilerEff:85,opex:6.3,capex:75},steam:{price:280,calorific:2.8,factor:.35,boilerEff:95,opex:0,capex:0}},Ee={water:{mass:100,tempIn:15,tempOut:60},steam:{mass:10,pressure:.8,feedTemp:20}};function R(e,t=2){const s=parseFloat(e);return isNaN(s)?"-":(s/1e4).toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function Q(e,t=2){const s=parseFloat(e);return isNaN(s)?"-":s.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function ce(e,t=2){const s=parseFloat(e);return isNaN(s)?"-":s.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function K(e,t=1){const s=parseFloat(e);return isNaN(s)?"-":(s*100).toFixed(t)+"%"}function we(e,t,s,o,l){if(!t||!s)return{error:"请输入有效的燃料消耗量和热值"};const a=t*s/1e3;let n=0;if(o==="water"){const{mass:i,tempIn:c,tempOut:d}=l;if(!i||c===void 0||!d)return{error:"请输入完整的热水参数"};const g=d-c;n=4.186*(i*1e3)*g/1e6}else if(o==="steam"){const{mass:i,pressure:c,feedTemp:d}=l;if(!i||!c||d===void 0)return{error:"请输入完整的蒸汽参数"};const g=2770,v=4.186*d;n=i*1e3*(g-v)/1e6}return a<=0?{error:"计算得出的投入能量无效"}:{efficiency:n/a*100,inputEnergy:a,outputEnergy:n,error:null}}const oe={activeTab:"charts"};function Ce(){$e(),ke(),Le(),se(oe.activeTab)}function $e(){document.querySelectorAll(".accordion-header").forEach(t=>{t.addEventListener("click",()=>{const s=t.getAttribute("aria-controls"),o=document.getElementById(s),l=t.getAttribute("aria-expanded")==="true";Be(t,o,!l)})})}function Be(e,t,s){!e||!t||(s?(t.classList.remove("hidden"),requestAnimationFrame(()=>{t.classList.add("open"),e.setAttribute("aria-expanded","true")})):(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),setTimeout(()=>{e.getAttribute("aria-expanded")==="false"&&t.classList.add("hidden")},300)))}function ke(){document.querySelectorAll(".tab-link").forEach(t=>{t.addEventListener("click",s=>{s.preventDefault();const o=t.dataset.tab;o&&se(o)})})}function se(e){document.querySelectorAll(".tab-link").forEach(t=>{t.dataset.tab===e?t.classList.add("tab-active"):t.classList.remove("tab-active")}),document.querySelectorAll(".tab-content").forEach(t=>{t.id===`tab-${e}`?(t.classList.remove("hidden"),Ie(t)):t.classList.add("hidden")}),oe.activeTab=e}function Ie(e){e.querySelectorAll("canvas").forEach(s=>{window.dispatchEvent(new Event("resize"))})}function Le(){const e=document.getElementById("input-sidebar"),t=document.getElementById("mobile-open-config"),s=document.getElementById("mobile-sidebar-close"),o=document.getElementById("calculateBtn");if(!e)return;const l=a=>{a?(e.classList.remove("translate-y-full"),e.classList.add("translate-y-0"),document.body.style.overflow="hidden"):(e.classList.remove("translate-y-0"),e.classList.add("translate-y-full"),document.body.style.overflow="")};t&&t.addEventListener("click",()=>l(!0)),s&&s.addEventListener("click",()=>l(!1)),o&&o.addEventListener("click",()=>{window.innerWidth<768&&(l(!1),setTimeout(()=>ge(),300))})}function Se(e){const t=document.getElementById("export-report-btn");t&&(t.disabled=!1,t.classList.remove("opacity-50","cursor-not-allowed"),t.classList.add("hover:bg-blue-700","shadow-md"))}function ge(){const e=document.getElementById("main-results-area");e&&(e.scrollIntoView({behavior:"smooth",block:"start"}),window.scrollTo({top:0,behavior:"smooth"}))}function Te(){const e=document.getElementById("report-placeholder"),t=document.getElementById("report-content");e&&e.classList.add("hidden"),t&&t.classList.remove("hidden"),se(oe.activeTab)}function q(e,t,s=null){const o=document.getElementById(`card-${e}`);o&&(o.textContent=t,s&&(o.className=o.className.replace(/text-(green|yellow|red|gray)-\d+/,""),o.classList.add(...s.split(" "))))}const U=window.innerWidth<768,fe=U?11:16,Fe=U?12:18,Re=U?14:20;Chart.defaults.font.family="'Inter', 'Noto Sans SC', sans-serif";Chart.defaults.font.size=fe;Chart.defaults.color="#475569";Chart.defaults.scale.grid.color="#e2e8f0";Chart.defaults.scale.grid.lineWidth=1;Chart.defaults.plugins.legend.labels.font={size:Fe,weight:"bold"};Chart.defaults.plugins.legend.labels.boxWidth=U?12:20;Chart.defaults.plugins.legend.labels.padding=U?10:25;Chart.defaults.plugins.tooltip.backgroundColor="rgba(15, 23, 42, 0.95)";Chart.defaults.plugins.tooltip.titleFont={size:Re,weight:"bold"};Chart.defaults.plugins.tooltip.bodyFont={size:fe};Chart.defaults.plugins.tooltip.padding=12;Chart.defaults.plugins.tooltip.cornerRadius=8;const O={hp:{fill:"rgba(37, 99, 235, 0.9)"},gas:{fill:"rgba(234, 88, 12, 0.9)"},fuel:{fill:"rgba(220, 38, 38, 0.9)"},coal:{fill:"rgba(71, 85, 105, 0.9)"},biomass:{fill:"rgba(22, 163, 74, 0.9)"},electric:{fill:"rgba(147, 51, 234, 0.9)"},steam:{fill:"rgba(8, 145, 178, 0.9)"},opex:"#f59e0b"};let I={cost:null,lcc:null};function Oe(){I.cost&&(I.cost.destroy(),I.cost=null),I.lcc&&(I.lcc.destroy(),I.lcc=null)}function Pe(e,t,s,o){const l=n=>{if(!n)return"#cbd5e1";const r=n.toLowerCase();return r.includes("热泵")||r.includes("hp")?O.hp.fill:r.includes("气")||r.includes("gas")?O.gas.fill:r.includes("油")||r.includes("fuel")||r.includes("oil")?O.fuel.fill:r.includes("煤")||r.includes("coal")?O.coal.fill:r.includes("生物")||r.includes("bio")?O.biomass.fill:r.includes("电")||r.includes("elec")?O.electric.fill:r.includes("蒸汽")||r.includes("steam")?O.steam.fill:"#9ca3af"},a=t.map(n=>l(n));return I.cost=new Chart(e,{type:"bar",data:{labels:t,datasets:[{label:"能源成本",data:s,backgroundColor:a,borderRadius:4,stack:"Stack 0",barPercentage:.6},{label:"运维成本",data:o,backgroundColor:O.opex,borderRadius:4,stack:"Stack 0",barPercentage:.6}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",align:"end"},tooltip:{callbacks:{label:n=>{let r=n.dataset.label||"";return r&&(r+=": "),n.parsed.y!==null&&(r+=parseFloat(n.parsed.y).toFixed(2)+" 万"),r},footer:n=>{let r=0;return n.forEach(function(i){r+=i.parsed.y}),"总计: "+r.toFixed(2)+" 万"}}}},scales:{y:{beginAtZero:!0,title:{display:!U,text:"万元/年",font:{size:14,weight:"bold"}},stacked:!0,border:{display:!1},ticks:{padding:10}},x:{stacked:!0,grid:{display:!1},ticks:{font:{weight:"bold"},maxRotation:45,minRotation:0}}}}}),I.cost}function Me(e,t){const s=t.map(o=>Math.abs(o));return I.lcc=new Chart(e,{type:"doughnut",data:{labels:["初始投资","全周期能源","全周期运维","残值回收"],datasets:[{data:s,backgroundColor:["#ef4444","#3b82f6","#f59e0b","#10b981"],borderWidth:0,hoverOffset:15}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"60%",plugins:{legend:{position:"right",labels:{padding:20}},tooltip:{callbacks:{label:o=>{const l=o.raw,a=o.chart._metasets[o.datasetIndex].total,n=(l/a*100).toFixed(1)+"%",r=o.label;return r==="残值回收"?` ${r}: -${l.toFixed(1)} 万 (${n})`:` ${r}: ${l.toFixed(1)} 万 (${n})`}}}}}}),I.lcc}let le=null;const p=e=>`value="${e}" data-default="${e}"`,de={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},b="w-full px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg text-base md:text-lg font-bold text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder-gray-400 h-10 md:h-12 shadow-sm",u="block text-sm font-bold text-gray-600 mb-1 md:mb-2 tracking-wide",Ae="bg-white p-1 mb-4 md:mb-6";function He(){return`
        <div class="${Ae}">
            <label class="${u}">项目名称</label>
            <input type="text" id="projectName" ${p("示例项目")} class="${b}">
        </div>

        <div class="pt-4 md:pt-6 border-t border-gray-200">
            <label class="${u} mb-3 md:mb-4">负荷计算模式</label>
            <div class="grid grid-cols-3 gap-2 md:gap-3">
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="annual" class="peer sr-only" checked>
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-sm md:text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 A</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">年时法</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="total" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-sm md:text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 B</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">总量法</span>
                    </div>
                </label>
                <label class="relative cursor-pointer group">
                    <input type="radio" name="calcMode" value="daily" class="peer sr-only">
                    <div class="p-2 md:p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center h-full flex flex-col justify-center shadow-sm">
                        <span class="text-sm md:text-base font-bold text-gray-800 peer-checked:text-blue-800">模式 C</span>
                        <span class="text-[10px] md:text-xs text-gray-500 mt-0.5 md:mt-1">间歇法</span>
                    </div>
                </label>
            </div>
        </div>

        <div id="input-group-load" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${u} !mb-0">制热负荷 (设计值)</label>
                    <select id="heatingLoadUnit" class="text-xs md:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer hover:bg-blue-100 transition"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </div>
                <input type="number" id="heatingLoad" ${p("1000")} class="${b}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-hours-a" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <label class="${u}">年运行小时 (h)</label>
                <input type="number" id="operatingHours" ${p("2000")} class="${b}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-total" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${u} !mb-0">年总加热量</label>
                    <select id="annualHeatingUnit" class="text-xs md:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </div>
                <input type="number" id="annualHeating" ${p("2000000")} class="${b}" data-validation="isPositive">
            </div>
            <div>
                <label class="${u}">年运行小时 (反推)</label>
                <input type="number" id="operatingHours_B" ${p("2000")} class="${b}" placeholder="自动计算">
            </div>
        </div>

        <div id="input-group-daily" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${u}">日运行 (h)</label>
                    <input type="number" id="dailyHours" ${p("8")} class="${b}">
                </div>
                <div>
                    <label class="${u}">年天数 (d)</label>
                    <input type="number" id="annualDays" ${p("300")} class="${b}">
                </div>
            </div>
            <div>
                <label class="${u}">平均负荷率 (%)</label>
                <input type="number" id="loadFactor" ${p("70")} class="${b}">
            </div>
        </div>
    `}function je(){return`
        <div class="mb-6">
            <label class="${u} mb-3">系统模式 (System Mode)</label>
            <div class="flex bg-gray-100 p-1 rounded-xl">
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="systemMode" value="pure" class="peer sr-only" checked>
                    <span class="block text-center py-2 rounded-lg text-sm font-bold text-gray-500 peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm transition-all">1. 纯热泵</span>
                </label>
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="systemMode" value="hybrid" class="peer sr-only">
                    <span class="block text-center py-2 rounded-lg text-sm font-bold text-gray-500 peer-checked:bg-white peer-checked:text-blue-700 peer-checked:shadow-sm transition-all">2. 混合动力</span>
                </label>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
            <div>
                <label class="${u}">热泵投资 (万)</label>
                <input type="number" id="hpCapex" ${p(m.hp.capex||"200")} class="${b}" data-validation="isPositive">
            </div>
            <div>
                <label class="${u}">储能投资 (万)</label>
                <input type="number" id="storageCapex" ${p("0")} class="${b}">
            </div>
        </div>

        <div id="hybrid-params" class="hidden mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl animate-fadeIn">
             <h4 class="text-sm font-bold text-orange-800 mb-4 flex items-center"><span class="mr-2">🔥</span>混合动力配置</h4>
             <div class="space-y-4">
                 <div>
                    <label class="${u} text-orange-900">辅助热源类型</label>
                    <select id="hybridAuxHeaterType" class="w-full px-3 py-2 border border-orange-200 rounded-lg text-base font-bold text-orange-900 focus:ring-2 focus:ring-orange-500 bg-white">
                        <option value="electric">电加热 (Electric)</option>
                        <option value="gas">天然气锅炉 (Gas)</option>
                        <option value="coal">燃煤锅炉 (Coal)</option>
                        <option value="fuel">燃油锅炉 (Fuel)</option>
                        <option value="biomass">生物质锅炉 (Biomass)</option>
                        <option value="steam">管网蒸汽 (Steam)</option>
                    </select>
                 </div>
                 <div>
                    <label class="${u} flex justify-between text-orange-900">
                        <span>热泵承担负荷 (%)</span>
                        <span class="text-xs text-orange-600 font-normal">剩余由辅热承担</span>
                    </label>
                    <input type="number" id="hybridLoadShare" ${p("50")} class="${b} border-orange-200 focus:border-orange-500 text-orange-900">
                 </div>
                 <div class="grid grid-cols-2 gap-3">
                     <div>
                        <label class="${u} text-orange-900">辅热投资 (万)</label>
                        <input type="number" id="hybridAuxHeaterCapex" ${p("30")} class="${b} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                     <div>
                        <label class="${u} text-orange-900">辅热运维 (万)</label>
                        <input type="number" id="hybridAuxHeaterOpex" ${p("0.5")} class="${b} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                 </div>
             </div>
        </div>
        
        <div class="pt-4 md:pt-6 border-t border-gray-200">
             <label class="block text-base font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                <span class="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></span>对比基准配置
             </label>
             <div class="space-y-2 md:space-y-3">
                ${[{k:"gas",n:"天然气"},{k:"coal",n:"燃煤"},{k:"electric",n:"电锅炉"},{k:"steam",n:"蒸汽"},{k:"fuel",n:"燃油"},{k:"biomass",n:"生物质"}].map(e=>{const t=m[e.k].capex;return`
                    <div class="flex items-center justify-between group related-to-${e.k} transition-all duration-200 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${e.k}" data-target="${e.k}" class="comparison-toggle w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" checked>
                            <label for="compare_${e.k}" class="ml-3 text-sm md:text-base font-bold text-gray-700 cursor-pointer select-none">${e.n}</label>
                        </div>
                        <div class="flex items-center gap-2 md:gap-3">
                            <span class="text-xs text-gray-400 font-bold hidden md:inline">投资(万)</span>
                            <div class="relative w-20 md:w-24">
                                <input type="number" id="${e.k}BoilerCapex" ${p(t)} class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm md:text-base font-bold text-right focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 outline-none transition-all text-gray-700" placeholder="0">
                            </div>
                            <input type="hidden" id="${e.k}SalvageRate" value="${e.k==="steam"?0:5}">
                        </div>
                    </div>
                    `}).join("")}
             </div>
        </div>
    `}function Ne(){return`
        <div>
            <label class="${u} flex justify-between items-center">
                <span>工业热泵 SPF (能效)</span>
                <span class="text-blue-600 text-[10px] md:text-xs font-bold bg-blue-100 px-2 py-0.5 rounded">关键指标</span>
            </label>
            <input type="number" id="hpCop" ${p(m.hp.cop)} step="0.1" class="${b} !text-xl md:!text-2xl !text-blue-700" data-validation="isStrictlyPositive">
        </div>

        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200 space-y-4 md:space-y-6">
             <div>
                <div class="flex justify-between items-center mb-2 md:mb-4">
                    <label class="${u} !mb-0">电价配置 (元/kWh)</label>
                    <button type="button" id="addPriceTierBtn" class="text-[10px] md:text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg transition">+ 添加</button>
                </div>
                <div id="priceTiersContainer" class="space-y-2 md:space-y-3 mb-2 md:mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${m.electric.price}" class="track-change"> 
                
                <label class="flex items-center cursor-pointer p-2 md:p-3 bg-green-50/50 border border-green-200 rounded-xl hover:border-green-300 transition">
                    <input type="checkbox" id="greenPowerToggle" class="w-4 h-4 md:w-5 md:h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 track-change">
                    <span class="ml-2 md:ml-3 text-sm md:text-base font-bold text-green-800">启用绿电 (零碳模式)</span>
                </label>
             </div>

             <div class="grid grid-cols-2 gap-3 md:gap-4">
                 <div class="related-to-gas"><label class="${u}">气价 (元/m³)</label><input type="number" id="gasPrice" ${p(m.gas.price)} class="${b}"></div>
                 <div class="related-to-coal"><label class="${u}">煤价 (元/t)</label><input type="number" id="coalPrice" ${p(m.coal.price)} class="${b}"></div>
                 <div class="related-to-steam"><label class="${u}">汽价 (元/t)</label><input type="number" id="steamPrice" ${p(m.steam.price)} class="${b}"></div>
                 <div class="related-to-fuel"><label class="${u}">油价 (元/t)</label><input type="number" id="fuelPrice" ${p(m.fuel.price)} class="${b}"></div>
                 <div class="related-to-biomass"><label class="${u}">生物质 (元/t)</label><input type="number" id="biomassPrice" ${p(m.biomass.price)} class="${b}"></div>
             </div>
        </div>

<div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${u} mb-2 md:mb-4">锅炉效率 (%)</label>
            <div class="space-y-2 md:space-y-3">
                ${[{id:"gas",label:"天然气",val:m.gas.boilerEff,hasBtn:!0},{id:"coal",label:"燃煤",val:m.coal.boilerEff,hasBtn:!0},{id:"electric",label:"电锅炉",val:m.electric.boilerEff,hasBtn:!1},{id:"steam",label:"管道蒸汽",val:m.steam.boilerEff,hasBtn:!1},{id:"fuel",label:"燃油",val:m.fuel.boilerEff,hasBtn:!0},{id:"biomass",label:"生物质",val:m.biomass.boilerEff,hasBtn:!0}].map(e=>`
                    <div class="flex items-center gap-2 related-to-${e.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-16 md:w-24 shrink-0 text-right pr-2">${e.label}</span>
                        <div class="flex-1 flex items-center gap-2 min-w-0">
                            <input type="number" id="${e.id}BoilerEfficiency" ${p(e.val)} class="flex-1 px-2 md:px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-base md:text-lg font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all text-center h-9 md:h-10 min-w-0">
                            ${e.hasBtn?`<button type="button" class="eff-calc-btn shrink-0 text-blue-600 bg-blue-50 hover:bg-blue-100 text-[10px] md:text-xs font-bold px-2 md:px-3 py-2 rounded-lg border border-blue-100 transition-colors whitespace-nowrap" data-target="${e.id}BoilerEfficiency" data-fuel="${e.id}">反推</button>`:""}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>

        <div class="mt-4 md:mt-6 pt-4 border-t border-dashed border-gray-200">
            <details class="group">
                <summary class="flex justify-between items-center font-bold cursor-pointer list-none text-gray-500 hover:text-blue-600 transition-colors text-sm md:text-base select-none py-2 bg-gray-50 rounded-lg px-3">
                    <span>⚙️ 高级能源参数 (单位换算)</span>
                    <span class="transition group-open:rotate-180"><svg fill="none" height="20" width="20" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg></span>
                </summary>
                <div class="text-gray-500 mt-3 grid grid-cols-1 gap-3 animate-fadeIn">
                    <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200">
                        <span class="text-xs md:text-sm font-bold text-gray-700">电 (Electric)</span>
                        <div class="flex items-center"><span class="text-[10px] md:text-xs mr-2 font-bold">排放</span><input id="gridFactor" type="number" ${p(m.electric.factor)} class="w-16 md:w-20 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-xs md:text-sm"><span class="ml-1 md:ml-2 text-[10px] md:text-xs font-bold">kg/kWh</span></div>
                    </div>
                    ${["gas|气|m³","coal|煤|kg","fuel|油|kg","biomass|生物|kg","steam|蒸汽|kg"].map(e=>{const[t,s,o]=e.split("|");return`
                        <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200 related-to-${t}">
                            <span class="text-xs md:text-sm font-bold text-gray-700">${s}</span>
                            <div class="flex items-center gap-1 md:gap-2">
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold">热值</span>
                                    <input id="${t}Calorific" type="number" ${p(m[t].calorific)} class="w-12 md:w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-[10px] md:text-sm">
                                    <select id="${t}CalorificUnit" class="ml-0.5 md:ml-1 p-1 border border-gray-300 rounded bg-white text-[10px] md:text-xs font-bold w-12 md:w-16 track-change unit-converter" data-target-input="${t}Calorific">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                    </select>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold hidden lg:inline">排放</span>
                                    <input id="${t}Factor" type="number" ${p(m[t].factor)} class="w-12 md:w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-[10px] md:text-sm">
                                    <span class="text-[10px] md:text-xs font-bold text-gray-500 ml-0.5">kg</span>
                                </div>
                            </div>
                        </div>`}).join("")}
                </div>
            </details>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${u} mb-3 md:mb-4">运维成本 (万/年)</label>
            <div class="space-y-3 md:space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm md:text-base font-bold text-blue-600 w-20 md:w-24">工业热泵</span>
                    <input type="number" id="hpOpexCost" ${p(m.hp.opex)} class="flex-1 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-base md:text-lg font-bold text-blue-800 text-center h-10 md:h-12 shadow-sm">
                </div>
                ${[{id:"gas",label:"天然气",val:m.gas.opex},{id:"coal",label:"燃煤",val:m.coal.opex},{id:"electric",label:"电锅炉",val:m.electric.opex},{id:"steam",label:"蒸汽",val:m.steam.opex},{id:"fuel",label:"燃油",val:m.fuel.opex},{id:"biomass",label:"生物质",val:m.biomass.opex}].map(e=>`
                    <div class="flex items-center justify-between related-to-${e.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-20 md:w-24">${e.label}</span>
                        <input type="number" id="${e.id}OpexCost" ${p(e.val)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-base md:text-lg font-bold text-gray-700 text-center h-10 md:h-12">
                    </div>
                `).join("")}
            </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-200 text-center pb-24">
            <p class="text-sm font-bold text-gray-700">创作：荆炎荣</p>
            <p id="usage-counter" class="text-xs text-blue-500 font-bold mt-1">累计运行：0 次</p>
            <p class="text-[10px] text-gray-400 mt-2 leading-tight px-4">免责声明：本工具计算结果仅供参考，不作为最终投资决策依据。具体参数请咨询专业设计院。</p>
        </div>
    `}function _e(){return`
        <div class="mb-6">
            <label class="${u} mb-3">投资模式 (Business Model)</label>
            <div class="flex bg-gray-100 p-1 rounded-xl">
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="financeMode" value="self" class="peer sr-only" checked>
                    <span class="block text-center py-2 rounded-lg text-sm font-bold text-gray-500 peer-checked:bg-white peer-checked:text-purple-700 peer-checked:shadow-sm transition-all">1. 业主自投</span>
                </label>
                <label class="flex-1 relative cursor-pointer">
                    <input type="radio" name="financeMode" value="bot" class="peer sr-only">
                    <span class="block text-center py-2 rounded-lg text-sm font-bold text-gray-500 peer-checked:bg-white peer-checked:text-purple-700 peer-checked:shadow-sm transition-all">2. 能源托管/BOT</span>
                </label>
            </div>
        </div>

        <div class="space-y-4 md:space-y-6">
            <div>
                <label class="${u}">分析年限 (年)</label>
                <input type="number" id="lccYears" ${p("15")} class="${b}">
            </div>
            <div>
                <label class="${u}">折现率 (%)</label>
                <input type="number" id="discountRate" ${p("8")} class="${b}">
            </div>
            
            <div id="bot-params" class="hidden p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-4 animate-fadeIn">
                <h4 class="text-sm font-bold text-purple-800 mb-2 flex items-center"><span class="mr-2">💰</span>BOT 参数设置</h4>
                <div><label class="${u}">年服务费收入 (万)</label><input type="number" id="botAnnualRevenue" ${p("150")} class="${b} border-purple-200 focus:border-purple-500 text-purple-900"></div>
                <div><label class="${u}">自有资金比例 (%)</label><input type="number" id="botEquityRatio" ${p("30")} class="${b} border-purple-200 focus:border-purple-500 text-purple-900"></div>
            </div>

            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${u}">能源涨幅(%)</label>
                    <input type="number" id="energyInflationRate" ${p("3")} class="${b}">
                </div>
                <div>
                    <label class="${u}">运维涨幅(%)</label>
                    <input type="number" id="opexInflationRate" ${p("5")} class="${b}">
                </div>
            </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-200 text-center pb-24">
            <p class="text-sm font-bold text-gray-700">创作：荆炎荣</p>
            <p id="usage-counter" class="text-xs text-blue-500 font-bold mt-1">累计运行：0 次</p>
            <p class="text-[10px] text-gray-400 mt-2 leading-tight px-4">免责声明：本工具计算结果仅供参考，不作为最终投资决策依据。具体参数请咨询专业设计院。</p>
        </div>
    `}function qe(e){ee("accordion-project","1. 项目与负荷",He()),ee("accordion-scheme","2. 方案与投资",je()),ee("accordion-operating","3. 运行参数",Ne()),ee("accordion-financial","4. 财务模型",_e()),Ce(),Je(),We(),xe();const t=document.getElementById("calculateBtn");t&&t.addEventListener("click",()=>{Ue(),e()}),Ye("heatingLoadUnit","heatingLoad"),De();const s=document.getElementById("addPriceTierBtn");s&&s.addEventListener("click",()=>{pe(),e()}),pe("平均电价",m.electric.price,"100"),Ze(),Ve();const o=document.getElementById("btn-reset-params");o&&o.addEventListener("click",ze);const l=document.getElementById("enableScenarioComparison");l&&(l.addEventListener("change",()=>{const a=document.getElementById("saveScenarioBtn"),n=document.querySelector('.tab-link[data-tab="scenarios"]');l.checked?(a&&a.classList.remove("hidden"),n&&n.classList.remove("hidden")):(a&&a.classList.add("hidden"),n&&n.classList.add("hidden"))}),l.dispatchEvent(new Event("change"))),window.updateSimplePriceTier=function(a){}}function De(){document.querySelectorAll('input[name="calcMode"]').forEach(l=>l.addEventListener("change",ue)),ue(),document.querySelectorAll(".comparison-toggle").forEach(l=>l.addEventListener("change",me)),me(),document.querySelectorAll('input[name="systemMode"]').forEach(l=>l.addEventListener("change",a=>{const n=a.target.value,r=document.getElementById("hybrid-params");n==="hybrid"?r.classList.remove("hidden"):r.classList.add("hidden")})),document.querySelectorAll('input[name="financeMode"]').forEach(l=>l.addEventListener("change",a=>{const n=a.target.value,r=document.getElementById("bot-params");n==="bot"?r.classList.remove("hidden"):r.classList.add("hidden")}))}function Ue(){let e=parseInt(localStorage.getItem("heat_pump_usage_count")||"0");e++,localStorage.setItem("heat_pump_usage_count",e),xe(e)}function xe(e=null){e===null&&(e=parseInt(localStorage.getItem("heat_pump_usage_count")||"0")),document.querySelectorAll("#usage-counter").forEach(s=>s.textContent=`累计运行：${e} 次`)}function We(){document.querySelectorAll(".unit-converter").forEach(e=>{e.dataset.prevUnit=e.value,e.addEventListener("change",t=>{const s=e.dataset.targetInput,o=document.getElementById(s),l=e.value,a=e.dataset.prevUnit;if(o&&o.value){const n=parseFloat(o.value),r=de[a],i=de[l];if(r&&i){const c=n*(r/i);o.value=parseFloat(c.toPrecision(5)),o.classList.add("text-blue-600","font-bold"),o.classList.remove("text-gray-900")}}e.dataset.prevUnit=l})})}function Je(){document.querySelectorAll("input[data-default], select[data-default]").forEach(e=>{e.addEventListener("input",()=>{if(e.type==="checkbox")return;e.value!=e.dataset.default?(e.classList.add("text-blue-600","border-blue-500"),e.classList.remove("text-gray-900","border-gray-300")):(e.classList.remove("text-blue-600","border-blue-500"),e.classList.add("text-gray-900","border-gray-300"))})})}function pe(e="",t="",s=""){const o=document.getElementById("priceTiersContainer");if(!o)return;const l=document.createElement("div");l.className="price-tier-entry flex gap-2 items-center mb-2",l.innerHTML=`
        <input type="text" class="tier-name w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="时段" value="${e}">
        <input type="number" class="tier-price w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="价格" value="${t}">
        <span class="text-gray-400 text-base font-bold">@</span>
        <input type="number" class="tier-dist w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="%" value="${s}">
        <button type="button" class="text-red-500 hover:text-red-700 px-2 text-xl font-bold remove-tier-btn transition">×</button>
    `,l.querySelector(".remove-tier-btn").addEventListener("click",()=>{var a;o.children.length>1?(l.remove(),(a=document.getElementById("calculateBtn"))==null||a.click()):alert("至少保留一个电价时段")}),l.querySelectorAll("input").forEach(a=>{a.addEventListener("change",()=>{var n;return(n=document.getElementById("calculateBtn"))==null?void 0:n.click()})}),o.appendChild(l)}function ee(e,t,s){const o=document.getElementById(e);o&&(o.innerHTML=`
        <button class="accordion-header flex justify-between items-center w-full px-4 md:px-6 py-4 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200 cursor-pointer" type="button" aria-expanded="true" aria-controls="${e}-content">
            <span class="text-lg font-extrabold text-gray-900 tracking-wide">${t}</span>
            <svg class="accordion-icon w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div id="${e}-content" class="accordion-content open px-4 md:px-6 py-4 md:py-6 border-t border-gray-100">
            ${s}
        </div>
    `)}function ue(){const e=document.querySelector('input[name="calcMode"]:checked').value;document.getElementById("input-group-load").classList.toggle("hidden",e==="total"),document.getElementById("input-group-hours-a").classList.toggle("hidden",e!=="annual"),document.getElementById("input-group-total").classList.toggle("hidden",e!=="total"),document.getElementById("input-group-daily").classList.toggle("hidden",e!=="daily")}function me(){document.querySelectorAll(".comparison-toggle").forEach(e=>{const t=e.dataset.target;document.querySelectorAll(`.related-to-${t}`).forEach(o=>{const l=o.querySelectorAll("input:not(.comparison-toggle), button");e.checked?(o.classList.remove("opacity-40","grayscale"),l.forEach(a=>a.disabled=!1)):(o.classList.add("opacity-40","grayscale"),l.forEach(a=>a.disabled=!0))})})}function Ye(e,t,s){const o=document.getElementById(e),l=document.getElementById(t);!o||!l||o.addEventListener("change",()=>{})}function ze(){confirm("确定要恢复默认参数吗？")&&location.reload()}function Ve(){const e=document.getElementById("export-report-btn");e&&e.addEventListener("click",()=>{if(!le){alert("请先进行计算");return}buildPrintReport(le),setTimeout(()=>{window.print()},500)})}function Ge(e){var v,E;const t=y=>{const C=document.getElementById(y);return C&&parseFloat(C.value)||0},s=(y,C)=>{let L=t(y);const $=document.getElementById(C);return $&&L>0?{value:L,unit:$.value}:{value:L,unit:"MJ"}},o=[];document.querySelectorAll(".price-tier-entry").forEach(y=>{o.push({name:y.querySelector(".tier-name").value,price:parseFloat(y.querySelector(".tier-price").value)||0,dist:parseFloat(y.querySelector(".tier-dist").value)||0})}),o.length===0&&o.push({name:"默认",price:.7,dist:100});const l=document.querySelector('input[name="calcMode"]:checked').value;let a=0,n=0,r=0;l==="annual"?(a=t("heatingLoad"),n=t("operatingHours"),r=a*n):l==="total"?(r=t("annualHeating"),n=t("operatingHours_B"),a=n>0?r/n:0):(a=t("heatingLoad"),n=t("dailyHours")*t("annualDays")*(t("loadFactor")/100),r=a*n);const i=((v=document.getElementById("greenPowerToggle"))==null?void 0:v.checked)||!1,c=document.querySelector('input[name="systemMode"]:checked').value==="hybrid",d=document.querySelector('input[name="financeMode"]:checked').value==="bot",g=((E=document.getElementById("hybridAuxHeaterType"))==null?void 0:E.value)||"electric";return{projectName:document.getElementById("projectName").value,analysisMode:"standard",isHybridMode:c,hybridLoadShare:c?t("hybridLoadShare"):100,hybridAuxHeaterCapex:c?t("hybridAuxHeaterCapex")*1e4:0,hybridAuxHeaterType:g,hybridAuxHeaterOpex:c?t("hybridAuxHeaterOpex")*1e4:0,isBOTMode:d,botAnnualRevenue:t("botAnnualRevenue")*1e4,botEquityRatio:t("botEquityRatio")/100,priceTiers:o,heatingLoad:a,operatingHours:n,annualHeatingDemandKWh:r,lccYears:t("lccYears"),discountRate:t("discountRate")/100,energyInflationRate:t("energyInflationRate")/100,opexInflationRate:t("opexInflationRate")/100,hpHostCapex:t("hpCapex")*1e4,hpStorageCapex:t("storageCapex")*1e4,hpSalvageRate:t("hpSalvageRate")/100,hpCop:t("hpCop"),hpOpexCost:t("hpOpexCost")*1e4,gasCalorificObj:s("gasCalorific","gasCalorificUnit"),coalCalorificObj:s("coalCalorific","coalCalorificUnit"),fuelCalorificObj:s("fuelCalorific","fuelCalorificUnit"),biomassCalorificObj:s("biomassCalorific","biomassCalorificUnit"),steamCalorificObj:s("steamCalorific","steamCalorificUnit"),gridFactor:i?0:t("gridFactor"),gasFactor:t("gasFactor"),coalFactor:t("coalFactor"),fuelFactor:t("fuelFactor"),biomassFactor:t("biomassFactor"),steamFactor:t("steamFactor"),gasBoilerCapex:t("gasBoilerCapex")*1e4,gasSalvageRate:.05,gasBoilerEfficiency:t("gasBoilerEfficiency")/100,gasPrice:t("gasPrice"),gasOpexCost:t("gasOpexCost")*1e4,fuelBoilerCapex:t("fuelBoilerCapex")*1e4,fuelSalvageRate:.05,fuelBoilerEfficiency:t("fuelBoilerEfficiency")/100,fuelPrice:t("fuelPrice"),fuelOpexCost:t("fuelOpexCost")*1e4,coalBoilerCapex:t("coalBoilerCapex")*1e4,coalSalvageRate:.05,coalBoilerEfficiency:t("coalBoilerEfficiency")/100,coalPrice:t("coalPrice"),coalOpexCost:t("coalOpexCost")*1e4,steamCapex:t("steamBoilerCapex")*1e4,steamSalvageRate:0,steamEfficiency:.98,steamPrice:t("steamPrice"),steamOpexCost:t("steamOpexCost")*1e4,compare:{gas:document.getElementById("compare_gas").checked,coal:document.getElementById("compare_coal").checked,fuel:document.getElementById("compare_fuel").checked,electric:document.getElementById("compare_electric").checked,steam:document.getElementById("compare_steam").checked,biomass:document.getElementById("compare_biomass").checked},biomassBoilerCapex:t("biomassBoilerCapex")*1e4,biomassSalvageRate:0,biomassBoilerEfficiency:t("biomassBoilerEfficiency")/100,biomassPrice:t("biomassPrice"),biomassOpexCost:t("biomassOpexCost")*1e4,electricBoilerCapex:t("electricBoilerCapex")*1e4,electricSalvageRate:.05,electricBoilerEfficiency:t("electricBoilerEfficiency")/100,electricOpexCost:t("electricOpexCost")*1e4,isGreenElectricity:i}}function Ke(e){le=e,Te(),ge(),Se();const t=e.comparisons.sort((a,n)=>n.annualSaving-a.annualSaving)[0],s="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black text-gray-800 mt-2 md:mt-3 tracking-tighter truncate";if(t){q("annual-saving",`${R(t.annualSaving)} 万`,s);let a="--";t.irr===null||t.irr===-1/0||t.irr<-1?a="无法回收":a=K(t.irr),q("irr",a,s),q("pbp",`${t.dynamicPBP} 年`,s),q("co2-reduction",`${ce(t.co2Reduction,1)} 吨`,s)}else q("annual-saving","--",s),q("irr","--",s);setTimeout(()=>{Oe();const a=["热泵",...e.comparisons.map(d=>d.name)],n=[e.hp.annualEnergyCost/1e4,...e.comparisons.map(d=>d.annualEnergyCost/1e4)],r=[e.hp.annualOpex/1e4,...e.comparisons.map(d=>d.annualOpex/1e4)],i=document.getElementById("costComparisonChart");i&&Pe(i,a,n,r);const c=document.getElementById("lccBreakdownChart");if(c){const d=e.hp.lcc;Me(c,[d.capex/1e4,d.energy/1e4,d.opex/1e4,d.residual/1e4])}},100);const o=document.getElementById("tab-data-table");o&&(o.innerHTML=`
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
                            <td class="px-4 py-4 whitespace-nowrap text-right text-blue-800">${Q(e.hp.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">${R(e.hp.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${R(e.hp.lcc.total)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${e.comparisons.map(a=>`
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-4 whitespace-nowrap font-bold text-gray-800">${a.name}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${Q(a.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-bold text-green-600">${K(a.savingRate)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${R(a.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-bold text-green-600">${R(a.annualSaving)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-medium">${a.dynamicPBP} 年</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-bold text-blue-600">${a.irr===null||a.irr<-1?'<span class="text-gray-400">N/A</span>':K(a.irr)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium hidden lg:table-cell">${R(a.lccTotal)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-green-600 font-bold hidden lg:table-cell">${ce(a.co2Reduction,1)}</td>
                        </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            <p class="text-sm text-gray-400 mt-4 md:mt-6">* 注：LCC (全生命周期成本) 已包含资金时间价值，折现率 ${K(e.inputs.discountRate)}。<br>* 折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。</p>
        `);const l=document.getElementById("tab-conclusion");if(l&&t){const a=t.irr>.08;l.innerHTML=`
            <div class="p-6 md:p-8 ${a?"bg-green-50 border border-green-200":"bg-yellow-50 border border-yellow-200"} rounded-2xl">
                <h3 class="text-xl md:text-3xl font-extrabold ${a?"text-green-800":"text-yellow-800"} mb-4">${a?"🚀 推荐投资":"⚖️ 投资回报一般"}</h3>
                <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                    相比于 <strong>${t.name}</strong>，工业热泵方案预计每年可节省 <strong>${R(t.annualSaving)} 万元</strong>，综合费用节能率达 <strong>${K(t.savingRate)}</strong>。
                    <br><br>
                    您的热泵供热成本相当于 <strong>${Q(e.hp.unitSteamCost,1)} 元/吨蒸汽</strong>，而${t.name}的成本为 <strong>${Q(t.unitSteamCost,1)} 元/吨</strong>。
                    <br><br>
                    全生命周期（${e.inputs.lccYears}年）累计节省 <strong>${R(t.lccSaving)} 万元</strong>。动态回收期为 ${t.dynamicPBP} 年。
                </p>
            </div>
        `}}let ae=null;function Ze(){const e=document.getElementById("eff-calc-modal"),t=document.getElementById("eff-calc-close-btn"),s=document.getElementById("ec-calc-btn"),o=document.getElementById("ec-apply-btn"),l=document.getElementById("ec-fuel-unit");if(!e)return;const a=r=>{const i=Ee[r];i&&(r==="water"?(document.getElementById("ec-water-mass").value=i.mass,document.getElementById("ec-water-in-temp").value=i.tempIn,document.getElementById("ec-water-out-temp").value=i.tempOut):(document.getElementById("ec-steam-mass").value=i.mass,document.getElementById("ec-steam-pressure").value=i.pressure,document.getElementById("ec-steam-feed-temp").value=i.feedTemp))};document.querySelectorAll('input[name="ec-output-type"]').forEach(r=>{r.addEventListener("change",i=>{const c=i.target.value,d=document.getElementById("ec-water-params"),g=document.getElementById("ec-steam-params");c==="water"?(d.classList.remove("hidden"),g.classList.add("hidden")):(d.classList.add("hidden"),g.classList.remove("hidden")),a(c)})}),document.body.addEventListener("click",r=>{const i=r.target.closest(".eff-calc-btn");if(i){r.preventDefault();const c=i.dataset.target,d=i.dataset.fuel;ae=c;const g=document.getElementById("ec-fuel-type");g&&(g.value=d,l.textContent=d==="gas"?"m³":"kg"),document.querySelector('input[name="ec-output-type"][value="water"]').click(),e.classList.remove("hidden")}}),t&&t.addEventListener("click",()=>e.classList.add("hidden")),s&&s.addEventListener("click",()=>{const r=document.getElementById("ec-fuel-type").value,i=parseFloat(document.getElementById("ec-fuel-amount").value);let c=0;r==="gas"?c=parseFloat(document.getElementById("gasCalorific").value):r==="fuel"?c=parseFloat(document.getElementById("fuelCalorific").value):r==="coal"?c=parseFloat(document.getElementById("coalCalorific").value):r==="biomass"&&(c=parseFloat(document.getElementById("biomassCalorific").value));const d=document.querySelector('input[name="ec-output-type"]:checked').value;let g={};d==="water"?g={mass:parseFloat(document.getElementById("ec-water-mass").value),tempIn:parseFloat(document.getElementById("ec-water-in-temp").value),tempOut:parseFloat(document.getElementById("ec-water-out-temp").value)}:g={mass:parseFloat(document.getElementById("ec-steam-mass").value),pressure:parseFloat(document.getElementById("ec-steam-pressure").value),feedTemp:parseFloat(document.getElementById("ec-steam-feed-temp").value)};const v=we(r,i,c,d,g),E=document.getElementById("ec-result-display");v.error?(E.textContent="Error",E.className="text-3xl font-black text-red-500 tracking-tight",o.disabled=!0):(E.textContent=v.efficiency.toFixed(1)+" %",E.className="text-3xl font-black text-blue-600 tracking-tight",o.disabled=!1,o.dataset.value=v.efficiency.toFixed(1))}),o&&o.addEventListener("click",()=>{var r;if(ae&&o.dataset.value){const i=document.getElementById(ae);i&&(i.value=o.dataset.value,e.classList.add("hidden"),(r=document.getElementById("calculateBtn"))==null||r.click())}})}const ye=697.8;function D(e){if(!e||!e.value)return 0;const t=ve[e.unit]||1;return e.value*t}function Xe(e){const{heatingLoad:t,operatingHours:s,annualHeatingDemandKWh:o,lccYears:l,discountRate:a,energyInflationRate:n,opexInflationRate:r,hpHostCapex:i,hpStorageCapex:c,hpSalvageRate:d,hpCop:g,hpOpexCost:v,priceTiers:E,gridFactor:y,isHybridMode:C,hybridLoadShare:L,hybridAuxHeaterCapex:$,hybridAuxHeaterType:Z,hybridAuxHeaterOpex:S}=e;let B=0;if(E&&E.length>0){let x=0,w=0;E.forEach(h=>{w+=h.price*h.dist,x+=h.dist}),B=x>0?w/x:.7}else B=.7;const T=C?L/100:1,W=o*T,J=o*(1-T),Y=W/g,H=Y*B,X=Y*y/1e3;let P=0,F=0;if(C&&J>0){let x=0,w=1,h=0,k=0,A="ton";switch(Z){case"gas":x=e.gasPrice,w=e.gasBoilerEfficiency,h=D(e.gasCalorificObj),k=e.gasFactor,A="m3";break;case"coal":x=e.coalPrice,w=e.coalBoilerEfficiency,h=D(e.coalCalorificObj),k=e.coalFactor,A="ton";break;case"fuel":x=e.fuelPrice,w=e.fuelBoilerEfficiency,h=D(e.fuelCalorificObj),k=e.fuelFactor,A="ton";break;case"biomass":x=e.biomassPrice,w=e.biomassBoilerEfficiency,h=D(e.biomassCalorificObj),k=e.biomassFactor,A="ton";break;case"steam":x=e.steamPrice,w=e.steamEfficiency,h=D(e.steamCalorificObj),k=e.steamFactor,A="ton";break;case"electric":default:x=B,w=e.electricBoilerEfficiency,h=3.6,k=y,A="kwh";break}if(w>0&&h>0){const te=J*3.6/(h*w);A==="ton"?P=te/1e3*x:P=te*x,F=te*k/1e3}}const j=i+c+(C?$:0),z=H+P,f=v+(C?S:0),N=z+f,V=X+F;let M=j,_=0,G=0;for(let x=1;x<=l;x++){const w=z*Math.pow(1+n,x-1),h=f*Math.pow(1+r,x-1),k=1/Math.pow(1+a,x);_+=w*k,G+=h*k}const ne=j*d/Math.pow(1+a,l);M=M+_+G-ne;const ie=o/ye,he=ie>0?N/ie:0;return{avgElecPrice:B,initialInvestment:j,annualEnergyCost:z,annualOpex:f,annualTotalCost:N,co2:V,unitSteamCost:he,breakdown:{hpEnergy:H,auxEnergy:P,hpOpex:v,auxOpex:C?S:0},lcc:{total:M,capex:j,energy:_,opex:G,residual:-ne}}}function Qe(e,t){const s=[],o=e.annualHeatingDemandKWh/ye,l=(a,n,r,i,c,d,g,v,E)=>{let y=0;if(typeof c=="object"?y=D(c):y=c,r<=0||y<=0)return null;let L=e.annualHeatingDemandKWh*3.6/(y*r),$=0;E==="ton"?$=L/1e3*i:$=L*i;const Z=L*g/1e3,S=$+d;let B=n;for(let f=1;f<=e.lccYears;f++){const N=$*Math.pow(1+e.energyInflationRate,f-1),V=d*Math.pow(1+e.opexInflationRate,f-1);B+=(N+V)/Math.pow(1+e.discountRate,f)}B-=n*v/Math.pow(1+e.discountRate,e.lccYears);const T=t.initialInvestment-n,W=S-t.annualTotalCost,J=[-T];let Y="> "+e.lccYears,H=-T,X=!1,P=0;for(let f=1;f<=e.lccYears;f++){const N=$*Math.pow(1+e.energyInflationRate,f-1)+d*Math.pow(1+e.opexInflationRate,f-1),V=t.annualEnergyCost*Math.pow(1+e.energyInflationRate,f-1)+t.annualOpex*Math.pow(1+e.opexInflationRate,f-1),M=N-V;J.push(M),P+=M;const _=M/Math.pow(1+e.discountRate,f),G=H;if(H+=_,!X&&H>=0){const re=Math.abs(G)/_;Y=(f-1+re).toFixed(1),X=!0}}let F=null;T>0?P<T?F=null:F=et(J):t.annualTotalCost<S?F=9.99:F=null;const j=S>0?W/S:0,z=o>0?S/o:0;return{name:a,initialInvestment:n,annualEnergyCost:$,annualOpex:d,annualTotalCost:S,co2:Z,lccTotal:B,annualSaving:W,savingRate:j,unitSteamCost:z,paybackPeriod:T>0?(T/W).toFixed(1)+" 年":"立即",dynamicPBP:Y,irr:F,lccSaving:B-t.lcc.total,co2Reduction:Z-t.co2}};return e.compare.gas&&s.push(l("天然气锅炉",e.gasBoilerCapex,e.gasBoilerEfficiency,e.gasPrice,e.gasCalorificObj,e.gasOpexCost,e.gasFactor,e.gasSalvageRate,"m3")),e.compare.coal&&s.push(l("燃煤锅炉",e.coalBoilerCapex,e.coalBoilerEfficiency,e.coalPrice,e.coalCalorificObj,e.coalOpexCost,e.coalFactor,e.coalSalvageRate,"ton")),e.compare.fuel&&s.push(l("燃油锅炉",e.fuelBoilerCapex,e.fuelBoilerEfficiency,e.fuelPrice,e.fuelCalorificObj,e.fuelOpexCost,e.fuelFactor,e.fuelSalvageRate,"ton")),e.compare.biomass&&s.push(l("生物质锅炉",e.biomassBoilerCapex,e.biomassBoilerEfficiency,e.biomassPrice,e.biomassCalorificObj,e.biomassOpexCost,e.biomassFactor,e.biomassSalvageRate,"ton")),e.compare.electric&&s.push(l("电锅炉",e.electricBoilerCapex,e.electricBoilerEfficiency,t.avgElecPrice,3.6,e.electricOpexCost,e.gridFactor,e.electricSalvageRate,"kwh")),e.compare.steam&&s.push(l("管网蒸汽",e.steamCapex,e.steamEfficiency,e.steamPrice,e.steamCalorificObj,e.steamOpexCost,e.steamFactor,e.steamSalvageRate,"ton")),s.filter(a=>a!==null)}function et(e,t=.1){let l=t;for(let a=0;a<100;a++){let n=0,r=0;for(let c=0;c<e.length;c++)n+=e[c]/Math.pow(1+l,c),r-=c*e[c]/Math.pow(1+l,c+1);const i=l-n/r;if(Math.abs(i-l)<1e-6)return i;l=i}return null}function be(){const e=Ge();if(!e)return;const t=Xe(e),s=Qe(e,t),o={inputs:e,hp:t,comparisons:s,isHybridMode:e.isHybridMode};Ke(o)}document.addEventListener("DOMContentLoaded",()=>{console.log("Phoenix Plan V19.16 (Flexible Hybrid) Initializing..."),qe(be),setTimeout(()=>be(),500)});
