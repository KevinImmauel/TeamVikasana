const Incident = require('../model/incidentModel.js');
const SOS = require('../model/sosModel.js');

let cachedData = null;

async function fetchIncidents() {
  return await Incident.find({}).limit(10); 
}

async function fetchSOS() {
  return await SOS.find({}).limit(10); 
}

async function fetchData() {
  const incidents = await fetchIncidents();
  const sos = await fetchSOS();

  const stations = [...new Set([...incidents, ...sos].map(s => s.station_id))]
    .map((id, idx) => ({ id, name: `Station ${id}`, area: `Area ${idx + 1}` }));

  cachedData = { incidents, sos, stations };
}

async function getData() {
 
  if (!cachedData) {
    await fetchData();
  }
  return cachedData;
}

// Refresh the data only when triggered
async function refreshData() {
  await fetchData(); 
  return cachedData;  
}

setInterval(async () => {
  await fetchData();
}, 5000);

module.exports = { getData, refreshData };
