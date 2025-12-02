(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function l(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=l(a);fetch(a.href,n)}})();const Be={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},b={hp:{cop:3,opex:2.5},electric:{price:.7,calorific:3.6,factor:.57,boilerEff:98,opex:.4,capex:50},gas:{price:4.2,calorific:36,factor:1.97,boilerEff:92,opex:1.8,capex:80},coal:{price:1e3,calorific:21,factor:2.42,boilerEff:80,opex:6.8,capex:60},fuel:{price:8e3,calorific:42,factor:3.1,boilerEff:90,opex:1.9,capex:70},biomass:{price:850,calorific:15,factor:0,boilerEff:85,opex:6.3,capex:75},steam:{price:280,calorific:2.8,factor:.35,boilerEff:95,opex:0,capex:0}},$e={water:{mass:100,tempIn:15,tempOut:60},steam:{mass:10,pressure:.8,feedTemp:20}};function B(e,t=2){const l=parseFloat(e);return isNaN(l)?"-":(l/1e4).toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function ee(e,t=2){const l=parseFloat(e);return isNaN(l)?"-":l.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function ce(e,t=2){const l=parseFloat(e);return isNaN(l)?"-":l.toLocaleString("zh-CN",{minimumFractionDigits:t,maximumFractionDigits:t})}function j(e,t=1){const l=parseFloat(e);return isNaN(l)?"-":(l*100).toFixed(t)+"%"}function ke(e,t,l,o,a){if(!t||!l)return{error:"请输入有效的燃料消耗量和热值"};const n=t*l/1e3;let s=0;if(o==="water"){const{mass:i,tempIn:c,tempOut:m}=a;if(!i||c===void 0||!m)return{error:"请输入完整的热水参数"};const u=m-c;s=4.186*(i*1e3)*u/1e6}else if(o==="steam"){const{mass:i,pressure:c,feedTemp:m}=a;if(!i||!c||m===void 0)return{error:"请输入完整的蒸汽参数"};const u=2770,v=4.186*m;s=i*1e3*(u-v)/1e6}return n<=0?{error:"计算得出的投入能量无效"}:{efficiency:s/n*100,inputEnergy:n,outputEnergy:s,error:null}}const z={activeTab:"charts",notifierTimeout:null};function Le(){Ie(),Te(),Fe(),se(z.activeTab)}function Ie(){document.querySelectorAll(".accordion-header").forEach(t=>{t.addEventListener("click",()=>{const l=t.getAttribute("aria-controls"),o=document.getElementById(l),a=t.getAttribute("aria-expanded")==="true";Se(t,o,!a)})})}function Se(e,t,l){!e||!t||(l?(t.classList.remove("hidden"),requestAnimationFrame(()=>{t.classList.add("open"),e.setAttribute("aria-expanded","true")})):(t.classList.remove("open"),e.setAttribute("aria-expanded","false"),setTimeout(()=>{e.getAttribute("aria-expanded")==="false"&&t.classList.add("hidden")},300)))}function Te(){document.querySelectorAll(".tab-link").forEach(t=>{t.addEventListener("click",l=>{l.preventDefault();const o=t.dataset.tab;o&&se(o)})})}function se(e){document.querySelectorAll(".tab-link").forEach(t=>{t.dataset.tab===e?t.classList.add("tab-active"):t.classList.remove("tab-active")}),document.querySelectorAll(".tab-content").forEach(t=>{t.id===`tab-${e}`?(t.classList.remove("hidden"),Re(t)):t.classList.add("hidden")}),z.activeTab=e}function Re(e){e.querySelectorAll("canvas").forEach(l=>{window.dispatchEvent(new Event("resize"))})}function Fe(){const e=document.getElementById("input-sidebar"),t=document.getElementById("mobile-open-config"),l=document.getElementById("mobile-sidebar-close"),o=document.getElementById("calculateBtn");if(!e)return;const a=n=>{n?(e.classList.remove("translate-y-full"),e.classList.add("translate-y-0"),document.body.style.overflow="hidden"):(e.classList.remove("translate-y-0"),e.classList.add("translate-y-full"),document.body.style.overflow="")};t&&t.addEventListener("click",()=>a(!0)),l&&l.addEventListener("click",()=>a(!1)),o&&o.addEventListener("click",()=>{window.innerWidth<768&&(a(!1),setTimeout(()=>he(),300))})}function Pe(e){const t=document.getElementById("export-report-btn");t&&(t.disabled=!1,t.classList.remove("opacity-50","cursor-not-allowed"),t.classList.add("hover:bg-blue-700","shadow-md"))}function he(){const e=document.getElementById("main-results-area");e&&(e.scrollIntoView({behavior:"smooth",block:"start"}),window.scrollTo({top:0,behavior:"smooth"}))}function Oe(){const e=document.getElementById("report-placeholder"),t=document.getElementById("report-content");e&&e.classList.add("hidden"),t&&t.classList.remove("hidden"),se(z.activeTab)}function W(e,t,l=null){const o=document.getElementById(`card-${e}`);o&&(o.textContent=t,l&&(o.className=o.className.replace(/text-(green|yellow|red|gray)-\d+/,""),o.classList.add(...l.split(" "))))}function me(e,t="info",l=3e3){const o=document.getElementById("global-notifier"),a=document.getElementById("global-notifier-text");!o||!a||(z.notifierTimeout&&clearTimeout(z.notifierTimeout),a.textContent=e,o.className="fixed top-8 right-8 z-[100] max-w-lg p-6 rounded-2xl shadow-2xl transition-all duration-300 transform",t==="success"?o.classList.add("bg-green-100","text-green-800"):t==="error"?o.classList.add("bg-red-100","text-red-800"):o.classList.add("bg-blue-100","text-blue-800"),o.classList.remove("translate-x-full","hidden"),z.notifierTimeout=setTimeout(()=>{o.classList.add("translate-x-full"),setTimeout(()=>o.classList.add("hidden"),300)},l))}const Y=window.innerWidth<768,ve=Y?11:16,Me=Y?12:18,Ae=Y?14:20;Chart.defaults.font.family="'Inter', 'Noto Sans SC', sans-serif";Chart.defaults.font.size=ve;Chart.defaults.color="#475569";Chart.defaults.scale.grid.color="#e2e8f0";Chart.defaults.scale.grid.lineWidth=1;Chart.defaults.plugins.legend.labels.font={size:Me,weight:"bold"};Chart.defaults.plugins.legend.labels.boxWidth=Y?12:20;Chart.defaults.plugins.legend.labels.padding=Y?10:25;Chart.defaults.plugins.tooltip.backgroundColor="rgba(15, 23, 42, 0.95)";Chart.defaults.plugins.tooltip.titleFont={size:Ae,weight:"bold"};Chart.defaults.plugins.tooltip.bodyFont={size:ve};Chart.defaults.plugins.tooltip.padding=12;Chart.defaults.plugins.tooltip.cornerRadius=8;const M={hp:{fill:"rgba(37, 99, 235, 0.9)"},gas:{fill:"rgba(234, 88, 12, 0.9)"},fuel:{fill:"rgba(220, 38, 38, 0.9)"},coal:{fill:"rgba(71, 85, 105, 0.9)"},biomass:{fill:"rgba(22, 163, 74, 0.9)"},electric:{fill:"rgba(147, 51, 234, 0.9)"},steam:{fill:"rgba(8, 145, 178, 0.9)"},opex:"#f59e0b"};let S={cost:null,lcc:null};function He(){S.cost&&(S.cost.destroy(),S.cost=null),S.lcc&&(S.lcc.destroy(),S.lcc=null)}function Ne(e,t,l,o){const a=s=>{if(!s)return"#cbd5e1";const r=s.toLowerCase();return r.includes("热泵")||r.includes("hp")?M.hp.fill:r.includes("气")||r.includes("gas")?M.gas.fill:r.includes("油")||r.includes("fuel")||r.includes("oil")?M.fuel.fill:r.includes("煤")||r.includes("coal")?M.coal.fill:r.includes("生物")||r.includes("bio")?M.biomass.fill:r.includes("电")||r.includes("elec")?M.electric.fill:r.includes("蒸汽")||r.includes("steam")?M.steam.fill:"#9ca3af"},n=t.map(s=>a(s));return S.cost=new Chart(e,{type:"bar",data:{labels:t,datasets:[{label:"能源成本",data:l,backgroundColor:n,borderRadius:4,stack:"Stack 0",barPercentage:.6},{label:"运维成本",data:o,backgroundColor:M.opex,borderRadius:4,stack:"Stack 0",barPercentage:.6}]},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{position:"top",align:"end"},tooltip:{callbacks:{label:s=>{let r=s.dataset.label||"";return r&&(r+=": "),s.parsed.y!==null&&(r+=parseFloat(s.parsed.y).toFixed(2)+" 万"),r},footer:s=>{let r=0;return s.forEach(function(i){r+=i.parsed.y}),"总计: "+r.toFixed(2)+" 万"}}}},scales:{y:{beginAtZero:!0,title:{display:!Y,text:"万元/年",font:{size:14,weight:"bold"}},stacked:!0,border:{display:!1},ticks:{padding:10}},x:{stacked:!0,grid:{display:!1},ticks:{font:{weight:"bold"},maxRotation:45,minRotation:0}}}}}),S.cost}function je(e,t){const l=t.map(o=>Math.abs(o));return S.lcc=new Chart(e,{type:"doughnut",data:{labels:["初始投资","全周期能源","全周期运维","残值回收"],datasets:[{data:l,backgroundColor:["#ef4444","#3b82f6","#f59e0b","#10b981"],borderWidth:0,hoverOffset:15}]},options:{responsive:!0,maintainAspectRatio:!1,cutout:"60%",plugins:{legend:{position:"right",labels:{padding:20}},tooltip:{callbacks:{label:o=>{const a=o.raw,n=o.chart._metasets[o.datasetIndex].total,s=(a/n*100).toFixed(1)+"%",r=o.label;return r==="残值回收"?` ${r}: -${a.toFixed(1)} 万 (${s})`:` ${r}: ${a.toFixed(1)} 万 (${s})`}}}}}}),S.lcc}let C=null,T=[],re=[];const d=e=>`value="${e}" data-default="${e}"`,be={MJ:1,kJ:.001,kcal:.004186,kWh:3.6},f="w-full px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg text-base md:text-lg font-bold text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none placeholder-gray-400 h-10 md:h-12 shadow-sm",p="block text-sm font-bold text-gray-600 mb-1 md:mb-2 tracking-wide",_e="bg-white p-1 mb-4 md:mb-6";function qe(){return`
        <div class="${_e}">
            <label class="${p}">项目名称</label>
            <input type="text" id="projectName" ${d("示例项目")} class="${f}">
        </div>

        <div class="pt-4 md:pt-6 border-t border-gray-200">
            <label class="${p} mb-3 md:mb-4">负荷计算模式</label>
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
                    <label class="${p} !mb-0">制热负荷 (设计值)</label>
                    <select id="heatingLoadUnit" class="text-xs md:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer hover:bg-blue-100 transition"><option value="kW">kW</option><option value="kcal/h">kcal/h</option></select>
                </div>
                <input type="number" id="heatingLoad" ${d("1000")} class="${f}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-hours-a" class="space-y-4 md:space-y-6 mt-4 md:mt-6">
            <div>
                <label class="${p}">年运行小时 (h)</label>
                <input type="number" id="operatingHours" ${d("2000")} class="${f}" data-validation="isPositive">
            </div>
        </div>

        <div id="input-group-total" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div>
                <div class="flex justify-between items-center mb-1 md:mb-2">
                    <label class="${p} !mb-0">年总加热量</label>
                    <select id="annualHeatingUnit" class="text-xs md:text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md px-2 py-1 cursor-pointer"><option value="kWh">kWh</option><option value="GJ">GJ</option><option value="万大卡">万大卡</option></select>
                </div>
                <input type="number" id="annualHeating" ${d("2000000")} class="${f}" data-validation="isPositive">
            </div>
            <div>
                <label class="${p}">年运行小时 (反推)</label>
                <input type="number" id="operatingHours_B" ${d("2000")} class="${f}" placeholder="自动计算">
            </div>
        </div>

        <div id="input-group-daily" class="space-y-4 md:space-y-6 mt-4 md:mt-6 hidden">
            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${p}">日运行 (h)</label>
                    <input type="number" id="dailyHours" ${d("8")} class="${f}">
                </div>
                <div>
                    <label class="${p}">年天数 (d)</label>
                    <input type="number" id="annualDays" ${d("300")} class="${f}">
                </div>
            </div>
            <div>
                <label class="${p}">平均负荷率 (%)</label>
                <input type="number" id="loadFactor" ${d("70")} class="${f}">
            </div>
        </div>
    `}function De(){return`
        <div class="mb-6">
            <label class="${p} mb-3">系统模式 (System Mode)</label>
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
                <label class="${p}">热泵投资 (万)</label>
                <input type="number" id="hpCapex" ${d(b.hp.capex||"200")} class="${f}" data-validation="isPositive">
            </div>
            <div>
                <label class="${p}">储能投资 (万)</label>
                <input type="number" id="storageCapex" ${d("0")} class="${f}">
            </div>
        </div>

        <div id="hybrid-params" class="hidden mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl animate-fadeIn">
             <h4 class="text-sm font-bold text-orange-800 mb-4 flex items-center"><span class="mr-2">🔥</span>混合动力配置</h4>
             <div class="space-y-4">
                 <div>
                    <label class="${p} text-orange-900">辅助热源类型</label>
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
                    <label class="${p} flex justify-between text-orange-900">
                        <span>热泵承担负荷 (%)</span>
                        <span class="text-xs text-orange-600 font-normal">剩余由辅热承担</span>
                    </label>
                    <input type="number" id="hybridLoadShare" ${d("50")} class="${f} border-orange-200 focus:border-orange-500 text-orange-900">
                 </div>
                 <div class="grid grid-cols-2 gap-3">
                     <div>
                        <label class="${p} text-orange-900">辅热投资 (万)</label>
                        <input type="number" id="hybridAuxHeaterCapex" ${d("30")} class="${f} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                     <div>
                        <label class="${p} text-orange-900">辅热运维 (万)</label>
                        <input type="number" id="hybridAuxHeaterOpex" ${d("0.5")} class="${f} border-orange-200 focus:border-orange-500 text-orange-900">
                     </div>
                 </div>
             </div>
        </div>
        
        <div class="pt-4 md:pt-6 border-t border-gray-200">
             <label class="block text-base font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                <span class="w-1.5 h-4 bg-blue-600 rounded-full mr-2"></span>对比基准配置
             </label>
             <div class="space-y-2 md:space-y-3">
                ${[{k:"gas",n:"天然气"},{k:"coal",n:"燃煤"},{k:"electric",n:"电锅炉"},{k:"steam",n:"蒸汽"},{k:"fuel",n:"燃油"},{k:"biomass",n:"生物质"}].map(e=>{const t=b[e.k].capex;return`
                    <div class="flex items-center justify-between group related-to-${e.k} transition-all duration-200 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200">
                        <div class="flex items-center">
                            <input type="checkbox" id="compare_${e.k}" data-target="${e.k}" class="comparison-toggle w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" checked>
                            <label for="compare_${e.k}" class="ml-3 text-sm md:text-base font-bold text-gray-700 cursor-pointer select-none">${e.n}</label>
                        </div>
                        <div class="flex items-center gap-2 md:gap-3">
                            <span class="text-xs text-gray-400 font-bold hidden md:inline">投资(万)</span>
                            <div class="relative w-20 md:w-24">
                                <input type="number" id="${e.k}BoilerCapex" ${d(t)} class="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm md:text-base font-bold text-right focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 outline-none transition-all text-gray-700" placeholder="0">
                            </div>
                            <input type="hidden" id="${e.k}SalvageRate" value="${e.k==="steam"?0:5}">
                        </div>
                    </div>
                    `}).join("")}
             </div>
        </div>
    `}function Ue(){return`
        <div>
            <label class="${p} flex justify-between items-center">
                <span>工业热泵 SPF (能效)</span>
                <span class="text-blue-600 text-[10px] md:text-xs font-bold bg-blue-100 px-2 py-0.5 rounded">关键指标</span>
            </label>
            <input type="number" id="hpCop" ${d(b.hp.cop)} step="0.1" class="${f} !text-xl md:!text-2xl !text-blue-700" data-validation="isStrictlyPositive">
        </div>

        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200 space-y-4 md:space-y-6">
             <div>
                <div class="flex justify-between items-center mb-2 md:mb-4">
                    <label class="${p} !mb-0">电价配置 (元/kWh)</label>
                    <button type="button" id="addPriceTierBtn" class="text-[10px] md:text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 px-2 md:px-3 py-1 md:py-1.5 rounded-lg transition">+ 添加</button>
                </div>
                <div id="priceTiersContainer" class="space-y-2 md:space-y-3 mb-2 md:mb-4"></div>
                <input type="hidden" id="simple_avg_price" value="${b.electric.price}" class="track-change"> 
                
                <label class="flex items-center cursor-pointer p-2 md:p-3 bg-green-50/50 border border-green-200 rounded-xl hover:border-green-300 transition">
                    <input type="checkbox" id="greenPowerToggle" class="w-4 h-4 md:w-5 md:h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 track-change">
                    <span class="ml-2 md:ml-3 text-sm md:text-base font-bold text-green-800">启用绿电 (零碳模式)</span>
                </label>
             </div>

             <div class="grid grid-cols-2 gap-3 md:gap-4">
                 <div class="related-to-gas"><label class="${p}">气价 (元/m³)</label><input type="number" id="gasPrice" ${d(b.gas.price)} class="${f}"></div>
                 <div class="related-to-coal"><label class="${p}">煤价 (元/t)</label><input type="number" id="coalPrice" ${d(b.coal.price)} class="${f}"></div>
                 <div class="related-to-steam"><label class="${p}">汽价 (元/t)</label><input type="number" id="steamPrice" ${d(b.steam.price)} class="${f}"></div>
                 <div class="related-to-fuel"><label class="${p}">油价 (元/t)</label><input type="number" id="fuelPrice" ${d(b.fuel.price)} class="${f}"></div>
                 <div class="related-to-biomass"><label class="${p}">生物质 (元/t)</label><input type="number" id="biomassPrice" ${d(b.biomass.price)} class="${f}"></div>
             </div>
        </div>

        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${p} mb-2 md:mb-4">锅炉效率 (%)</label>
            <div class="space-y-2 md:space-y-3">
                ${[{id:"gas",label:"天然气",val:b.gas.boilerEff,hasBtn:!0},{id:"coal",label:"燃煤",val:b.coal.boilerEff,hasBtn:!0},{id:"electric",label:"电锅炉",val:b.electric.boilerEff,hasBtn:!1},{id:"steam",label:"管道蒸汽",val:b.steam.boilerEff,hasBtn:!1},{id:"fuel",label:"燃油",val:b.fuel.boilerEff,hasBtn:!0},{id:"biomass",label:"生物质",val:b.biomass.boilerEff,hasBtn:!0}].map(e=>`
                    <div class="flex items-center gap-2 related-to-${e.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-16 md:w-24 shrink-0 text-right pr-2">${e.label}</span>
                        <div class="flex-1 flex items-center gap-2 min-w-0">
                            <input type="number" id="${e.id}BoilerEfficiency" ${d(e.val)} class="flex-1 px-2 md:px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-base md:text-lg font-bold text-gray-800 focus:bg-white focus:border-blue-500 transition-all text-center h-9 md:h-10 min-w-0">
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
                        <div class="flex items-center"><span class="text-[10px] md:text-xs mr-2 font-bold">排放</span><input id="gridFactor" type="number" ${d(b.electric.factor)} class="w-16 md:w-20 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-xs md:text-sm"><span class="ml-1 md:ml-2 text-[10px] md:text-xs font-bold">kg/kWh</span></div>
                    </div>
                    ${["gas|气|m³","coal|煤|kg","fuel|油|kg","biomass|生物|kg","steam|蒸汽|kg"].map(e=>{const[t,l,o]=e.split("|");return`
                        <div class="bg-gray-50 p-2 md:p-3 rounded-lg flex justify-between items-center border border-gray-200 related-to-${t}">
                            <span class="text-xs md:text-sm font-bold text-gray-700">${l}</span>
                            <div class="flex items-center gap-1 md:gap-2">
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold">热值</span>
                                    <input id="${t}Calorific" type="number" ${d(b[t].calorific)} class="w-12 md:w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-[10px] md:text-sm">
                                    <select id="${t}CalorificUnit" class="ml-0.5 md:ml-1 p-1 border border-gray-300 rounded bg-white text-[10px] md:text-xs font-bold w-12 md:w-16 track-change unit-converter" data-target-input="${t}Calorific">
                                        <option value="MJ" selected>MJ</option>
                                        <option value="kcal">kcal</option>
                                        <option value="kWh">kWh</option>
                                    </select>
                                    <span class="text-xs font-bold text-gray-500 ml-1">/${o}</span>
                                </div>
                                <div class="flex items-center">
                                    <span class="text-[10px] md:text-xs mr-1 font-bold hidden lg:inline">排放</span>
                                    <input id="${t}Factor" type="number" ${d(b[t].factor)} class="w-12 md:w-16 p-1 border border-gray-300 rounded text-right font-bold text-gray-900 text-[10px] md:text-sm">
                                    <span class="text-[10px] md:text-xs font-bold text-gray-500 ml-0.5">kg/${o}</span>
                                </div>
                            </div>
                        </div>`}).join("")}
                </div>
            </details>
        </div>
        <div class="pt-4 md:pt-6 border-t border-dashed border-gray-200">
            <label class="${p} mb-3 md:mb-4">运维成本 (万/年)</label>
            <div class="space-y-3 md:space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-sm md:text-base font-bold text-blue-600 w-20 md:w-24">工业热泵</span>
                    <input type="number" id="hpOpexCost" ${d(b.hp.opex)} class="flex-1 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg text-base md:text-lg font-bold text-blue-800 text-center h-10 md:h-12 shadow-sm">
                </div>
                ${[{id:"gas",label:"天然气",val:b.gas.opex},{id:"coal",label:"燃煤",val:b.coal.opex},{id:"electric",label:"电锅炉",val:b.electric.opex},{id:"steam",label:"蒸汽",val:b.steam.opex},{id:"fuel",label:"燃油",val:b.fuel.opex},{id:"biomass",label:"生物质",val:b.biomass.opex}].map(e=>`
                    <div class="flex items-center justify-between related-to-${e.id}">
                        <span class="text-sm md:text-base font-bold text-gray-600 w-20 md:w-24">${e.label}</span>
                        <input type="number" id="${e.id}OpexCost" ${d(e.val)} class="flex-1 px-3 py-2 bg-gray-50 border border-transparent rounded-lg text-base md:text-lg font-bold text-gray-700 text-center h-10 md:h-12">
                    </div>
                `).join("")}
            </div>
        </div>
    `}function We(){return`
        <div class="mb-6">
            <label class="${p} mb-3">投资模式 (Business Model)</label>
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
                <label class="${p}">分析年限 (年)</label>
                <input type="number" id="lccYears" ${d("15")} class="${f}">
            </div>
            <div>
                <label class="${p}">折现率 (%)</label>
                <input type="number" id="discountRate" ${d("8")} class="${f}">
            </div>
            
            <div id="bot-params" class="hidden p-4 bg-purple-50 border border-purple-100 rounded-xl space-y-4 animate-fadeIn">
                <h4 class="text-sm font-bold text-purple-800 mb-2 flex items-center"><span class="mr-2">💰</span>BOT 参数设置</h4>
                <div><label class="${p}">年服务费收入 (万)</label><input type="number" id="botAnnualRevenue" ${d("150")} class="${f} border-purple-200 focus:border-purple-500 text-purple-900"></div>
                <div><label class="${p}">自有资金比例 (%)</label><input type="number" id="botEquityRatio" ${d("30")} class="${f} border-purple-200 focus:border-purple-500 text-purple-900"></div>
            </div>

            <div class="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                    <label class="${p}">能源涨幅(%)</label>
                    <input type="number" id="energyInflationRate" ${d("3")} class="${f}">
                </div>
                <div>
                    <label class="${p}">运维涨幅(%)</label>
                    <input type="number" id="opexInflationRate" ${d("5")} class="${f}">
                </div>
            </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-200 text-center pb-24">
            <p class="text-sm font-bold text-gray-700">创作：荆炎荣</p>
            <p id="usage-counter" class="text-xs text-blue-500 font-bold mt-1">累计运行：0 次</p>
            <p class="text-[10px] text-gray-400 mt-2 leading-tight px-4">免责声明：本工具计算结果仅供参考，不作为最终投资决策依据。具体参数请咨询专业设计院。</p>
        </div>
    `}function Je(e){oe("accordion-project","1. 项目与负荷",qe()),oe("accordion-scheme","2. 方案与投资",De()),oe("accordion-operating","3. 运行参数",Ue()),oe("accordion-financial","4. 财务模型",We()),Le(),Ke(),Ve(),we(),Ye(),ze();const t=document.getElementById("calculateBtn");t&&t.addEventListener("click",()=>{Ge(),e()}),Ze("heatingLoadUnit","heatingLoad");const l=document.getElementById("addPriceTierBtn");l&&l.addEventListener("click",()=>{fe(),e()}),fe("平均电价",b.electric.price,"100"),at(),Qe();const o=document.getElementById("btn-reset-params");o&&o.addEventListener("click",Xe);const a=document.getElementById("enableScenarioComparison");a&&(a.addEventListener("change",()=>{const n=document.getElementById("saveScenarioBtn"),s=document.querySelector('.tab-link[data-tab="scenarios"]');a.checked?(n&&n.classList.remove("hidden"),s&&s.classList.remove("hidden")):(n&&n.classList.add("hidden"),s&&s.classList.add("hidden"))}),a.dispatchEvent(new Event("change"))),window.updateSimplePriceTier=function(n){}}function ze(){const e=document.getElementById("tab-scenarios");e&&(e.innerHTML=`
             <div id="scenario-table-wrapper" class="hidden overflow-x-auto">
                 <table class="min-w-full divide-y divide-gray-200" id="scenario-comparison-table">
                     <thead class="bg-gray-100">
                         <tr>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">方案名称</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">折算吨汽成本</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">综合节能率</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">投资(万)</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">年总成本(万)</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">年节省(万)</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">动态回收期</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">IRR</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">LCC(万)</th>
                             <th class="px-4 py-3 text-left text-sm font-extrabold text-gray-600 whitespace-nowrap">碳减排(吨)</th>
                             <th class="px-4 py-3"><span class="sr-only">操作</span></th>
                         </tr>
                     </thead>
                     <tbody class="bg-white divide-y divide-gray-100 text-lg font-medium"></tbody>
                 </table>
             </div>
             <div id="scenario-empty-msg" class="text-center text-gray-400 py-10 text-lg font-medium">暂无暂存方案</div>
             <div class="mt-8 flex justify-end gap-4">
                 <button id="undoClearBtn" class="hidden text-base font-bold text-blue-600 hover:text-blue-800">撤销</button>
                 <button id="clearScenariosBtn" class="hidden text-base font-bold text-red-600 hover:text-red-800">清空</button>
             </div>
        `);const t=document.getElementById("saveScenarioBtn");if(t){const o=t.cloneNode(!0);t.parentNode.replaceChild(o,t),o.addEventListener("click",()=>{if(!C){alert("请先运行计算，再暂存方案。");return}let a="热泵";C.inputs.isHybridMode&&(a="混合"),C.inputs.isBOTMode&&(a+="(BOT)");const n=C.comparisons.sort((r,i)=>i.annualSaving-r.annualSaving)[0],s={id:Date.now(),name:`方案${T.length+1}：${C.inputs.projectName} [${a}]`,unitSteamCost:C.hp.unitSteamCost,savingRate:n?n.savingRate:0,invest:C.hp.initialInvestment,annualTotalCost:C.hp.annualTotalCost,annualSaving:n?n.annualSaving:0,dynamicPBP:n?n.dynamicPBP:"-",irr:n?n.irr:null,lcc:C.hp.lcc.total,co2:n?n.co2Reduction:0,timestamp:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})};T.push(s),le(),se("scenarios"),me&&me("方案已暂存","success")})}const l=document.getElementById("tab-scenarios");l&&(l.onclick=o=>{if(o.target.id==="clearScenariosBtn"){if(T.length===0)return;if(confirm("确定要清空所有暂存方案吗？")){re=[...T],T=[],le();const a=document.getElementById("undoClearBtn");a&&(a.classList.remove("hidden"),setTimeout(()=>a.classList.add("hidden"),5e3))}}o.target.id==="undoClearBtn"&&(T=[...re],re=[],le(),o.target.classList.add("hidden"))})}function le(){const e=document.querySelector("#scenario-comparison-table tbody"),t=document.getElementById("scenario-table-wrapper"),l=document.getElementById("scenario-empty-msg"),o=document.getElementById("clearScenariosBtn");if(e){if(e.innerHTML="",T.length===0){t&&t.classList.add("hidden"),l&&l.classList.remove("hidden"),o&&o.classList.add("hidden");return}t&&t.classList.remove("hidden"),l&&l.classList.add("hidden"),o&&o.classList.remove("hidden"),T.forEach((a,n)=>{const s=document.createElement("tr");s.className=n%2===0?"bg-white":"bg-gray-50",s.innerHTML=`
            <td class="px-4 py-3 text-sm font-bold text-gray-800 whitespace-nowrap">${a.name} <span class="text-xs text-gray-400 ml-1">${a.timestamp}</span></td>
            <td class="px-4 py-3 text-sm text-blue-600 font-bold whitespace-nowrap">${ee(a.unitSteamCost,1)}</td>
            <td class="px-4 py-3 text-sm text-green-600 font-bold whitespace-nowrap">${j(a.savingRate)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${B(a.invest)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${B(a.annualTotalCost)}</td>
            <td class="px-4 py-3 text-sm font-bold text-green-600 whitespace-nowrap">${B(a.annualSaving)}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap text-center">${a.dynamicPBP}</td>
            <td class="px-4 py-3 text-sm font-bold whitespace-nowrap text-center ${a.irr>.08?"text-green-600":"text-yellow-600"}">${a.irr?j(a.irr):"-"}</td>
            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">${B(a.lcc)}</td>
            <td class="px-4 py-3 text-sm text-green-600 whitespace-nowrap">${ce(a.co2,1)}</td>
            <td class="px-4 py-3 text-right whitespace-nowrap">
                <button class="text-red-400 hover:text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded" onclick="removeScenario(${a.id})">删除</button>
            </td>
        `,e.appendChild(s)})}}window.removeScenario=function(e){T=T.filter(t=>t.id!==e),le()};function Ye(){document.querySelectorAll('input[name="calcMode"]').forEach(a=>a.addEventListener("change",ge)),ge(),document.querySelectorAll(".comparison-toggle").forEach(a=>a.addEventListener("change",xe)),xe(),document.querySelectorAll('input[name="systemMode"]').forEach(a=>a.addEventListener("change",n=>{const s=n.target.value,r=document.getElementById("hybrid-params");s==="hybrid"?r.classList.remove("hidden"):r.classList.add("hidden")})),document.querySelectorAll('input[name="financeMode"]').forEach(a=>a.addEventListener("change",n=>{const s=n.target.value,r=document.getElementById("bot-params");s==="bot"?r.classList.remove("hidden"):r.classList.add("hidden")}))}function Ge(){let e=parseInt(localStorage.getItem("heat_pump_usage_count")||"0");e++,localStorage.setItem("heat_pump_usage_count",e),we(e)}function we(e=null){e===null&&(e=parseInt(localStorage.getItem("heat_pump_usage_count")||"0")),document.querySelectorAll("#usage-counter").forEach(l=>l.textContent=`累计运行：${e} 次`)}function Ve(){document.querySelectorAll(".unit-converter").forEach(e=>{e.dataset.prevUnit=e.value,e.addEventListener("change",t=>{const l=e.dataset.targetInput,o=document.getElementById(l),a=e.value,n=e.dataset.prevUnit;if(o&&o.value){const s=parseFloat(o.value),r=be[n],i=be[a];if(r&&i){const c=s*(r/i);o.value=parseFloat(c.toPrecision(5)),o.classList.add("text-blue-600","font-bold"),o.classList.remove("text-gray-900")}}e.dataset.prevUnit=a})})}function Ke(){document.querySelectorAll("input[data-default], select[data-default]").forEach(e=>{e.addEventListener("input",()=>{if(e.type==="checkbox")return;e.value!=e.dataset.default?(e.classList.add("text-blue-600","border-blue-500"),e.classList.remove("text-gray-900","border-gray-300")):(e.classList.remove("text-blue-600","border-blue-500"),e.classList.add("text-gray-900","border-gray-300"))})})}function fe(e="",t="",l=""){const o=document.getElementById("priceTiersContainer");if(!o)return;const a=document.createElement("div");a.className="price-tier-entry flex gap-2 items-center mb-2",a.innerHTML=`
        <input type="text" class="tier-name w-1/3 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="时段" value="${e}">
        <input type="number" class="tier-price w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="价格" value="${t}">
        <span class="text-gray-400 text-base font-bold">@</span>
        <input type="number" class="tier-dist w-1/4 px-3 py-2 border border-gray-200 rounded-lg text-base" placeholder="%" value="${l}">
        <button type="button" class="text-red-500 hover:text-red-700 px-2 text-xl font-bold remove-tier-btn transition">×</button>
    `,a.querySelector(".remove-tier-btn").addEventListener("click",()=>{var n;o.children.length>1?(a.remove(),(n=document.getElementById("calculateBtn"))==null||n.click()):alert("至少保留一个电价时段")}),a.querySelectorAll("input").forEach(n=>{n.addEventListener("change",()=>{var s;return(s=document.getElementById("calculateBtn"))==null?void 0:s.click()})}),o.appendChild(a)}function oe(e,t,l){const o=document.getElementById(e);o&&(o.innerHTML=`
        <button class="accordion-header flex justify-between items-center w-full px-4 md:px-6 py-4 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200 cursor-pointer" type="button" aria-expanded="true" aria-controls="${e}-content">
            <span class="text-lg font-extrabold text-gray-900 tracking-wide">${t}</span>
            <svg class="accordion-icon w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div id="${e}-content" class="accordion-content open px-4 md:px-6 py-4 md:py-6 border-t border-gray-100">
            ${l}
        </div>
    `)}function ge(){const e=document.querySelector('input[name="calcMode"]:checked').value;document.getElementById("input-group-load").classList.toggle("hidden",e==="total"),document.getElementById("input-group-hours-a").classList.toggle("hidden",e!=="annual"),document.getElementById("input-group-total").classList.toggle("hidden",e!=="total"),document.getElementById("input-group-daily").classList.toggle("hidden",e!=="daily")}function xe(){document.querySelectorAll(".comparison-toggle").forEach(e=>{const t=e.dataset.target;document.querySelectorAll(`.related-to-${t}`).forEach(o=>{const a=o.querySelectorAll("input:not(.comparison-toggle), button");e.checked?(o.classList.remove("opacity-40","grayscale"),a.forEach(n=>n.disabled=!1)):(o.classList.add("opacity-40","grayscale"),a.forEach(n=>n.disabled=!0))})})}function Ze(e,t,l){const o=document.getElementById(e),a=document.getElementById(t);!o||!a||o.addEventListener("change",()=>{})}function Xe(){confirm("确定要恢复默认参数吗？")&&location.reload()}function Qe(){const e=document.getElementById("export-report-btn");e&&e.addEventListener("click",()=>{if(!C){alert("请先进行计算");return}buildPrintReport(C),setTimeout(()=>{window.print()},500)})}function et(e){var v,w;const t=y=>{const $=document.getElementById(y);return $&&parseFloat($.value)||0},l=(y,$)=>{let R=t(y);const k=document.getElementById($);return k&&R>0?{value:R,unit:k.value}:{value:R,unit:"MJ"}},o=[];document.querySelectorAll(".price-tier-entry").forEach(y=>{o.push({name:y.querySelector(".tier-name").value,price:parseFloat(y.querySelector(".tier-price").value)||0,dist:parseFloat(y.querySelector(".tier-dist").value)||0})}),o.length===0&&o.push({name:"默认",price:.7,dist:100});const a=document.querySelector('input[name="calcMode"]:checked').value;let n=0,s=0,r=0;a==="annual"?(n=t("heatingLoad"),s=t("operatingHours"),r=n*s):a==="total"?(r=t("annualHeating"),s=t("operatingHours_B"),n=s>0?r/s:0):(n=t("heatingLoad"),s=t("dailyHours")*t("annualDays")*(t("loadFactor")/100),r=n*s);const i=((v=document.getElementById("greenPowerToggle"))==null?void 0:v.checked)||!1,c=document.querySelector('input[name="systemMode"]:checked').value==="hybrid",m=document.querySelector('input[name="financeMode"]:checked').value==="bot",u=((w=document.getElementById("hybridAuxHeaterType"))==null?void 0:w.value)||"electric";return{projectName:document.getElementById("projectName").value,analysisMode:"standard",isHybridMode:c,hybridLoadShare:c?t("hybridLoadShare"):100,hybridAuxHeaterCapex:c?t("hybridAuxHeaterCapex")*1e4:0,hybridAuxHeaterType:u,hybridAuxHeaterOpex:c?t("hybridAuxHeaterOpex")*1e4:0,isBOTMode:m,botAnnualRevenue:t("botAnnualRevenue")*1e4,botEquityRatio:t("botEquityRatio")/100,priceTiers:o,heatingLoad:n,operatingHours:s,annualHeatingDemandKWh:r,lccYears:t("lccYears"),discountRate:t("discountRate")/100,energyInflationRate:t("energyInflationRate")/100,opexInflationRate:t("opexInflationRate")/100,hpHostCapex:t("hpCapex")*1e4,hpStorageCapex:t("storageCapex")*1e4,hpSalvageRate:t("hpSalvageRate")/100,hpCop:t("hpCop"),hpOpexCost:t("hpOpexCost")*1e4,gasCalorificObj:l("gasCalorific","gasCalorificUnit"),coalCalorificObj:l("coalCalorific","coalCalorificUnit"),fuelCalorificObj:l("fuelCalorific","fuelCalorificUnit"),biomassCalorificObj:l("biomassCalorific","biomassCalorificUnit"),steamCalorificObj:l("steamCalorific","steamCalorificUnit"),gridFactor:i?0:t("gridFactor"),gasFactor:t("gasFactor"),coalFactor:t("coalFactor"),fuelFactor:t("fuelFactor"),biomassFactor:t("biomassFactor"),steamFactor:t("steamFactor"),gasBoilerCapex:t("gasBoilerCapex")*1e4,gasSalvageRate:.05,gasBoilerEfficiency:t("gasBoilerEfficiency")/100,gasPrice:t("gasPrice"),gasOpexCost:t("gasOpexCost")*1e4,fuelBoilerCapex:t("fuelBoilerCapex")*1e4,fuelSalvageRate:.05,fuelBoilerEfficiency:t("fuelBoilerEfficiency")/100,fuelPrice:t("fuelPrice"),fuelOpexCost:t("fuelOpexCost")*1e4,coalBoilerCapex:t("coalBoilerCapex")*1e4,coalSalvageRate:.05,coalBoilerEfficiency:t("coalBoilerEfficiency")/100,coalPrice:t("coalPrice"),coalOpexCost:t("coalOpexCost")*1e4,steamCapex:t("steamBoilerCapex")*1e4,steamSalvageRate:0,steamEfficiency:.98,steamPrice:t("steamPrice"),steamOpexCost:t("steamOpexCost")*1e4,compare:{gas:document.getElementById("compare_gas").checked,coal:document.getElementById("compare_coal").checked,fuel:document.getElementById("compare_fuel").checked,electric:document.getElementById("compare_electric").checked,steam:document.getElementById("compare_steam").checked,biomass:document.getElementById("compare_biomass").checked},biomassBoilerCapex:t("biomassBoilerCapex")*1e4,biomassSalvageRate:0,biomassBoilerEfficiency:t("biomassBoilerEfficiency")/100,biomassPrice:t("biomassPrice"),biomassOpexCost:t("biomassOpexCost")*1e4,electricBoilerCapex:t("electricBoilerCapex")*1e4,electricSalvageRate:.05,electricBoilerEfficiency:t("electricBoilerEfficiency")/100,electricOpexCost:t("electricOpexCost")*1e4,isGreenElectricity:i}}function tt(e){C=e,Oe(),he(),Pe();const t=document.getElementById("saveScenarioBtn");t&&(t.disabled=!1,t.classList.remove("opacity-50","cursor-not-allowed"),t.classList.add("hover:bg-gray-200"));const l=e.comparisons.sort((s,r)=>r.annualSaving-s.annualSaving)[0],o="text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black text-gray-800 mt-2 md:mt-3 tracking-tighter truncate";if(l){W("annual-saving",`${B(l.annualSaving)} 万`,o);let s="--";l.irr===null||l.irr===-1/0||l.irr<-1?s="无法回收":s=j(l.irr),W("irr",s,o),W("pbp",`${l.dynamicPBP} 年`,o),W("co2-reduction",`${ce(l.co2Reduction,1)} 吨`,o)}else W("annual-saving","--",o),W("irr","--",o);setTimeout(()=>{He();const s=["热泵",...e.comparisons.map(u=>u.name)],r=[e.hp.annualEnergyCost/1e4,...e.comparisons.map(u=>u.annualEnergyCost/1e4)],i=[e.hp.annualOpex/1e4,...e.comparisons.map(u=>u.annualOpex/1e4)],c=document.getElementById("costComparisonChart");c&&Ne(c,s,r,i);const m=document.getElementById("lccBreakdownChart");if(m){const u=e.hp.lcc;je(m,[u.capex/1e4,u.energy/1e4,u.opex/1e4,u.residual/1e4])}},100);const a=document.getElementById("tab-data-table");a&&(a.innerHTML=`
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
                            <td class="px-4 py-4 whitespace-nowrap text-right text-blue-800">${ee(e.hp.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">${B(e.hp.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center">-</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">${B(e.hp.lcc.total)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right hidden lg:table-cell">-</td>
                        </tr>
                        ${e.comparisons.map(s=>`
                        <tr class="bg-white hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-4 whitespace-nowrap font-bold text-gray-800">${s.name}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${ee(s.unitSteamCost,1)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-bold text-green-600">${j(s.savingRate)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium">${B(s.annualTotalCost)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-bold text-green-600">${B(s.annualSaving)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-medium">${s.dynamicPBP} 年</td>
                            <td class="px-4 py-4 whitespace-nowrap text-center font-bold text-blue-600">${s.irr===null||s.irr<-1?'<span class="text-gray-400">N/A</span>':j(s.irr)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right font-medium hidden lg:table-cell">${B(s.lccTotal)}</td>
                            <td class="px-4 py-4 whitespace-nowrap text-right text-green-600 font-bold hidden lg:table-cell">${ce(s.co2Reduction,1)}</td>
                        </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            <p class="text-sm text-gray-400 mt-4 md:mt-6">* 注：LCC (全生命周期成本) 已包含资金时间价值，折现率 ${j(e.inputs.discountRate)}。<br>* 折算吨汽成本基于标准蒸汽热值 (约698kWh/吨) 计算。</p>
        `);const n=document.getElementById("tab-conclusion");if(n&&l){const s=l.irr>.08;n.innerHTML=`
            <div class="p-6 md:p-8 ${s?"bg-green-50 border border-green-200":"bg-yellow-50 border border-yellow-200"} rounded-2xl">
                <h3 class="text-xl md:text-3xl font-extrabold ${s?"text-green-800":"text-yellow-800"} mb-4">${s?"🚀 推荐投资":"⚖️ 投资回报一般"}</h3>
                <p class="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                    相比于 <strong>${l.name}</strong>，工业热泵方案预计每年可节省 <strong>${B(l.annualSaving)} 万元</strong>，综合费用节能率达 <strong>${j(l.savingRate)}</strong>。
                    <br><br>
                    您的热泵供热成本相当于 <strong>${ee(e.hp.unitSteamCost,1)} 元/吨蒸汽</strong>，而${l.name}的成本为 <strong>${ee(l.unitSteamCost,1)} 元/吨</strong>。
                    <br><br>
                    全生命周期（${e.inputs.lccYears}年）累计节省 <strong>${B(l.lccSaving)} 万元</strong>。动态回收期为 ${l.dynamicPBP} 年。
                </p>
            </div>
        `}}let ie=null;function at(){const e=document.getElementById("eff-calc-modal"),t=document.getElementById("eff-calc-close-btn"),l=document.getElementById("ec-calc-btn"),o=document.getElementById("ec-apply-btn"),a=document.getElementById("ec-fuel-unit");if(!e)return;const n=r=>{const i=$e[r];i&&(r==="water"?(document.getElementById("ec-water-mass").value=i.mass,document.getElementById("ec-water-in-temp").value=i.tempIn,document.getElementById("ec-water-out-temp").value=i.tempOut):(document.getElementById("ec-steam-mass").value=i.mass,document.getElementById("ec-steam-pressure").value=i.pressure,document.getElementById("ec-steam-feed-temp").value=i.feedTemp))};document.querySelectorAll('input[name="ec-output-type"]').forEach(r=>{r.addEventListener("change",i=>{const c=i.target.value,m=document.getElementById("ec-water-params"),u=document.getElementById("ec-steam-params");c==="water"?(m.classList.remove("hidden"),u.classList.add("hidden")):(m.classList.add("hidden"),u.classList.remove("hidden")),n(c)})}),document.body.addEventListener("click",r=>{const i=r.target.closest(".eff-calc-btn");if(i){r.preventDefault();const c=i.dataset.target,m=i.dataset.fuel;ie=c;const u=document.getElementById("ec-fuel-type");u&&(u.value=m,a.textContent=m==="gas"?"m³":"kg"),document.querySelector('input[name="ec-output-type"][value="water"]').click(),e.classList.remove("hidden")}}),t&&t.addEventListener("click",()=>e.classList.add("hidden")),l&&l.addEventListener("click",()=>{const r=document.getElementById("ec-fuel-type").value,i=parseFloat(document.getElementById("ec-fuel-amount").value);let c=0;r==="gas"?c=parseFloat(document.getElementById("gasCalorific").value):r==="fuel"?c=parseFloat(document.getElementById("fuelCalorific").value):r==="coal"?c=parseFloat(document.getElementById("coalCalorific").value):r==="biomass"&&(c=parseFloat(document.getElementById("biomassCalorific").value));const m=document.querySelector('input[name="ec-output-type"]:checked').value;let u={};m==="water"?u={mass:parseFloat(document.getElementById("ec-water-mass").value),tempIn:parseFloat(document.getElementById("ec-water-in-temp").value),tempOut:parseFloat(document.getElementById("ec-water-out-temp").value)}:u={mass:parseFloat(document.getElementById("ec-steam-mass").value),pressure:parseFloat(document.getElementById("ec-steam-pressure").value),feedTemp:parseFloat(document.getElementById("ec-steam-feed-temp").value)};const v=ke(r,i,c,m,u),w=document.getElementById("ec-result-display");v.error?(w.textContent="Error",w.className="text-3xl font-black text-red-500 tracking-tight",o.disabled=!0):(w.textContent=v.efficiency.toFixed(1)+" %",w.className="text-3xl font-black text-blue-600 tracking-tight",o.disabled=!1,o.dataset.value=v.efficiency.toFixed(1))}),o&&o.addEventListener("click",()=>{var r;if(ie&&o.dataset.value){const i=document.getElementById(ie);i&&(i.value=o.dataset.value,e.classList.add("hidden"),(r=document.getElementById("calculateBtn"))==null||r.click())}})}const Ee=697.8;function J(e){if(!e||!e.value)return 0;const t=Be[e.unit]||1;return e.value*t}function ot(e){const{heatingLoad:t,operatingHours:l,annualHeatingDemandKWh:o,lccYears:a,discountRate:n,energyInflationRate:s,opexInflationRate:r,hpHostCapex:i,hpStorageCapex:c,hpSalvageRate:m,hpCop:u,hpOpexCost:v,priceTiers:w,gridFactor:y,isHybridMode:$,hybridLoadShare:R,hybridAuxHeaterCapex:k,hybridAuxHeaterType:te,hybridAuxHeaterOpex:F}=e;let L=0;if(w&&w.length>0){let x=0,E=0;w.forEach(h=>{E+=h.price*h.dist,x+=h.dist}),L=x>0?E/x:.7}else L=.7;const P=$?R/100:1,G=o*P,V=o*(1-P),K=G/u,_=K*L,ae=K*y/1e3;let A=0,O=0;if($&&V>0){let x=0,E=1,h=0,I=0,N="ton";switch(te){case"gas":x=e.gasPrice,E=e.gasBoilerEfficiency,h=J(e.gasCalorificObj),I=e.gasFactor,N="m3";break;case"coal":x=e.coalPrice,E=e.coalBoilerEfficiency,h=J(e.coalCalorificObj),I=e.coalFactor,N="ton";break;case"fuel":x=e.fuelPrice,E=e.fuelBoilerEfficiency,h=J(e.fuelCalorificObj),I=e.fuelFactor,N="ton";break;case"biomass":x=e.biomassPrice,E=e.biomassBoilerEfficiency,h=J(e.biomassCalorificObj),I=e.biomassFactor,N="ton";break;case"steam":x=e.steamPrice,E=e.steamEfficiency,h=J(e.steamCalorificObj),I=e.steamFactor,N="ton";break;case"electric":default:x=L,E=e.electricBoilerEfficiency,h=3.6,I=y,N="kwh";break}if(E>0&&h>0){const ne=V*3.6/(h*E);N==="ton"?A=ne/1e3*x:A=ne*x,O=ne*I/1e3}}const q=i+c+($?k:0),Z=_+A,g=v+($?F:0),D=Z+g,X=ae+O;let H=q,U=0,Q=0;for(let x=1;x<=a;x++){const E=Z*Math.pow(1+s,x-1),h=g*Math.pow(1+r,x-1),I=1/Math.pow(1+n,x);U+=E*I,Q+=h*I}const pe=q*m/Math.pow(1+n,a);H=H+U+Q-pe;const ue=o/Ee,Ce=ue>0?D/ue:0;return{avgElecPrice:L,initialInvestment:q,annualEnergyCost:Z,annualOpex:g,annualTotalCost:D,co2:X,unitSteamCost:Ce,breakdown:{hpEnergy:_,auxEnergy:A,hpOpex:v,auxOpex:$?F:0},lcc:{total:H,capex:q,energy:U,opex:Q,residual:-pe}}}function lt(e,t){const l=[],o=e.annualHeatingDemandKWh/Ee,a=(n,s,r,i,c,m,u,v,w)=>{let y=0;if(typeof c=="object"?y=J(c):y=c,r<=0||y<=0)return null;let R=e.annualHeatingDemandKWh*3.6/(y*r),k=0;w==="ton"?k=R/1e3*i:k=R*i;const te=R*u/1e3,F=k+m;let L=s;for(let g=1;g<=e.lccYears;g++){const D=k*Math.pow(1+e.energyInflationRate,g-1),X=m*Math.pow(1+e.opexInflationRate,g-1);L+=(D+X)/Math.pow(1+e.discountRate,g)}L-=s*v/Math.pow(1+e.discountRate,e.lccYears);const P=t.initialInvestment-s,G=F-t.annualTotalCost,V=[-P];let K="> "+e.lccYears,_=-P,ae=!1,A=0;for(let g=1;g<=e.lccYears;g++){const D=k*Math.pow(1+e.energyInflationRate,g-1)+m*Math.pow(1+e.opexInflationRate,g-1),X=t.annualEnergyCost*Math.pow(1+e.energyInflationRate,g-1)+t.annualOpex*Math.pow(1+e.opexInflationRate,g-1),H=D-X;V.push(H),A+=H;const U=H/Math.pow(1+e.discountRate,g),Q=_;if(_+=U,!ae&&_>=0){const de=Math.abs(Q)/U;K=(g-1+de).toFixed(1),ae=!0}}let O=null;P>0?A<P?O=null:O=st(V):t.annualTotalCost<F?O=9.99:O=null;const q=F>0?G/F:0,Z=o>0?F/o:0;return{name:n,initialInvestment:s,annualEnergyCost:k,annualOpex:m,annualTotalCost:F,co2:te,lccTotal:L,annualSaving:G,savingRate:q,unitSteamCost:Z,paybackPeriod:P>0?(P/G).toFixed(1)+" 年":"立即",dynamicPBP:K,irr:O,lccSaving:L-t.lcc.total,co2Reduction:te-t.co2}};return e.compare.gas&&l.push(a("天然气锅炉",e.gasBoilerCapex,e.gasBoilerEfficiency,e.gasPrice,e.gasCalorificObj,e.gasOpexCost,e.gasFactor,e.gasSalvageRate,"m3")),e.compare.coal&&l.push(a("燃煤锅炉",e.coalBoilerCapex,e.coalBoilerEfficiency,e.coalPrice,e.coalCalorificObj,e.coalOpexCost,e.coalFactor,e.coalSalvageRate,"ton")),e.compare.fuel&&l.push(a("燃油锅炉",e.fuelBoilerCapex,e.fuelBoilerEfficiency,e.fuelPrice,e.fuelCalorificObj,e.fuelOpexCost,e.fuelFactor,e.fuelSalvageRate,"ton")),e.compare.biomass&&l.push(a("生物质锅炉",e.biomassBoilerCapex,e.biomassBoilerEfficiency,e.biomassPrice,e.biomassCalorificObj,e.biomassOpexCost,e.biomassFactor,e.biomassSalvageRate,"ton")),e.compare.electric&&l.push(a("电锅炉",e.electricBoilerCapex,e.electricBoilerEfficiency,t.avgElecPrice,3.6,e.electricOpexCost,e.gridFactor,e.electricSalvageRate,"kwh")),e.compare.steam&&l.push(a("管网蒸汽",e.steamCapex,e.steamEfficiency,e.steamPrice,e.steamCalorificObj,e.steamOpexCost,e.steamFactor,e.steamSalvageRate,"ton")),l.filter(n=>n!==null)}function st(e,t=.1){let a=t;for(let n=0;n<100;n++){let s=0,r=0;for(let c=0;c<e.length;c++)s+=e[c]/Math.pow(1+a,c),r-=c*e[c]/Math.pow(1+a,c+1);const i=a-s/r;if(Math.abs(i-a)<1e-6)return i;a=i}return null}function ye(){const e=et();if(!e)return;const t=ot(e),l=lt(e,t),o={inputs:e,hp:t,comparisons:l,isHybridMode:e.isHybridMode};tt(o)}document.addEventListener("DOMContentLoaded",()=>{console.log("Phoenix Plan V19.16 (Flexible Hybrid) Initializing..."),Je(ye),setTimeout(()=>ye(),500)});
