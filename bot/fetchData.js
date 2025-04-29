// Static Data for now
const data = {
    beats: [
      { id: 1, name: "Beat A", area: "Downtown" },
      { id: 2, name: "Beat B", area: "Uptown" }
    ],
    incidents: [
      { id: 101, beat_id: 1, type: "Robbery", date: "2025-04-01" },
      { id: 102, beat_id: 2, type: "Accident", date: "2025-04-02" }
    ],
    sos: [
      { id: 201, location: "5th Avenue", time: "12:30 PM" }
    ]
  };
  
  function getData() {
    return data;
  }
  
  module.exports = { getData };
  