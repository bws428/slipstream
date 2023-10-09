/**
 * Get a list of URLs to find the crew names for each flight segment.
 * @param {Object} menuItems - A list of "div.rClickMenuItem" objects.
 * @return {Array} A list of crew URLs.
 */
export default function getCrewUrls(menuItems) {
  return menuItems.map((menuItem) => {
    const url = menuItem.getAttribute("onclick");
    const crewUrl = `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/${url.match(/"(.*?)"/g)[0].replace(/['"]+/g, "")}`;
    
    return crewUrl;
  });
}