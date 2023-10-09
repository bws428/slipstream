/**
 * @jest-environment jsdom
 */

import getCrewUrls from "../src/get-crew-urls";

const div1 = document.createElement("div");
const url1 =`parent.window.onDetailClick("ctw4130report.aspx?FltNo=0930&DeptDate=20230920&DisplayDeptDate=09/20/23&DeptCity=MCO&ArrvCity=RIC&Modal=ctwpm",2);`;
const menuItems = [ div1 ];

const crewUrls =
  [
    `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/ctw4130report.aspx?FltNo=0930&DeptDate=20230920&DisplayDeptDate=09/20/23&DeptCity=MCO&ArrvCity=RIC&Modal=ctwpm`
  ];


test('Returns a properly-formatted crewUrls array.', () => {
  expect(getCrewUrls(menuItems)).toStrictEqual(crewUrls);
});