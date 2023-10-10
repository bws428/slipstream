/**
 * @jest-environment jsdom
 */
import getCrewUrls from "../src/get-crew-urls";
import { url1, url2, url3, crewUrls } from "./test-data";

// Create some `div` elements to simulate possible input params.
const div1 = document.createElement("div");
const div2 = document.createElement("div");
const div3 = document.createElement("div");
div1.setAttribute("onclick", url1);
div2.setAttribute("onclick", url2);
div3.setAttribute("onclick", url3);

// Create an array of `div` element(s).
const menuItems = [ div1, div2, div3 ];

test('Returns a properly-formatted crewUrls array.', () => {
  expect(getCrewUrls(menuItems)).toStrictEqual(crewUrls);
});