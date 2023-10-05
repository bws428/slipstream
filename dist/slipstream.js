(()=>{"use strict";function t(t){return`${t.toLowerCase()}`.replace(/^([a-z])|\s+([a-z])/g,(t=>t.toUpperCase()))}var e;e=()=>{const e=document.createElement("button");e.type="button",e.id="export_button",e.textContent="Export",e.disabled=!0,document.getElementById("btnPRINT").insertAdjacentElement("afterend",e);const n=document.createElement("div");n.id="status_message",document.getElementById("tbGRID").insertAdjacentElement("afterend",n);const r=document.getElementById("PrgNo").value.toString(),o=document.getElementById("PrgDate").value.replaceAll("/",".").toString();console.log(`Pairing ${r} on ${o}`);let l=[...document.querySelectorAll("script")].filter((t=>t.textContent.includes("gGridText")))[0].text.split("'")[1].split("-").filter((t=>-1!==t.substring(0,3).search("L:"))).map((t=>t.split("::"))).map((t=>{const e=t[18].trim().slice(-3);return{date:t[4].trim(),code:""!==t[5].trim()?t[5].trim():"NKS",fltNum:t[6].trim().replace(/\b0+/g,""),dh:t[7].trim(),orig:t[8].trim(),dest:t[9].trim(),depart:t[10].trim(),arrive:t[11].trim(),block:t[12].trim(),tail:`N${e}NK`,crew:[]}})).filter((t=>""===t.dh));const c=[...document.getElementById("MenusDIV").querySelectorAll(".rClickMenuItem")].filter((t=>t.textContent.includes("Flight Leg Crew"))).map((t=>`https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/${t.getAttribute("onclick").match(/"(.*?)"/g)[0].replace(/['"]+/g,"")}`)),i=document.getElementById("hdnCREWDATA").value.toString();console.log(i),(async()=>{n.textContent=`Loading crews... 1 of ${c.length}`;const i=await async function(e,n){let r=2;const o=e.length,l=Promise.all(e.map((async e=>{const l=await fetch(e),c=await l.text(),i=(new DOMParser).parseFromString(c,"text/html");return n.textContent=`Loading crews... ${r} of ${o}`,r++,function(e){const n={fltNum:e.getElementById("lblFlightNo").textContent.replace(/\b0+/g,""),orig:e.getElementById("lblDeptCity").textContent,dest:e.getElementById("lblArrvCity").textContent,crew:[]},r=e.getElementById("dgFlightCrew").querySelectorAll("tr");return n.crew=Array.from(r).map((e=>({role:e.querySelectorAll("td")[0].textContent.trim(),dh:e.querySelectorAll("td")[1].textContent.trim(),id:e.querySelectorAll("td")[3].textContent.trim(),last:t(e.querySelectorAll("td")[4].textContent.trim()),first:t(e.querySelectorAll("td")[5].textContent.trim())}))),n.crew.shift(),console.log(n),n}(i)})));return await l}(c,n);l=function(t,e){return t.map((t=>{const n=e.find((e=>e.fltNum===t.fltNum&&e.orig===t.orig&&e.dest===t.dest));return n&&(t.crew=n.crew),t}))}(l,i);const a=function(t,e){return t.map((t=>{const n=[e,t.date,t.code+t.fltNum,t.orig,t.dest,t.depart,t.arrive,t.block,t.tail],r=t.crew.filter((t=>!t.dh&&("CA"===t.role||"FO"===t.role)));return n.push(...r.map((t=>`"${t.id} ${t.last}, ${t.first}"`))),n}))}(l,r);console.log("flights: ",l);const d=function(t,e){return[["Remarks","Date","Flight Number","From","To","Departure Time","Arrival Time","Total","Aircraft ID","PIC Name","SIC Name"].join(",")].concat(e.map((t=>t.join(",")))).join("\n")}(0,a);console.log(d),n.textContent="Ready to export.",e.disabled=!1,e.addEventListener("click",(()=>{!function(t,e,n){const r=document.createElement("a");r.href=`data:text/csv;charset=utf-8,${encodeURI(t)}`,r.target="_blank",r.download=`${e}-${n}.csv`,r.click()}(d,r,o)}))})()},"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e)})();