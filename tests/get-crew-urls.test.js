import getCrewUrls from "../src/get-crew-urls";

const menuItems = 
[
  `<div class="rClickMenuItem" onmouseover="this.style.background=&quot;Darkblue&quot;; this.style.color=&quot;White&quot;" onmouseout="this.style.background=&quot;Silver&quot;; this.style.color=&quot;Black&quot;" onclick="parent.window.onDetailClick(&quot;ctw4130report.aspx?FltNo=0930&amp;DeptDate=20230920&amp;DisplayDeptDate=09/20/23&amp;DeptCity=MCO&amp;ArrvCity=RIC&amp;Modal=ctwpm&quot;,2);">Flight Leg Crew</div>`
];


const crewUrls =
  [
    `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/ctw4130report.aspx?FltNo=0930&DeptDate=20230920&DisplayDeptDate=09/20/23&DeptCity=MCO&ArrvCity=RIC&Modal=ctwpm`
  ];


test('Returns a properly-formatted crewUrls array.', () => {
  expect(getCrewUrls(menuItems)).toStrictEqual(crewUrls);
});