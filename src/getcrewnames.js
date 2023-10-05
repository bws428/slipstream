import { capitalize } from "./helpers";

/**
 * Get the crew names for a single flight leg.
 * @param {Document} crewHtml - The flight leg crew HTML document.
 * @return {Object} The crew names object.
 */
export default function getCrewNames(crewHtml) {
  const crewNames = {
    fltNum: crewHtml.getElementById("lblFlightNo").textContent.replace(/\b0+/g, ""),
    orig: crewHtml.getElementById("lblDeptCity").textContent,
    dest: crewHtml.getElementById("lblArrvCity").textContent,
    crew: [],
  };

  // Get the <table> containing all the crew names for each leg.
  const crewTable = crewHtml.getElementById("dgFlightCrew");

  // Get each row in the table.
  const crewRows = crewTable.querySelectorAll("tr");

  // Use `map()` to create a new array containing objects with the crew names.
  crewNames.crew = Array.from(crewRows).map((tr) => ({
    role: tr.querySelectorAll("td")[0].textContent.trim(),
    dh: tr.querySelectorAll("td")[1].textContent.trim(),
    id: tr.querySelectorAll("td")[3].textContent.trim(),
    last: capitalize(tr.querySelectorAll("td")[4].textContent.trim()),
    first: capitalize(tr.querySelectorAll("td")[5].textContent.trim()),
  }));

  // Remove the first row of the `crew[]` array (the header row of the table).
  crewNames.crew.shift();

  return crewNames;
}
