/**
 * @jest-environment jsdom
 */
import getCrewUrls from "../src/get-crew-urls";

// Create some `div` elements to simulate possible input params.
const div1 = document.createElement("div");
const div2 = document.createElement("div");
const div3 = document.createElement("div");

const url1 = `parent.window.onDetailClick("ctw4130report.aspx?FltNo=0930&DeptDate=20230920&DisplayDeptDate=09/20/23&DeptCity=MCO&ArrvCity=RIC&Modal=ctwpm",2);`;
const url2 = `parent.window.onDetailClick("ctw4130report.aspx?FltNo=0216&DeptDate=20230921&DisplayDeptDate=09/21/23&DeptCity=RIC&ArrvCity=LAS&Modal=ctwpm",2);`;
const url3 = `parent.window.onDetailClick("ctw4130report.aspx?FltNo=3020&DeptDate=20230922&DisplayDeptDate=09/22/23&DeptCity=MCI&ArrvCity=MCO&Modal=ctwpm",2);`;

div1.setAttribute("onclick", url1);
div2.setAttribute("onclick", url2);
div3.setAttribute("onclick", url3);

// Create an array of `div` element(s).
const menuItems = [ div1, div2, div3 ];

// Create a matching output array of correct URL strings.
const crewUrls =
  [
    `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/ctw4130report.aspx?FltNo=0930&DeptDate=20230920&DisplayDeptDate=09/20/23&DeptCity=MCO&ArrvCity=RIC&Modal=ctwpm`,
    `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/ctw4130report.aspx?FltNo=0216&DeptDate=20230921&DisplayDeptDate=09/21/23&DeptCity=RIC&ArrvCity=LAS&Modal=ctwpm`,
    `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/ctw4130report.aspx?FltNo=3020&DeptDate=20230922&DisplayDeptDate=09/22/23&DeptCity=MCI&ArrvCity=MCO&Modal=ctwpm`
  ];


test('Returns a properly-formatted crewUrls array.', () => {
  expect(getCrewUrls(menuItems)).toStrictEqual(crewUrls);
});