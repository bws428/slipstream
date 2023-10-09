(()=>{"use strict";function t(t){return`${t.toLowerCase()}`.replace(/^([a-z])|\s+([a-z])/g,(t=>t.toUpperCase()))}var e;e=()=>{const e=document.createElement("button");e.type="button",e.id="export_button",e.textContent="Export",e.disabled=!0,document.getElementById("btnPRINT").insertAdjacentElement("afterend",e);const r=document.createElement("div");r.id="status_message",document.getElementById("tbGRID").insertAdjacentElement("afterend",r);const n=document.getElementById("PrgNo").value.toString(),o=document.getElementById("PrgDate").value.replaceAll("/",".").toString();console.log(`Pairing ${n} on ${o}`);const l=[...document.querySelectorAll("script")].filter((t=>t.textContent.includes("gGridText")))[0].text.split("'")[1].split("-").filter((t=>-1!==t.substring(0,3).search("L:"))).map((t=>t.split("::"))).map((t=>{const e=t[18].trim().slice(-3);return{date:t[4].trim(),code:""!==t[5].trim()?t[5].trim():"NKS",fltNum:t[6].trim().replace(/\b0+/g,""),dh:t[7].trim(),orig:t[8].trim(),dest:t[9].trim(),depart:t[10].trim(),arrive:t[11].trim(),block:t[12].trim(),tail:`N${e}NK`,crew:[]}})).filter((t=>""===t.dh)),i=[...document.getElementById("MenusDIV").querySelectorAll(".rClickMenuItem")].filter((t=>t.textContent.includes("Flight Leg Crew"))).map((t=>`https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/${t.getAttribute("onclick").match(/"(.*?)"/g)[0].replace(/['"]+/g,"")}`)),c=document.getElementById("hdnCREWDATA").value.toString();(async()=>{let a={};-1!==c.search(":-:")?(a=function(e){const r=e.split(":-:").map((t=>t.split("::").map((t=>t.trim())))),n={fltNum:"",orig:"",dest:"",crew:[]};return n.crew=Array.from(r).map((e=>({role:e[1],dh:"",id:e[3],last:t(e[4]),first:t(e[5])}))),[n]}(c),console.log(a)):(r.textContent=`Loading crews... 1 of ${i.length}`,a=await async function(e,r){let n=2;const o=e.length,l=Promise.all(e.map((async e=>{const l=await fetch(e),i=await l.text(),c=(new DOMParser).parseFromString(i,"text/html");return r.textContent=`Loading crews... ${n} of ${o}`,n++,function(e){const r={fltNum:e.getElementById("lblFlightNo").textContent.replace(/\b0+/g,""),orig:e.getElementById("lblDeptCity").textContent,dest:e.getElementById("lblArrvCity").textContent,crew:[]},n=e.getElementById("dgFlightCrew").querySelectorAll("tr");return r.crew=Array.from(n).map((e=>({role:e.querySelectorAll("td")[0].textContent.trim(),dh:e.querySelectorAll("td")[1].textContent.trim(),id:e.querySelectorAll("td")[3].textContent.trim(),last:t(e.querySelectorAll("td")[4].textContent.trim()),first:t(e.querySelectorAll("td")[5].textContent.trim())}))),r.crew.shift(),r}(c)})));return await l}(i,r),console.log(a));const s=function(t,e){return t.map((t=>{const r=e.find((e=>e.fltNum===t.fltNum||""===e.fltNum&&e.orig===t.orig||""===e.orig&&e.dest===t.dest||""===e.dest));return r&&(t.crew=r.crew),t}))}(l,a),d=function(t,e){return t.map((t=>{const r=[e,t.date,t.code+t.fltNum,t.orig,t.dest,t.depart,t.arrive,t.block,t.tail],n=t.crew.filter((t=>!t.dh&&("CA"===t.role||"FO"===t.role)));return r.push(...n.map((t=>`"${t.id} ${t.last}, ${t.first}"`))),r}))}(s,n);console.log("flights: ",s);const m=function(t,e){return[["Remarks","Date","Flight Number","From","To","Departure Time","Arrival Time","Total","Aircraft ID","PIC Name","SIC Name"].join(",")].concat(e.map((t=>t.join(",")))).join("\n")}(0,d);console.log(m),r.textContent="Ready to export.",e.disabled=!1,e.addEventListener("click",(()=>{!function(t,e,r){const n=document.createElement("a");n.href=`data:text/csv;charset=utf-8,${encodeURI(t)}`,n.target="_blank",n.download=`${e}-${r}.csv`,n.click()}(m,n,o)}))})()},"loading"!==document.readyState?e():document.addEventListener("DOMContentLoaded",e)})();