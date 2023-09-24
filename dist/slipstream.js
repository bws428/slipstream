/* slipstream.js | MIT License | https://github.com/bws428/slipstream */

'use strict';

// Define the header row for the CSV file.
// NOTE: The number and order of the column names must not be changed,
// but the column names themselves can be altered to match the expected
// input fields for any given logbook software importer.
//
// TODO: Make this a user-configurable option.
const header = [
  'Remarks', // Pairing number goes here.
  'Date',
  'Flight Number',
  'From',
  'To',
  'Departure Time',
  'Arrival Time',
  'Total',
  'Aircraft ID',
  'PIC Name',
  'SIC Name',
];

// Make sure the DOM is fully loaded and ready...
// ...with vanilla JS
ready(() => {
  // Create and insert an "Export" button to the right of the "Print" button.
  const printButton = document.getElementById('btnPRINT');
  const exportButton = document.createElement('button');
  exportButton.id = 'export_btn';
  exportButton.type = 'button';
  exportButton.disabled = true;
  exportButton.textContent = 'Export';
  printButton.insertAdjacentElement('afterend', exportButton);

  // Create a new <div> for status messages.
  const statusMessage = document.createElement('div');
  statusMessage.id = 'status_msg';

  // Insert the status messages at the bottom of the "tbGRID" table.
  const tbGrid = document.getElementById('tbGRID');
  tbGrid.insertAdjacentElement('afterend', statusMessage);

  // Get the pairing number.
  const pairingNumber = document.getElementById('PrgNo').value.toString();

  // Get the pairing date.
  const pairingDate = document.getElementById('PrgDate').value.replaceAll('/', '.').toString();

  // Log the pairing number and date to the console.
  console.log(`Pairing ${pairingNumber} on ${pairingDate}`);

  // Get all the valid flight segments for this pairing.
  // NOTE: All the flights data is contained inside a <script> tag under
  // a variable called "gGridText", so we'll locate all the <script> tags
  // and select the one that contains the "gGridText" variable. Then we'll
  // process the raw "gGridText" string with our custom getFlights() function.
  // https://youmightnotneedjquery.com/#contains_selector
  const gridText = [...document.querySelectorAll('script')].filter((element) => (
    element.textContent.includes('gGridText')))[0].text;
  let flights = getFlights(gridText);

  // Get the crew URLs for all valid flight segments.
  const menusDiv = document.getElementById('MenusDIV');
  const menuItems = [...menusDiv.querySelectorAll('.rClickMenuItem')].filter((element) => (
    element.textContent.includes('Flight Leg Crew')));
  const urls = getCrewUrls(menuItems);

  // Must wait for async getCrews() to return before doing anything else.
  // This ensures that the flights object is populated with all of the
  // crew names before the buildTable() and buildCsv() functions are called.
  (async () => {
    // Update the status message.
    statusMessage.textContent = 'Loading crew names...';

    // Get the crew names asynchronously & in parallel.
    const crews = await getCrews(urls, statusMessage);

    // Add crews to flights.
    flights = addCrews(flights, crews);

    // Turn flights object into a 2D array.
    const table = buildTable(flights, pairingNumber);

    // Log flights to console.
    console.log('flights: ', flights);

    // Build the CSV file string and log to console.
    const csv = buildCsv(header, table);
    console.log(csv);

    // Update the status message and enable the Export button.
    statusMessage.textContent = 'Ready to export.';
    exportButton.disabled = false;

    // Download flights CSV when "Export" button is clicked.
    exportButton.addEventListener('click', () => {
      downloadCsv(csv, pairingNumber, pairingDate);
    });
  })();
});

//
// ----------------------
//   Helper Functions
// ----------------------
//

/**
 * Replaces jQuery $(document).ready function
 * ...with vanilla JS
 */
