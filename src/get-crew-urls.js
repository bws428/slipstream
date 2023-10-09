/**
 * Get a list of URLs to find the crew names for each flight segment.
 * @param {Object} menuItems - A list of "div.rClickMenuItem" objects.
 * @return {Array} A list of crew URLs.
 */
export default function getCrewUrls(menuItems) {
  // Set the CrewTrac URL prefix:
  const urlPrefix = 
    `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/`;

  // Extract the URL from the `onclick` attribute of each menu item.
  const crewUrls = menuItems.map((menuItem) => {

    // Get the text of the "onclick" attribute
    const url = menuItem.getAttribute("onclick");

    // Match the first double-quoted string from the `url` string,
    // then replace all single and double quotes in the matched string
    // with an empty string.
    return url.match(/"(.*?)"/g)[0].replace(/['"]+/g, "");
  });

  // Add the prefix to each crew URL.
  return crewUrls.map((crewUrl) => {
    return `${urlPrefix}${crewUrl}`;
  });
}