/* slipstream.js | MIT License | https://github.com/bws428/slipstream */

"use strict";

jQuery(function() {
  //
  // Define the header row for the CSV file.
  //
  // NOTE: The number and order of the column names must not be changed,
  // but the column names themselves can be altered to match the expected
  // input fields for any given logbook software importer.
  //
  // TODO: Make this a user-configurable option.
  //
  const header = [
    "Remarks", // Pairing number goes here.
    "Date",
    "Flight Number",
    "From",
    "To",
    "Departure Time",
    "Arrival Time",
    "Total",
    "Aircraft ID",
    "PIC Name",
    "SIC Name"
  ];

  // Insert the "Export" button.
  $("#hideDropPU").before(
    `<font class="buttontext">
        <button id="export" type="button" disabled="disabled">
          &nbsp; Export &nbsp;
        </button>
      </font>`
  );

  // Add a link for the user options menu.
  $("td.pmlabeltext")
    .next()
    .after(`<td id="options"><a id="menu" href="#">Export options</a></td>`);
  $("#menu").hide(); // Don't show the menu just yet.

  // Add a spot for status messages.
  $("#tbGRID").after(`<div id="status"></div>`);

  // Get the pairing number.
  const pairing_number = $("#PrgNo").val().toString();

  // Get the pairing date.
  const pairing_date = $("#PrgDate").val().replaceAll("/",".").toString();
  console.log("Pairing " + pairing_number + " on " + pairing_date);

  // Get all the valid flight segments for this pairing.
  let flights = getFlights($('script:contains("gGridText")').text());

  // Get the crew URLs for all valid flight segments.
  const urls = getCrewUrls(
    $("#MenusDIV").find('.rClickMenuItem:contains("Flight Leg Crew")')
  );

  // Must wait for crews to return before doing anything else.
  // Is there a more elegant way to do this?
  (async () => {
    // Get the crew names asynchronously.
    const crews = await getCrews(urls);

    // Add crews to flights.
    flights = addCrews(flights, crews);

    // Turn flights object into a 2D array.
    const table = buildTable(flights, pairing_number);

    // Log flights to console.
    console.log("flights: ", flights);

    // Build the CSV file string and log to console.
    const csv = buildCsv(header, table);
    console.log(csv);

    // Ready to export.
    $("#status").text("Ready to export.");
    $("#export").prop("disabled", false).effect("pulsate", { times: 2 }, 1200);

    // Download flights CSV when "Export" button is clicked.
    $("#export").click(function() {
      downloadCsv(csv, pairing_number, pairing_date);
    });
  })();
});

//
// ----------------------
//   Helper Functions
// ----------------------
//

/**
 * Capitalize only the first letters of a name.
 * @param {string} names - Name(s) to capitalize.
 * @return {string} The capitalized name(s).
 */
function capitalize(names) {
  return (names.toLowerCase() + "").replace(/^([a-z])|\s+([a-z])/g, $1 => {
    return $1.toUpperCase();
  });
}

/**
 * Build a properly-formatted CSV file from a 2D array.
 * @param {Array} header - An list of column header fields.
 * @param {Array} table - A 2D array of data.
 * @return {string} - A CSV-formatted string.
 */
function buildCsv(header, table) {
  let csv = header.join(",") + "\n";
  table.forEach(row => {
    csv += row.join(",") + "\n";
  });

  return csv;
}

/**
 * Download a formatted string as a CSV file.
 * @param {string} csv - A CSV-formatted string.
 * @param {string} pairing_number - The pairing number.
 * @param {string} pairing_date - The pairing start date.
 */
function downloadCsv(csv, pairing_number, pairing_date) {
  const a = document.createElement("a");
  a.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  a.target = "_blank";
  a.download = pairing_number + "-" + pairing_date + ".csv";
  a.click();
  // Why is pairing_date undefined here?
  console.log("Pairing " + pairing_number + " on " + pairing_date);
}

/**
 * Get a list of flight segments from CrewTrac's "Pairing Inquire" page.
 * @param {string} gridText - The <script> block containing the "gGridText" var.
 * @return {Array} A list of flight segments.
 */
