import getCrewNames from "./getcrewnames";

/**
 * Get a list of crew data for all flight segments in the pairing.
 * @param {Array} crewUrls - An array of URLs.
 * @param {HTMLDivElement} statusMessage - Contains any status messages.
 * @return {Promise} A list of crew data.
 */
export default async function getCrews(crewUrls, statusMessage) {
  // Create a counter to track the number of crews that have been fetched.
  let currentCount = 2; // a hack so that the counter reaches the totalCount
  const totalCount = crewUrls.length;

  // Create a promise that will resolve when all of the crew data has been fetched.
  const crewsPromise = Promise.all(crewUrls.map(async (url) => {

    try {
      // Fetch the crew data for the given URL.
      const response = await fetch(url);
      const responseText = await response.text();
      const crewHtml = new DOMParser().parseFromString(responseText, "text/html");

      // Update the status message & increment the counter.
      statusMessage.textContent = `Loading crews... ${currentCount} of ${totalCount}`;
      currentCount++;

      // Return the crew names.
      return getCrewNames(crewHtml);
    }
    catch (error) {
      console.error(`The following error has occurred: ${error}`);
      statusMessage.textContent = `Cannot load crew names. Try refreshing the page.`;
      return;
    }
  }));

  // Wait for all of the crew data to be fetched.
  const crews = await crewsPromise;

  return crews;
}