function ready(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

/**
 * Capitalize only the first letters of a name.
 * @param {string} names - Name(s) to capitalize.
 * @return {string} The capitalized name(s).
 */
function capitalize(names) {
  return (`${names.toLowerCase()}`).replace(/^([a-z])|\s+([a-z])/g, ($1) => $1.toUpperCase());
}

/**
 * Build a properly-formatted CSV file from a 2D array.
 * @param {Array} csvHead - An list of column header fields.
 * @param {Array} table - A 2D array of data.
 * @return {string} - A CSV-formatted string.
 */
function buildCsv(csvHead, table) {
  const csvLines = [csvHead.join(',')].concat(
    table.map((row) => row.join(','))
  );
  return csvLines.join('\n');
}

/**
 * Download a formatted string as a CSV file.
 * @param {string} csv - A CSV-formatted string.
 * @param {string} pairingNumber - The pairing number.
 * @param {string} pairingDate - The pairing start date.
 */
function downloadCsv(csv, pairingNumber, pairingDate) {
  const a = document.createElement('a');
  a.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
  a.target = '_blank';
  a.download = `${pairingNumber}-${pairingDate}.csv`;
  a.click();
}

/**
 * Get a list of flight segments from CrewTrac's "Pairing Inquire" page.
 * @param {string} gridText - The <script> block containing the "gGridText" var.
 * @return {Array} A list of flight segments.
 */
function getFlights(gridText) {
  // Get value of "gGridText" var from input string and return an array of legs.
  const flights = gridText.split("'")[1].split('-').filter((entry) => entry.substring(0, 3).search('L:') !== -1).map((row) => row.split('::'));

  // Build an array of flight segment objects from the flights table.
  return flights.map((row) => {
    const tailNumber = row[18].trim().slice(-3);
    return {
      dh: row[7].trim(),
      date: row[4].trim(),
      code: row[5].trim(),
      fltNum: row[6].trim().replace(/\b0+/g, ''),
      orig: row[8].trim(),
      dest: row[9].trim(),
      depart: row[10].trim(),
      arrive: row[11].trim(),
      block: row[12].trim(),
      tail: `N${tailNumber}NK`,
      crew: [],
    };
  }).filter((flight) => flight.dh === '');
}


/**
 * Get a list of URLs to find the crew names for each flight segment.
 * @param {Object} menuItems - A list of jQuery "div.rClickMenuItem" objects.
 * @return {Array} A list of crew URLs.
 */
function getCrewUrls(menuItems) {
  return menuItems.map((menuItem) => {
    const url = menuItem.getAttribute('onclick');
    const crewUrl = `https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/${url.match(/"(.*?)"/g)[0].replace(/['"]+/g, '')}`;
    return crewUrl;
  });
}


/**
 * Get a list of crew data for all flight segments in the pairing.
 * @param {Array} crewUrls - An array of URLs.
 * @return {Promise} A list of crew data.
 */
async function getCrews(crewUrls) {
  // Create a promise that will resolve when all of the crew data has been fetched.
  const crewsPromise = Promise.all(crewUrls.map(async (url) => {

    // Fetch the crew data for the given URL.
    const response = await fetch(url);
    const responseText = await response.text();
    const crewHtml = new DOMParser().parseFromString(responseText, 'text/html');

    // Return the crew names.
    return getCrewNames(crewHtml);
  }));

  // Wait for all of the crew data to be fetched.
  const crews = await crewsPromise;

  // Return the crews.
  return crews;
}



/**
 * Get the crew names for a single flight leg.
 * @param {Document} crewHtml - The flight leg crew HTML document.
 * @return {Object} The crew names object.
 */
function getCrewNames(crewHtml) {
  const crewNames = {
    fltNum: crewHtml.getElementById('lblFlightNo').textContent.replace(/\b0+/g, ''),
    orig: crewHtml.getElementById('lblDeptCity').textContent,
    dest: crewHtml.getElementById('lblArrvCity').textContent,
    crew: [],
  };

  // Get the <table> containing all the crew names for each leg.
  const crewTable = crewHtml.getElementById('dgFlightCrew');

  // Get each row in the table.
  const crewRows = crewTable.querySelectorAll('tr');

  // Use `map()` to create a new array containing objects with the crew names.
  crewNames.crew = Array.from(crewRows).map((tr) => ({
    role: tr.querySelectorAll('td')[0].textContent.trim(),
    dh: tr.querySelectorAll('td')[1].textContent.trim(),
    id: tr.querySelectorAll('td')[3].textContent.trim(),
    last: capitalize(tr.querySelectorAll('td')[4].textContent.trim()),
    first: capitalize(tr.querySelectorAll('td')[5].textContent.trim()),
  }));

  // Remove the first row of the `crew[]` array (the header row of the table).
  crewNames.crew.shift();

  return crewNames;
}


/**
 * Match crew names with the correct flight and join them together.
 * @param {Array} flights - The flights object.
 * @param {Array} crews - The crews object.
 * @return {Array} Complete flights object with crew names.
 */
function addCrews(flights, crews) {
  return flights.map((flight) => {
    // Find the corresponding crew for the flight
    const matchingCrew = crews.find((leg) => {
      return (
        leg.fltNum === flight.fltNum
        && leg.orig === flight.orig
        && leg.dest === flight.dest
      );
    });

    // If a matching crew was found, add it to the flight object
    if (matchingCrew) {
      flight.crew = matchingCrew.crew;
    }

    return flight;
  });
}


/**
 * Build the flights table from the flights object.
 * @param {Array} flights - The flights object.
 * @param {string} pairingNumber - The pairing number.
 * @return {Array} The complete flights table.
 */
function buildTable(flights, pairingNumber) {
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
      (name) => !name.dh && (name.role === 'CA' || name.role === 'FO')
    );

    // Add the crew names to the row
    row.push(...crew.map((name) => `"${name.id} ${name.last}, ${name.first}"`));

    return row;
  });
}

