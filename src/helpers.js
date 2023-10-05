/**
 * Replaces jQuery $(document).ready function
 * ...with vanilla JS
 */
export function ready(fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}


/**
 * Capitalize only the first letters of a name.
 * @param {string} names - Name(s) to capitalize.
 * @return {string} The capitalized name(s).
 */
export function capitalize(names) {
  return (`${names.toLowerCase()}`).replace(/^([a-z])|\s+([a-z])/g, ($1) => $1.toUpperCase());
}


/**
 * Build a properly-formatted CSV file from a 2D array.
 * @param {Array} csvHead - An list of column header fields.
 * @param {Array} table - A 2D array of data.
 * @return {string} - A CSV-formatted string.
 */
export function buildCsv(csvHead, table) {
  const csvLines = [csvHead.join(",")].concat(
    table.map((row) => row.join(","))
  );
  return csvLines.join("\n");
}


/**
 * Download a formatted string as a CSV file.
 * @param {string} csv - A CSV-formatted string.
 * @param {string} pairingNumber - The pairing number.
 * @param {string} pairingDate - The pairing start date.
 */
export function downloadCsv(csv, pairingNumber, pairingDate) {
  const a = document.createElement("a");
  a.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
  a.target = "_blank";
  a.download = `${pairingNumber}-${pairingDate}.csv`;
  a.click();
}
