
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import numeral from "numeral";
import "chartjs-adapter-date-fns";
import "chartjs-adapter-moment";



Chart.register(...registerables);


const options = {
  legend: {
    display: true,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    x: {
      
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    y: {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          }
        },
      }
  }
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data[casesType]) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType, ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          //console.log(chartData);
          // buildChart(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
          style={{vh:50}}
          datasetIdKey="id"
        />
      )}
    </div>
  );
}

export default LineGraph;