function getFlights(gridText) {
  // Get value of "gGridText" var from input string and return an array of legs.
  let flights = [];
  flights = gridText.split("'")[1].split("-");

  // Discard all rows that are not valid flight segments ("L:").
  flights = flights.filter(entry => {
    return entry.substring(0, 3).search("L:") !== -1;
  });

  // Split each row string into an array of data fields.
  flights.forEach((row, i) => {
    flights[i] = row.split("::");
  });

  // Build an array of flight segment objects from the flights table.
  let tail_number;
  flights.forEach((row, i) => {
    tail_number = row[18].trim();
    // Last 3 digits of the ship number should be the tail number.
    if (tail_number.length > 3) {
      tail_number = tail_number.slice(-3);
    }

    flights[i] = {
      dh: row[7].trim(),
      date: row[4].trim(),
      code: row[5].trim(),
      fltNum: row[6].trim().replace(/\b0+/g, ""),
      orig: row[8].trim(),
      dest: row[9].trim(),
      depart: row[10].trim(),
      arrive: row[11].trim(),
      block: row[12].trim(),
      tail: "N" + tail_number + "NK",
      crew: []
    };
  });

  // Flights with no OA entry are, by default, NKS flights.
  flights.forEach(flight => {
    if (!flight.code) flight.code = "NKS";
  });

  // Filter out DH legs.
  flights = flights.filter(flight => flight.dh == "");

  return flights;
}

/**
 * Get a list of URLs to find the crew names for each flight segment.
 * @param {Object} menuItems - A list of jQuery "div.rClickMenuItem" objects.
 * @return {Array} A list of crew URLs.
 */
function getCrewUrls(menuItems) {
  const crewUrls = [];

  $(menuItems).each(function(i) {
    crewUrls[i] = $(this).attr("onclick");
  });

  crewUrls.forEach((url, i) => {
    crewUrls[i] =
      "https://workspace.spirit.com/cvpn/https/ctweb.spirit.com/CrewWeb/" +
      url.match(/"(.*?)"/g)[0].replace(/['"]+/g, "");
  });

  return crewUrls;
}

/**
 * Get a list of crew data for all flight segments in the pairing.
 * @param {Array} crewUrls - An array of URLs.
 * @return {Promise} A list of crew data.
 */
async function getCrews(crewUrls) {
  const crews = [];
  const j = crewUrls.length;

  for (const [i, url] of crewUrls.entries()) {
    $("#status").text(`Loading crews... ${i + 1} of ${j}`);
    try {
      const response = await fetch(url);
      const crewHtml = await response.text();
      crews[i] = getCrewNames(crewHtml);
    } catch (error) {
      console.error(error);
      $("#status").text(`Cannot load crew names. Try refreshing the page.`);
      return;
    }
  }

  return crews;
}

/**
 * Get the crew names for a single flight leg.
 * @param {string} crewHtml - The flight leg crew HTML string.
 * @return {Object} The crew names object.
 */
function getCrewNames(crewHtml) {
  const crewNames = {
    fltNum: $(crewHtml).find("#lblFlightNo").text().replace(/\b0+/g, ""),
    orig: $(crewHtml).find("#lblDeptCity").text(),
    dest: $(crewHtml).find("#lblArrvCity").text(),
    crew: []
  };
  const crewTable = $(crewHtml).find("#dgFlightCrew");

  $("tr", $(crewTable)).each(function(row, tr) {
    crewNames.crew[row] = {
      dh: $(tr).find("td:eq(1)").text().trim(),
      role: $(tr).find("td:eq(0)").text().trim(),
      id: $(tr).find("td:eq(3)").text().trim(),
      last: capitalize($(tr).find("td:eq(4)").text().trim()),
      first: capitalize($(tr).find("td:eq(5)").text().trim()
      )
    };
  });
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
  flights.forEach(flight => {
    crews.forEach(leg => {
      if (
        leg.fltNum == flight.fltNum &&
        leg.orig == flight.orig &&
        leg.dest == flight.dest
      ) {
        flight.crew = leg.crew;
      }
    });
  });

  return flights;
}

/**
 * Build the flights table from the flights object.
 * @param {Array} flights - The flights object.
 * @param {string} pairing_number - The pairing number.
 * @return {Array} The complete flights table.
 */
function buildTable(flights, pairing_number) {
  const table = [];
  flights.forEach((flight, i) => {
    table[i] = [];
    table[i][0] = pairing_number;
    table[i][1] = flight.date;
    table[i][2] = flight.code + flight.fltNum;
    table[i][3] = flight.orig;
    table[i][4] = flight.dest;
    table[i][5] = flight.depart;
    table[i][6] = flight.arrive;
    table[i][7] = flight.block;
    table[i][8] = flight.tail;
    flight.crew.forEach(name => {
      if (!name.dh && name.role == "CA") {
        table[i][9] = `"${name.id} ${name.last}, ${name.first}"`;
      }
      if (!name.dh && name.role == "FO") {
        table[i][10] = `"${name.id} ${name.last}, ${name.first}"`;
      }
    });
  });

  return table;
}
