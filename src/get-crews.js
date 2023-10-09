import { capitalize } from "./helpers";

/**
 * Get the crew names (quickly) for all flight legs.
 * @param {string} hdnCrewData - The "hidden crew data" string.
 * @return {Array} The crew names array.
 */
export default function getCrews(hdnCrewData) {

  // Split hdnCrewData at ":-:", so we have a string for each crewmember.
  const crewRows = hdnCrewData.split(":-:");

  // Create an array of crew data for each crewmember.
  const crewData = crewRows.map(el => el.split("::").map(el => el.trim()))

  // Build the crewNames object the same way getCrewNames() does.
  const crewNames = {
    fltNum: "",
    orig: "",
    dest: "",
    crew: [],
  };

  // Grab the relevant crew info from its array position.
  crewNames.crew = Array.from(crewData).map((row) => ({
    role: row[1],
    dh: "",
    id: row[3],
    last: capitalize(row[4]),
    first: capitalize(row[5]),
  }));

  // Return an array with crewNames object(s), since that's
  // what addCrews() expects as an input parameter.
  return [crewNames];
}
