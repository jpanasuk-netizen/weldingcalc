/* WeldingCalc calculators — vanilla JS, no dependencies.
   Rule-of-thumb amps use published machine-manufacturer guidance (Lincoln/Miller
   published charts): TIG ≈ 1 amp per 0.001" of mild steel; stick rod diameter ≈ half
   the base-metal thickness; duty cycle scales with the square of the amperage ratio.
   All estimates are starting points — always confirm on scrap first. */
"use strict";

function el(id){ return document.getElementById(id); }
function fmt(n){ return Math.round(n).toLocaleString("en-US"); }

/* ---------- Tabs ---------- */
function showTab(key, btn){
  document.querySelectorAll(".panel").forEach(function(p){ p.classList.remove("active"); });
  document.querySelectorAll(".tabs button").forEach(function(b){ b.setAttribute("aria-selected","false"); });
  el(key).classList.add("active");
  if(btn) btn.setAttribute("aria-selected","true");
}

/* ---------- 1. TIG amperage ---------- */
// Published rule: ~1 amp per 0.001" of thickness for mild steel (1/8" ≈ 125 A).
// Aluminum needs ~1.5× (higher thermal conductivity); stainless slightly less.
var TIG_FACTORS = { steel:{f:1.0, label:"Mild steel"}, aluminum:{f:1.5, label:"Aluminum"}, stainless:{f:0.9, label:"Stainless"} };
function tigAmps(){
  var mils = Math.max(1, parseFloat(el("tigThou").value) || 0);   // thickness in 0.001" (1/8" = 125)
  var mat = el("tigMat").value || "steel";
  var k = (TIG_FACTORS[mat] || TIG_FACTORS.steel).f;
  var mid = mils * k;
  var lo = Math.round(mid * 0.8), hi = Math.round(mid * 1.2);
  var tung = mils >= 156 ? "3/32\" (2.4 mm)" : mils >= 94 ? "3/32\" (2.4 mm)" : "1/16\" (1.6 mm)";
  var box = el("tigResult"); box.hidden = false;
  box.innerHTML = '<div class="big">'+lo+'–'+hi+' <span class="unit">amps ('+TIG_FACTORS[mat].label+', '+fmt(mils)+' mils)</span></div>'+
    '<div class="grid2">'+
      '<div class="stat"><b>'+fmt(mid)+'</b><span>Rule-of-thumb midpoint (1 A per mil'+(k===1.5?' × 1.5':k===0.9?' × 0.9':'')+')'+
      '</span></div>'+
      '<div class="stat"><b>'+tung+'</b><span>Tungsten to start with (2% lanthanated)</span></div>'+
      '<div class="stat"><b>'+(mils>=188?'3/32"':mils>=125?'3/32"':'1/16"')+'</b><span>Filler rod diameter (ER70S-2 steel / ER4043 aluminum)</span></div>'+
      '<div class="stat"><b>'+(mat==="aluminum"?"AC + high freq":"DCEN")+'</b><span>Polarity setting</span></div>'+
    '</div>'+
    '<p class="note">Start at the low end and step up until the puddle wets out at your travel speed. For AC aluminum, balance ~70% electrode-positive and adjust cleaning action on scrap first. Outside corner joints need less; outside fillets with poor fit-up need more.</p>';
}

/* ---------- 2. MIG wire size + settings ---------- */
// Published approximations: .030 wire ≈ 2 A per mil of steel; .023 for under 1/8",
// .035 from 3/16" up. Wire speed (ipm) ≈ amps × k (k: .023→3.5, .030→2.0, .035→1.6).
function migSettings(){
  var mils = Math.max(1, parseFloat(el("migThou").value) || 0);
  var gas  = el("migGas").value; // c25 | flux
  // Amp curves (published starting points, short-circuit MIG mild steel):
  // 0.023" wire: ~0.9 A/mil (sheet); 0.030": ~0.8 A/mil through 1/8";
  // 0.035" all-around: ~0.9 A/mil; 0.045" heavy plate: ~0.8 A/mil.
  var wire = mils < 78 ? "0.023" : mils < 188 ? "0.030" : mils < 219 ? "0.035" : "0.045";
  var amps = Math.round(mils * (wire === "0.023" ? 0.9 : wire === "0.030" ? 0.8 : wire === "0.035" ? 0.9 : 0.8) / 5) * 5;
  var k = wire === "0.023" ? 3.5 : wire === "0.030" ? 2.0 : wire === "0.035" ? 1.6 : 1.2;
  var wfs = Math.round(amps * k);
  var cfh = gas === "flux" ? "20–25" : "20–25";
  var box = el("migResult"); box.hidden = false;
  box.innerHTML = '<div class="big">'+wire+'" <span class="unit">wire · '+amps+'–'+Math.round(amps*1.15)+' amps</span></div>'+
    '<div class="grid2">'+
      '<div class="stat"><b>'+wfs+'–'+Math.round(wfs*1.1)+' ipm</b><span>Wire speed starting window</span></div>'+
      '<div class="stat"><b>'+(gas==="flux"?"Self-shielded, no gas":"75/25 Ar/CO₂")+'</b><span>Shielding</span></div>'+
      '<div class="stat"><b>'+cfh+' CFH</b><span>Gas flow</span></div>'+
      '<div class="stat"><b>'+(mils>=188?'220 V machine':'120 V machine OK')+'</b><span>Power class for '+fmt(mils)+' mils</span></div>'+
    '</div>'+
    '<p class="note">Tune by ear: a steady bacon-sizzle means voltage and wire speed are balanced; popping means too much wire speed or too little voltage. These numbers assume mild steel, short-circuit transfer, and a joint you can reach flat or horizontal.</p>';
}

