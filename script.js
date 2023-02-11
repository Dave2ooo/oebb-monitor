// Siemensstraße 1292105
// Floridsdorf 1292101

/* URL parameters
departure_station (required) ... ID of the departure station
destination_station (optional) ... ID of the destination station
products_filter (optional) ... filtering the mean of transportation (Train, Bus,...)
num_journeys (optional) ... number of connections to show (default: 6)
additional_time (optional) ... lead time in minutes (default: 0)
update_interval (optional) ... Updates the data every X second(s) (default: 30)
*/

// #region Set default parameters
var departure_station;
var destination_station = "";
var products_filter = 1011111111011;
var set_num_journeys = 6;
var set_additional_time = 0; // minutes
var update_interval = 30000;
// #endregion

// #region Read URL parameters */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has("departure_station")) {
  departure_station = urlParams.get("departure_station");
}
if (urlParams.has("destination_station")) {
  destination_station = urlParams.get("destination_station");
}
if (urlParams.has("products_filter")) {
  products_filter = urlParams.get("products_filter");
}
if (urlParams.has("num_journeys")) {
  set_num_journeys = urlParams.get("num_journeys");
}
if (urlParams.has("additional_time")) {
  set_additional_time = urlParams.get("additional_time");
}
if (urlParams.has("update_interval")) {
  update_interval = urlParams.get("update_interval") * 1000;
}
// #endregion

const url_scotty =
  "https://fahrplan.oebb.at/bin/stboard.exe/dn?L=vs_scotty.vs_liveticker&boardType=dep&tickerID=dep&start=yes&eqstops=true" +
  "&evaId=" +
  departure_station +
  "&dirInput=" +
  destination_station +
  "&showJourneys=" +
  set_num_journeys +
  "&maxJourneys=" +
  set_num_journeys +
  "&additionalTime=" +
  set_additional_time +
  "&productsFilter=" +
  products_filter +
  "&outputMode=tickerDataOnly";

var loadedFlag = false;

var xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8080/" + url_scotty, true);
xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
xhr.onreadystatechange = function () {
  if (xhr.status != 200) {
    console.error("Error. Status: " + xhr.status);
    document.getElementById("current_time").innerHTML +=
      " Error. Status: " + xhr.status;
  }
  // #region Get JSON data
  var json_data_string = xhr.responseText;
  if (typeof json_data_string == "undefined") return;
  json_data_string = json_data_string.split("=");
  json_data_string = json_data_string[1];
  if (typeof json_data_string == "undefined") return;
  json_data_string = json_data_string.trimStart();
  var json_data = JSON.parse(json_data_string);
  if (json_data.journey == undefined) {
    console.error("no journeys available \n" + json_data_string);
  }
  // #endregion

  // Use JSON data
  const num_journeys = json_data.journey.length;

  if (!loadedFlag) {
    document.getElementById("current_time").innerHTML =
      GetCurrentTimeInHH_MMFormat();

    // create table element
    var table = document.createElement("table");
    table.setAttribute("id", "table");

    // create table body with data rows
    var tableBody = document.createElement("tbody");

    for (let i = 0; i < num_journeys; i++) {
      // Get data from JSON
      const scheduled_departure_time = json_data.journey[i].ti;
      const actual_departure_time = json_data.journey[i].rt.dlt;
      const direction = json_data.journey[i].st;

      // Table
      var dataRow = document.createElement("tr");
      var dataCell0 = document.createElement("td");
      var dataCell1 = document.createElement("td");
      var dataCell2 = document.createElement("td");
      var dataCell3 = document.createElement("td");
      dataRow.appendChild(dataCell0);
      dataRow.appendChild(dataCell1);
      dataRow.appendChild(dataCell2);
      dataRow.appendChild(dataCell3);
      dataRow.classList.add("row");
      dataCell0.classList.add("cell", "minutes_left");
      dataCell1.classList.add("cell", "actual_departure_time");
      dataCell2.classList.add("cell", "scheduled_departure_time");
      dataCell3.classList.add("cell", "direction");
      tableBody.appendChild(dataRow);
      table.appendChild(tableBody);

      // Check if train is late
      if (actual_departure_time != undefined) {
        // Train late
        dataCell1.innerHTML = actual_departure_time;
        minutes_left = CalculateTimeLeft(actual_departure_time);
      } else {
        minutes_left = CalculateTimeLeft(scheduled_departure_time);
      }
      dataCell0.innerHTML = minutes_left;
      dataCell2.innerHTML = scheduled_departure_time;
      dataCell3.innerHTML = direction;
    }
    // Delete old table
    const myTable = document.getElementById("table");
    if (myTable != null) myTable.remove();
    // Add new table
    document.getElementById("tableContainer").appendChild(table);
    loadedFlag = 1;
  }
};

function CalculateTimeLeft(_dep_time) {
  const _dep_hours = parseInt(_dep_time.slice(0, 2));
  const _dep_minutes = parseInt(_dep_time.slice(3));

  const timestamp = Date.now();
  const date = new Date(timestamp);
  const _current_hours = date.getHours();
  const _current_minutes = date.getMinutes();

  var _minutes_left = 60 * (_dep_hours - _current_hours);
  if (_minutes_left < 0) _minutes_left += 60 * 24;
  _minutes_left += _dep_minutes - _current_minutes;

  return _minutes_left;
}

function GetCurrentTimeInHH_MMFormat() {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  var _current_hours = date.getHours();
  var _current_minutes = date.getMinutes();

  if (_current_hours < 10) _current_hours = "0" + _current_hours;
  if (_current_minutes < 10) _current_minutes = "0" + _current_minutes;

  return _current_hours + ":" + _current_minutes;
}

// var dummy = 0;

function CallAPI() {
  try {
    loadedFlag = false;
    document.getElementById("current_time").innerHTML += " Data not up to date";
    xhr.open("GET", "http://localhost:8080/" + url_scotty, true);
    xhr.send();
  } catch (error) {
    console.error(error);
    document.getElementById("current_time").innerHTML += error;
  }
}

window.addEventListener("load", (event) => {
  // Display error if departure station is not stated
  if (!urlParams.has("departure_station")) {
    document.getElementById("current_time").innerHTML =
      'Departure station must be stated: "url+?departure_station=1234567"';
    console.error(
      'Departure station must be stated: "url+?departure_station=1234567"'
    );
    return;
  }

  document.getElementById("current_time").innerHTML += "loading: ";
  setInterval(CallAPI, update_interval);
  CallAPI();
});