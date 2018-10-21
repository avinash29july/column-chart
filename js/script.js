'use strict';
let colors = ['#2E3F4F', '#489C85', '#A2B55B', '#E99E32', '#B54A37'];
let url = "https://jsonplaceholder.typicode.com/todos";

function getData(url) {
    // Default options are marked with *
      return fetch(url, {
          method: "GET", // *GET, POST, PUT, DELETE, etc.
          headers: {
              "Content-Type": "application/json; charset=utf-8",
              // "Content-Type": "application/x-www-form-urlencoded",
          },

      })
      .then(response => response.json()); // parses response to JSON
  }

getData(url)
    .then(data => {
        let resData =_.groupBy(data,'userId');
        let moResData = _.map(resData)

        for(let i=0 ;i < moResData.length;i++) {
            selectId(i,moResData[i]);
                
        }
    })
    .catch(error => {
        document.getElementById('errorDiv').innerHTML = "Error in fetching Data from api "
    });

const selectId = (item,data) => {
    const selectElement = document.getElementsByClassName("inputGroupSelect")[0];
    let createSelectElement = document.createElement("option");
    createSelectElement.textContent = data[item].userId;
    createSelectElement.value = data[item].id;
    selectElement.appendChild(createSelectElement);
}

    
const drawChartsTable = () => {
    let selectedUserId =$("#selectUserId option:selected").text();
    debugger;
    let url = "https://jsonplaceholder.typicode.com/todos?userId=" + selectedUserId ;
    userIdGetData(url);
}

const userIdGetData = (queryUrl) => {
    let resData = [];
    getData(queryUrl)
        .then(data => {
            resData = data;
            drawTableMap(resData);
        })
}


const drawTableMap = (resArr) => {
    
    const columnDefs = [
        {"data":"userId", "title": "UserId", "visible": false},
        {"data":"id", "title":"Todo Id"},
        {"data":"title", "title": "Todo Title"},
        {"data":"completed", "title": "completed?", render: function ( data, type, row ) {
            if ( type === 'display' ) {
                return '<input type="checkbox" class="checkbox-active">';
            }
            return data;
        },
        className: "dt-body-center"}
      
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

