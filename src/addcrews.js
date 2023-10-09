/**
 * Match crew names with the correct flight and join them together.
 * @param {Array} flights - The flights object.
 * @param {Array} crews - The crews object.
 * @return {Array} Complete flights object with crew names.
 */
export default function addCrews(flights, crews) {
  return flights.map((flight) => {
    // Find the corresponding crew for the flight
    const matchingCrew = crews.find((leg) => {
      return (
        leg.fltNum === flight.fltNum || leg.fltNum === ""
        && leg.orig === flight.orig || leg.orig === ""
        && leg.dest === flight.dest || leg.dest === ""
      );
    });

    // If a matching crew was found, add it to the flight object
    if (matchingCrew) {
      flight.crew = matchingCrew.crew;
    }

    return flight;
  });
}
