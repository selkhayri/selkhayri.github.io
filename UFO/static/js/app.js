// import the data from data.js
const tableData = data;

// Reference the HTML table using d3
var tbody = d3.select("tbody");

function buildTable(data) {
    // First, clear out any existing data
    tbody.html("");
  
    // Next, loop through each object in the data
    // and append a row and cells for each value in the row
    data.forEach((dataRow) => {
      // Append a row to the table body
      let row = tbody.append("tr");
  
      // Loop through each field in the dataRow and add
      // each value as a table cell (td)
      Object.values(dataRow).forEach((val) => {
        let cell = row.append("td");
        cell.text(val);
        }
      );
    });
  }

// filterTable()
// =============
// This function filters the search results that are displayed in the table.
//
// Arguments:
// None
//
// Returns:
// None
function filterTable() {
 
  // missing is the header of the alert box that will be displayed if any
  // of the search text fields are enabled but no value has been specified.
  let missing = "Missing Values:";

  // values is the new-line delimited list of empty fields
  let values = "";

  // Initialize filterData to the original data set
  let filteredData = tableData;

  // Retrieve the Search checkboxes
  chkboxes = getCheckboxes();

  // For each of the checkboxes, do the following
  chkboxes.forEach((cb) => { 

    // Initialise the value of the checkbox to ""
    let val = "";

    // If the checkbox is checked
    if (d3.select(`#${cb.id}`).property("checked")) {

      // Retrieve the name of the field from the checkbox id
      let field = cb.id.substring(3,cb.id.length);

      // Compose the filterId
      filterId = `#filter${field}`;
      
      // Retrieve the filter and obtain its value property
      val = d3.select(filterId).property("value");
      
      // If the filter value is ""
      if ( val === "") {
        // Add it to the list of missing filter values
        values = `${values}\nEnter ${field}`;
      }
      else {
        // Otherwise, filter the table data accordingly
        filteredData = filteredData.filter((row) => row[field] === val);
      }
    }
  });

  // If empty search text fields were found
  if (values != "") {
    // display alert box showing the user the list of empty fields
    alert(`${missing}\n${values}`);
  }
  else {
  // Rebuild the table using the filtered data
    buildTable(filteredData);
  }
}


// addFilter()
// ===========
// This function adds a search box for the field that is specified in the argument list.
// 
// Arguments:
// forfield - text - the field for which the filter should be displayed
//
// Returns:
// None

function addFilter(forfield) {
  let placeholder = ""; // value to place in search field to display expected data format
  
  let listItemId = `filterby${forfield}`;   // set the id of the search item
  let labelInnerHTML = `Enter ${forfield}`; // set the text to put in the search label
  let inputId = `filter${forfield}`;        // set the id of the search text field

  // set the placeholder that is corresponds to the forfield field
  if ( forfield === "datetime") {
    placeholder = "1/10/2010";
  }
  else if (forfield === "city") {
    placeholder = "london";
  }
  else if (forfield === "state") {
    placeholder = "ca";
  }
  else if (forfield === "country") {
    placeholder = "us";
  }
  else if (forfield === "shape") {
    placeholder = "circle";
  }

  // Add the listItem to the div whose ID is "filters"
  d3.select("#filters").append("li").attr("id","g1"+listItemId)
                          .attr("class","bg-dark list-group-item");
  
  // Add the search label to the listItem
  d3.select("#g1"+listItemId).append("label")
                              .attr("for",forfield)
                              .html(labelInnerHTML);
  
  // Add a line break to the listItem
  d3.select("#g1"+listItemId).append("br");
  
  // Add the search text field to the listItem. Specify the type,id,placeholder, and class attributes
  d3.select("#g1"+listItemId).append("input")
                              .attr("type","text")
                              .attr("id",inputId)
                              .attr("placeholder",placeholder)
                              .attr("class","btn btn-dark");
  
  
}

// allUnchecked()
// ==============
// This function determines if all the search checkboxes are unchecked
//
// Arguments:
// None
//
// Return:
// true, if all the checkboxes are unchecked. Otherwise, false.
function allUnchecked() {
  // Retrieve the array of search checkbox objects
  chkboxes = getCheckboxes();
  
  // Iterate through the checkboxes.
  // If the current checkbox status is true, return false, indicating that
  // not all the checkboxes are unchecked.
  chkboxes.forEach((chk) => {if (chk.checked) return false});

  // If none of the checkboxes have a checked status of false, return true, indicating
  // that all the checkboxes are unchecked.
  return true;
}


// handleCheck()
// =============
// This function is invoked by the checking or unchecking of search checkboxes. It then 
// adds the search filter that corresponds to the check box if the box was checked, and
// removes the search filter if the box was unchecked.
//
// Arguments:
// None
//
// Return:
// None
function handleCheck() {
  
  // Determine which checkbox is invoking this handler
  src = event.target;

  // Determine the value of "filterId" based on the id of src checkbox
  field = src.id.substring(3,src.id.length);
  filterId = `filterby${field}`;
  
  // If the checkbox was unchecked
  if (!src.checked) {
    // Remove the search filter from the filters group
    d3.select("#filters").select(`#g1${filterId}`).remove();
  }
  else {
    // Add the corresponding filter to the filters group
    filter = filterId.substring(8,filterId.length);
    addFilter(filter);
  }
}

// getCheckboxes()
// ===============
// This function retrieves the list of search checkboxes
//
// Arguments:
// None
//
// Returns:
// checkboxes - array of search checkbox nodes
function getCheckboxes() {

  // Initialise checkboxes list to blank list
  var checkboxes = []
  
  // Get the list of nodes contained in the search check boxes
  elements = d3.selectAll(".fil-box").nodes();

  // Iterate through the list of nodes
  for(var i=0;i<elements.length;i++) {
  // Add the nodes to the checkboxes array 
    checkboxes.push(elements[i])
  }  
  // return the checkboxes array
  return checkboxes;
}

// resetForm()
// ===========
// This function resets the search form. It unchecks the search checkboxes, removes the search items, 
// and refreshes the search table with the entire data set. 
//
// Arguments:
// None
//
// Returns:
// None
function resetForm() {
  // Retrieve the list of search checkboxes
  chkboxes = getCheckboxes();

  // Uncheck all the search checkboxes
  chkboxes.forEach((chk) => chk.checked = false);

  // Clear the filters. Remove all the search items
  d3.select("#filters").html("");

  // Refresh the results table - show entire data set
  buildTable(tableData);
}

// Add an event listener for the checkboxes
checkboxes = getCheckboxes();
checkboxes.forEach((cb) => d3.selectAll("#"+cb.id).on("click", handleCheck));

// Build the table when the page loads
buildTable(tableData);

// Uncheck the search checkboxes
checkboxes.forEach((cb) => cb.checked = false);

// Add an event listener to the "Filter Date" button
d3.select("#filter-btn").on("click", filterTable);

// Add an event listener to the "Reset Form" button
d3.select("#reset-btn").on("click", resetForm);

// Disable form submission on &lt;return&gt; key
d3.select("form").on("submit", function() {
  // prevent form submission
  d3.event.stopPropagation();
  d3.event.preventDefault();
});