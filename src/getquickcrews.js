import { capitalize } from "./helpers";

/**
 * Get the crew names (quickly) for all flight legs.
 * @param {string} hdnCrewData - The "hidden crew data" string.
 * @return {Array} The crew names array.
 */
export default function getQuickCrews(hdnCrewData) {

  // First, split hdnCrewData in half, so we have a string for each crewmember
  const crewRows = hdnCrewData.split(":-:");
  const crewData = crewRows.map(el => el.split("::").map(el => el.trim()))

  const crewNames = {
    fltNum: "",
    orig: "",
    dest: "",
    crew: [],
  };

  crewNames.crew = Array.from(crewData).map((el) => ({
    role: el[1],
    dh: "",
    id: el[3],
    last: capitalize(el[4]),
    first: capitalize(el[5]),
  }));

  // Return an array of objects, since that's what addCrews() expects.
  return [crewNames];
}
