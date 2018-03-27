var turnOverData = {
  datasets: [{
    label: "Time Spent During the Day",
    backgroundColor: ["#ff6b81", "#2ed573"],
    data: [20, 80]
  }],
  labels: ["Seeking Info", "Being Productive"]
};

var ctx = document.getElementById("turnOver");
var turnOver = new Chart(ctx, {
  type: "pie",
  data: turnOverData,
  options: {
    title: {
      display: true,
      text: "Employees spend 20% of their time looking for information",
      fontColor: "#f1f2f6",
      fontSize: 16,
      responsive: true,
      fontFamily: "'Open Sans', 'Helvetica', 'Arial', 'sans-serif'"
    },
    legend: {
      labels: {
        fontColor: "#f1f2f6"
      }
    }
  }
})