/* ---------- 3. Stick rod selector ---------- */
var STICK_AMPS = {
  "1/16":  { sixty10:[35,60],  seventy18:[40,80] },
  "3/32":  { sixty10:[40,85],  seventy18:[70,100] },
  "1/8":   { sixty10:[75,125], seventy18:[90,140] },
  "5/32":  { sixty10:[110,165],seventy18:[120,180] }
};
function stickRod(){
  var mils = Math.max(16, parseFloat(el("stkThou").value) || 0); // thickness in mils
  var cond = el("stkCond").value; // clean | rusty
  // rod diameter ≈ half the base-metal thickness (published rule)
  var rodMils = Math.max(62, Math.round(mils/2));
  var rod = rodMils <= 66 ? "1/16" : rodMils <= 100 ? "3/32" : rodMils <= 128 ? "1/8" : "5/32";
  var rodLabel = {"1/16":"1/16\"","3/32":"3/32\"","1/8":"1/8\"","5/32":"5/32\""}[rod];
  var rodType = cond === "rusty" ? "6011" : "7018";
  var a = STICK_AMPS[rod][rodType === "6011" ? "sixty10" : "seventy18"];
  var box = el("stkResult"); box.hidden = false;
  box.innerHTML = '<div class="big">'+rodLabel+' <span class="unit">E'+(rodType==="6011"?"6011":"7018")+' rod · '+a[0]+'–'+a[1]+' A</span></div>'+
    '<div class="grid2">'+
      '<div class="stat"><b>DCEP</b><span>Polarity ('+(rodType==="6011"?"or DCEN/AC — 6011 runs all":"7018 is DCEP only")+'</span></div>'+
      '<div class="stat"><b>'+(mils/1000).toFixed(3)+'"</b><span>Your base-metal thickness</span></div>'+
      '<div class="stat"><b>'+(mils>=125?"240 V machine":"120 V machine OK")+'</b><span>Power class needed</span></div>'+
      '<div class="stat"><b>'+(rodType==="7018"?"Bake 250 °F if damp":"Keep dry, they forgive")+'</b><span>Electrode care</span></div>'+
    '</div>'+
    '<p class="note">'+(rodType==="6011"
      ? "E6011 digs through rust, paint, and dirty joints — the farm rod. Weaker deposit than 7018, but it starts every time."
      : "E7018 gives the clean, strong, low-hydrogen bead — but it needs clean metal and a hot-start-capable machine. On rusty or painted steel, burn E6011 first, then cap with 7018.")+
    ' Match amps to the middle of the range and adjust by arc sound and puddle.</p>';
}

/* ---------- 4. Duty cycle ---------- */
// Published formula: duty at new amps = rated duty × (rated amps / actual amps)²
function dutyCycle(){
  var rA = Math.max(1, parseFloat(el("dcRated").value) || 0);
  var rD = Math.max(1, Math.min(100, parseFloat(el("dcDuty").value) || 0));
  var aA = Math.max(1, parseFloat(el("dcActual").value) || 0);
  if(!rA || !aA){ alert("Enter both the rated amps and your actual welding amps."); return; }
  var duty = Math.min(100, rD * Math.pow(rA / aA, 2));
  var onMin = duty / 100 * 10;
  var box = el("dcResult"); box.hidden = false;
  var verdict = duty >= 60 ? "Plenty — you can work continuously in practice."
              : duty >= 25 ? "Fine for tack-and-fabricate work; rest between beads."
              : "Light duty — plan on long cool-downs or step up machine size.";
  box.innerHTML = '<div class="big">'+Math.round(duty)+'% <span class="unit">duty cycle at '+fmt(aA)+' A</span></div>'+
    '<div class="grid2">'+
      '<div class="stat"><b>'+onMin.toFixed(1)+' min</b><span>Weld time per 10 min at this amperage</span></div>'+
      '<div class="stat"><b>'+(10-onMin).toFixed(1)+' min</b><span>Cool-down per 10 min</span></div>'+
      '<div class="stat"><b>'+fmt(rA)+' A @ '+rD+'%</b><span>Machine rating (10-min cycle)</span></div>'+
      '<div class="stat"><b>÷'+(rD/Math.max(duty,0.01) >= 1 ? (rD/Math.max(duty,1)).toFixed(1) : "1")+'</b><span>Effective slowdown vs continuous</span></div>'+
    '</div>'+
    '<p class="note">'+verdict+' Duty cycle is thermal: amps squared over amps squared. Welding at half your machine\'s rated output roughly quadruples its duty cycle; welding above it collapses fast — most hobby machines protect themselves by cutting output.</p>';
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", function(){});
