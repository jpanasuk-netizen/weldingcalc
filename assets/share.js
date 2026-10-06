"use strict";(function(){
var spec={tig:[["th","tigThou",1],["mat","tigMat"]],mig:[["th","migThou",1],["gas","migGas"]],stk:[["th","stkThou",16],["cond","stkCond"]],dc:[["ra","dcRated",1],["rd","dcDuty",1,100],["aa","dcActual",1]]};
var fn={tig:"tigAmps",mig:"migSettings",stk:"stickRod",dc:"dutyCycle"},box={tig:"tigResult",mig:"migResult",stk:"stkResult",dc:"dcResult"};
function g(i){return document.getElementById(i)}
function opt(id,v){var e=g(id);if(!e)return 0;for(var i=0;i<e.options.length;i++)if(e.options[i].value===v)return 1;return 0}
function good(t,p){var a=0,s=spec[t];for(var i=0;i<s.length;i++){var r=s[i],k=r[0];if(!p.has(k))continue;a=1;if(r.length<3){if(!opt(r[1],p.get(k)))return 0}else{var n=+p.get(k);if(!isFinite(n)||n<r[2]||(r[3]!=null&&n>r[3]))return 0}}return a}
function fill(t,p){spec[t].forEach(function(r){if(p.has(r[0]))g(r[1]).value=p.get(r[0])})}
function href(t){var q=new URLSearchParams(),x=location.pathname||"/";if(g("tab-tig"))q.set("tab",t);spec[t].forEach(function(r){q.set(r[0],g(r[1]).value)});if(x=="/"||/\/index\.html$/.test(x))x="/";return x+"?"+q.toString()}
function bits(t){return spec[t].map(function(r){return r[0]+"="+g(r[1]).value}).join(" ")}
function fb(t){var a=document.createElement("textarea");a.value=t;a.style.cssText="position:fixed;left:-9999px";document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove()}
function copy(t,b){var o=b.textContent,d=function(){b.textContent="Copied";setTimeout(function(){b.textContent=o},1600)};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(d,function(){fb(t);d()});else{fb(t);d()}}
function share(el,t){var text=(el.innerText||el.textContent||"").replace(/\s+$/,""),r=href(t),u=location.origin+r;try{history.replaceState(history.state,"",r)}catch(e){}var row=document.createElement("p");row.className="share-row small";function mk(l,p){var b=document.createElement("button");b.type="button";b.textContent=l;b.addEventListener("click",function(){copy(p,b)});return b}row.appendChild(mk("Copy link to this result",u));row.appendChild(mk("Copy as text","Welding Calculator\nInputs: "+bits(t)+"\nResult:\n"+text+"\nPlanning estimate. Confirm on scrap first. "+u));el.appendChild(row)}
function wrap(t){var id=box[t],o=window[fn[t]];if(!g(id)||typeof o!="function")return;window[fn[t]]=function(){o();var b=g(id);if(b&&!b.hidden)share(b,t)}}
function boot(){Object.keys(spec).forEach(wrap);var p;try{p=new URLSearchParams(location.search)}catch(e){return}var t=p.get("tab"),home=!!g("tab-tig");
if(home){if(!t){if(p.has("ra")||p.has("rd")||p.has("aa"))t="dc";else if(p.has("mat"))t="tig";else if(p.has("gas"))t="mig";else if(p.has("cond"))t="stk";else return}if(!spec[t]||!good(t,p))return;var b=document.querySelector('.tabs button[onclick*="tab-'+t+'"]');if(typeof showTab=="function")showTab("tab-"+t,b);fill(t,p);window[fn[t]]()}
else if(g("dcRated")&&g("dcResult")){if((t&&t!="dc")||!good("dc",p))return;fill("dc",p);window.dutyCycle()}}
boot()})();
