"use strict";

import { ready, buildCsv, downloadCsv } from "./helpers";
import getFlights from "./getflights";
import getQuickCrews from "./getquickcrews";
import getCrewUrls from "./getcrewurls";
import getCrews from "./getcrews";
import addCrews from "./addcrews";
import buildTable from "./buildtable";

// Make sure the DOM is fully loaded and ready...
// ...using only vanilla JS
ready(() => {
  // Create a new Export button element
  const exportButton = document.createElement("button");
  exportButton.type = "button";
  exportButton.id = "export_button";
  exportButton.textContent = "Export";
  exportButton.disabled = true;

  // Insert the Export button to the right of the Print button.
  const printButton = document.getElementById("btnPRINT");
  printButton.insertAdjacentElement("afterend", exportButton);

  // Create a new <div> for status messages.
  const statusMessage = document.createElement("div");
  statusMessage.id = "status_message";

  // Insert the status messages at the bottom of the "tbGRID" table.
  const tbGrid = document.getElementById("tbGRID");
  tbGrid.insertAdjacentElement("afterend", statusMessage);

  // Get the pairing number.
  const pairingNumber = document.getElementById("PrgNo").value.toString();

  // Get the pairing date.
  const pairingDate = document.getElementById("PrgDate").value.replaceAll("/", ".").toString();

  // Log the pairing number and date to the console.
  console.log(`Pairing ${pairingNumber} on ${pairingDate}`);

  // Get all the valid flight segments for this pairing.
  // NOTE: All the flights data is contained inside a <script> tag under
  // a variable called "gGridText", so we'll locate all the <script> tags
  // and select the one that contains the "gGridText" variable. Then we'll
  // process the raw "gGridText" string with our custom getFlights() function.
  // https://youmightnotneedjquery.com/#contains_selector
  const gridText = [...document.querySelectorAll("script")].filter((element) => (
    element.textContent.includes("gGridText")))[0].text;

  // Create the flights object from the gGridText string.
  const flights = getFlights(gridText);

  // Get the crew URLs for all valid flight segments.
  const menusDiv = document.getElementById("MenusDIV");
  const menuItems = [...menusDiv.querySelectorAll(".rClickMenuItem")].filter((element) => (
    element.textContent.includes("Flight Leg Crew")));
  const urls = getCrewUrls(menuItems);

  // This "Positions:" value should also tell us if there are two pilots, rather than just one.
  // If we could grab the CA=1 and FO=1 values, and if both were TRUE, that would be the
  // trigger to skip the getCrews async call....

  // <TD WIDTH='460' ALIGN='LEFT'>
  //   <FONT CLASS='pmtabletext'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Positions:&nbsp;</FONT>
  //   <FONT CLASS='pmtabletext'>CA&nbsp;</FONT>
  //   <INPUT TYPE='TEXT' VALUE='1' CLASS='pmtabletext' SIZE='2'>
  //   <FONT CLASS='pmtabletext'>FO&nbsp;</FONT>
  //   <INPUT TYPE='TEXT' VALUE='1' CLASS='pmtabletext' SIZE='2'>
  //   <FONT CLASS='pmtabletext'>FA&nbsp;</FONT>
  //   <INPUT TYPE='TEXT' VALUE='0' CLASS='pmtabletext' SIZE='2'>
  //   <FONT CLASS='pmtabletext'>SP&nbsp;</FONT>
  //   <INPUT TYPE='TEXT' VALUE='0' CLASS='pmtabletext' SIZE='2'>
  // </TD>

  // If both CA and FO names are there, then we can SKIP the async call!
  const hdnCrewData = document.getElementById("hdnCREWDATA").value.toString();

  // Must wait for async getCrews() to return before doing anything else.
  // This ensures that the flights object is populated with all of the
  // crew names before the buildTable() and buildCsv() functions are called.
  (async () => {

    // Store the crew names in an object.
    let crews = {};

    // If there is data for BOTH pilots, there will be a ":-:" separator.
    // If only ONE pilot is listed, there will NOT be a ":-:" separator.
    if (hdnCrewData.search(":-:") !== -1) {
      crews = getQuickCrews(hdnCrewData);
    }
    else {
      // Update status message.
      statusMessage.textContent = `Loading crews... 1 of ${urls.length}`;

      // Get the crew names asynchronously.
      crews = await getCrews(urls, statusMessage);
    }
    
    // Add the crew names to the flights object.
    const pairing = addCrews(flights, crews);

    // Turn flights object into a 2D array.
    const table = buildTable(pairing, pairingNumber);

    // Define the header row for the CSV file.
    // NOTE: The number and order of the column names must not be changed,
    // but the column names themselves can be altered to match the expected
    // input fields for any given logbook software importer.
    //
    // TODO: Make this a user-configurable option.
    const header = [
      "Remarks", // Pairing number will go here
      "Date",
      "Flight Number",
      "From", // Origin airport code
      "To", // Destination airport code
      "Departure Time",
      "Arrival Time",
      "Total", // Total flight time
      "Aircraft ID",
      "PIC Name",
      "SIC Name",
    ];

    // Build the CSV file string and log to console.
    const csv = buildCsv(header, table);
    console.log(csv);

    // Update the status message and enable the Export button.
    statusMessage.textContent = "Ready to export.";
    exportButton.disabled = false;

    // Download flights CSV when "Export" button is clicked.
    exportButton.addEventListener("click", () => {
      downloadCsv(csv, pairingNumber, pairingDate);
    });
  })();
});

