'use strict';
let url = "https://jsonplaceholder.typicode.com/todos";
/**
 * this function calling the api call and geting response
 * @param {} url 
 */
function getData(url) {
      return fetch(url, {
          method: "GET",
          headers: {
              "Content-Type": "application/json; charset=utf-8",
          },
      })
      .then(response => response.json());
    }
/**
 * this function uses to get the response data and build dropdown
 */
getData(url)
    .then(data => {
        let resData =_.groupBy(data,'userId');
        let moResData = _.map(resData);
        for(let i=0 ;i < moResData.length;i++) {
            selectId(i,moResData[i]);
        };
    })
    .catch(error => {
        document.getElementById('errorDiv').innerHTML = "Error in fetching Data from api ";
    });
/**
 * this function for building dropdown
 * @param {} item 
 * @param {*} data 
 */
const selectId = (item,data) => {
    const selectElement = document.getElementsByClassName("inputGroupSelect")[0];
    let createSelectElement = document.createElement("option");
    createSelectElement.textContent = data[item].userId;
    createSelectElement.value = data[item].id;
    selectElement.appendChild(createSelectElement);
}
/**
 * this function is for getting input from user and calling the api
 */
const drawChartsTable = () => {
    let selectedUserId =$("#selectUserId option:selected").text();
    let url = "https://jsonplaceholder.typicode.com/todos?userId=" + selectedUserId ;
    userIdGetData(url);
}
/**
 * this function load table data and chart data after resolving promise 
 * @param {} queryUrl 
 */
const userIdGetData = (queryUrl) => {
    let resData = [];
    getData(queryUrl)
        .then(data => {
            resData = data;
            let chartPerData = calculatePercentage(resData);
            drawTableMap(resData);
            ChartInit(chartPerData);
        })
}
/**
 * this function return %tage for completed and incompleted todo
 * @param {*} inputArray is response data coming for selected userId
 */
const calculatePercentage = (inputArray) => {
    let total = inputArray.length;
    let diff = {"completed" : 0, "incompleted": 0}; 
    let completedData = _.filter(inputArray, 'completed');
    let completedLength = completedData.length;
    let completedPercententage = (completedLength * 100) / total;
    let incompletedPercentage = 100 - completedPercententage;
    diff = {"completed":completedPercententage,"incompleted":incompletedPercentage};
    return diff;
}
/**
 * this function for initializing chart data
 * @param {} percentageData 
 */
const ChartInit = (percentageData) => {
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(() => drawChart(percentageData));
}
/**
 * this function for drawing chart with options
 */
const drawChart = (fillData) => {
    const loadData = google.visualization.arrayToDataTable([
        ['%','Completed','Incompleted'],
        ['',fillData.completed, fillData.incompleted]
    ]);
    let options = {
        vAxis: {
            minValue: 0,
            maxValue: 80,
            title: 'completion rate %'
            },
        width: '100%',
        height: 500,
        colors: ['#1F9E77','#DA5E0F'],
        legend: {
            position: 'top',
            textStyle: {
                fontSize: '1em'
            }
        }   
    };
    let charts = new google.visualization.ColumnChart(document.getElementById('chart-todo'));
    charts.draw(loadData, options);
}

/**
 * this function for loading data in table (datatables plugin)
 * @param {} resArr this is response data
 */
const drawTableMap = (resArr) => {
    const columnDefs = [
        {"data":"userId", "title": "UserId", "visible": false},
        {"data":"id", "title":"Todo Id"},
        {"data":"title", "title": "Todo Title"},
        {"data":"completed", "title": "Completed?", render: function ( data, type, row ) {
            if ( type === 'display' ) {
                return '<input type="checkbox" class="checkbox-active" disabled>';
            }
            return data;
        },
        className: "dt-body-center"
        }
    ]
    $('#table-todo').DataTable({
        data: resArr,
        columns: columnDefs,
        rowCallback: function ( row, data ) {
            $('input.checkbox-active', row).prop( 'checked', data.completed == 1 );
        },
        retrieve: true
    });
}

