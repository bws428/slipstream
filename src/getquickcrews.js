import { capitalize } from "./helpers";

/**
 * Get the crew names (quickly) for all flight legs.
 * @param {string} hdnCrewData - The "hidden crew data" string.
 * @return {Object} The crew names object.
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

// HERE are the 10 fields associated with the hdnCrewData.....
// IS the CA always listed FIRST though?  Looks like YES.
// What is the SAFE way to grab this data?  Just by array position?
// Or should we actually try to "read" it?
// I mean, we do array position on all the other crap in this program.

//   0. Notified 
// 1. ===> Pos (crew role)
//   2. Ver (Pairing version? i.e., "A" or "B")
// 3. ===> Employee ID 
// 4. ===> Last Name 
// 5. ===> First Name 
//   6. Sen. # 
//   7. Languages 
//   8. Commuter 
//   9. Hotel 
