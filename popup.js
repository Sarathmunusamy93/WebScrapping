chrome.runtime.sendMessage({ type: "getScrapResult" }, (response) => {
  // use the response here
});

$(document).ready(function () {
//   $("#doScrap").click(function () {
    chrome.runtime.sendMessage({ type: "getScrapResult" }, (response) => {
      var resultList = response.shopingItemsList;

      for (let index = 0; index < resultList.length; index++) {
        const element = resultList[index];

        if ((index == 0)) {
          let tableHeader = "";

          for (const key in element) {
            if (element.hasOwnProperty(key)) {
              tableHeader += "<th>" + key+"</th>";
            }
          }

          $("#table").append("<thead><tr class='theader'> " + tableHeader + "</tr></thead>");
        }

        
        var newRow = '';
        for (const key in element) {
          if (element.hasOwnProperty(key)) {
            newRow += "<td>" + element[key]+"</td>";
          }
        }

        $("#table").append("<tr>" + newRow + "</tr>");

      }
    });
  //});

  $('#dwnJson').on('click',function(){
    $("#table").tableHTMLExport({type:'json',filename:'sample.json'});
  })
  $('#dwnexcel').on('click',function(){
    $("#table").tableHTMLExport({type:'csv',filename:'sample.csv'});
  })
  $('#dwnPDF').on('click',function(){
    $("#table").tableHTMLExport({type:'pdf',filename:'sample.pdf'});
  })

});
