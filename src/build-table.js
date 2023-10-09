/**
 * Build the flights table from the flights object.
 * @param {Array} flights - The flights object.
 * @param {string} pairingNumber - The pairing number.
 * @return {Array} The complete flights table.
 */
export default function buildTable(flights, pairingNumber) {
  return flights.map((flight) => {
    const row = [
      pairingNumber,
      flight.date,
      flight.code + flight.fltNum,
      flight.orig,
      flight.dest,
      flight.depart,
      flight.arrive,
      flight.block,
      flight.tail,
    ];

    // Filter the crew to only include CA and FO positions that are not DH
    const crew = flight.crew.filter(
      (name) => !name.dh && (name.role === "CA" || name.role === "FO")
    );

    // Add the crew names to the row
    row.push(...crew.map((name) => `"${name.id} ${name.last}, ${name.first}"`));

    return row;
  });
}