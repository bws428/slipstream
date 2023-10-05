/**
 * Get a list of flight segments from CrewTrac's "Pairing Inquire" page.
 * @param {string} gridText - The <script> block containing the "gGridText" var.
 * @return {Array} A list of flight segments.
 */
export default function getFlights(gridText) {
  // Get value of "gGridText" var from input string and return an array of flight segments.
  const flights = gridText.split("'")[1].split("-").filter((entry) => entry.substring(0, 3).search("L:") !== -1).map((row) => row.split("::"));

  // Build an array of flight segment objects from the flights table.
  return flights.map((row) => {
    // NK ship numbers are 4 digits, with the last 3 being the aircraft N-number.
    const tailNumber = row[18].trim().slice(-3);

    // Grab the flight segment details and store as an object
    return {
      date: row[4].trim(),
      // If the OA field is empty, the airline code is NKS
      code: row[5].trim() !== "" ? row[5].trim() : "NKS", 
      fltNum: row[6].trim().replace(/\b0+/g, ""),
      dh: row[7].trim(),
      orig: row[8].trim(),
      dest: row[9].trim(),
      depart: row[10].trim(),
      arrive: row[11].trim(),
      block: row[12].trim(),
      tail: `N${tailNumber}NK`, // Hard-coded for *only* NK???
      crew: [],
    };
  }).filter((flight) => flight.dh === "");
}