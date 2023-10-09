/**
 * @jest-environment jsdom
 */

import getCrewUrls from "../src/get-crew-urls";

const itemOne = document.createElement("div");
itemOne.class = "rClickMenuItem";
itemOne.onclick = "parent.window.onDetailClick(&quot;ctw4130report.aspx?FltNo=0930&amp;DeptDate=20230920&amp;DisplayDeptDate=09/20/23&amp;DeptCity=MCO&amp;ArrvCity=RIC&amp;Modal=ctwpm&quot;,2);";

const menuItems = [ itemOne ];


const crewUrls =
  [
    `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/ctw4130report.aspx?FltNo=0930&DeptDate=20230920&DisplayDeptDate=09/20/23&DeptCity=MCO&ArrvCity=RIC&Modal=ctwpm`
  ];


test('Returns a properly-formatted crewUrls array.', () => {
  expect(getCrewUrls(menuItems)).toStrictEqual(crewUrls);
});