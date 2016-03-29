## getDataAsync

This project is a collection of modules that helps in implementing Tableau Server 
in JavaScript applications.  The primary purpose for this is to more easily 
retrieve raw data, in JSON format, from Tableau Server.  This is particularly 
useful when you want to employ charting libaries such as d3 to visualize and 
display your Tableau data outside of the native Tableau environment.

For the Tableau super-users out there, the name of this library is borrowed 
from the elusive getDataAsync function, which is missing from the Tableau
JavaScript API, but has been in a perpetual "coming soon" state.

This project is my attempt to enable that functionality, ahead of Tableau's
official support.

## Usage

The way you use getDataAsync is by initializing a new JS object via
the Tableau JavaScript API and passing that object, along with your
requested filter parameters, to the getDataAsync function. 
The function will return a new object containing the underlying JSON 
of your query. 

getDataAsync makes an asynchronous call to Tableau Server and leverages 
JavaScript Promises to return the data once the request to the server
has completed, allowing you to chain this request with a then statement.

getDataAsync accepts three arguments, plus an optional "options" argument:

```javascript
getDataAsync(sheet, fieldname, value, options)
.then(function (data) {
  //do something with JSON
})
.catch(function (err) {
  //do something on error
});
```


## Options

getDataAsync can be configured through an options object. These options
allow you to specify how you would like to receive your JSON from Tableau.

See below for the default settings of these options:

```javascript
var options = {
  "clean": false,
  "flatten": false,
  "raw": false,
  "filter": true
};
```

clean: 

When set to true, the "clean" setting will strip aggregations, such as "SUM" 
and "MIN" from the field name titles in your worksheet, which Tableau includes
by default. (Disabled when "raw" is set to true.)

flatten:

When set to true, "flatten" will transform your JSON output into a 
single-dimension array of objects, setting each key of that object to the value 
of Tableau's fieldName key, and setting the value of that new key to Tableau's 
formattedValue key. You may find this flatter output is easier to query.
(Disabled when "raw" is set to true.)

raw:

When set to true, "raw" will output the raw JSON returned by Tableau. By 
default, getDataAsync() leverage's Tableau's getPairs() function to transform
JSON output into an two-dimensional array of objects. This raw setting will
include some additional data that will require more parsing to use. (This
setting disables "clean" and "flatten".)

filter:

By default, "filter" is set to true. In order to retrieve JSON from Tableau,
the data you want to retrieve must first be present in your workbook. This
setting will automatically filter your requested field name and value before
attempting to retrieve its JSON. Setting this to false will require you to
first filter those values using Tableau's native JavaScript API. 

## Examples

Here is an example of retrieving the "Male" data associated with a "Gender" 
filter in a Tableau workbook defined as viz, then printing the data to the 
browser console:

```javascript
var sheet = viz.getWorkbook().getActiveSheet();
 
getDataAsync(sheet, "Gender", "Male").then(function (data) {
  console.log(data);
});
```

Next is an example retrieving "Male" and "Female" values from the "Gender"
filter, but this time as a cleaned array, then printing the length of that 
array to the browser console:

```javascript
 var sheet = viz.getWorkbook().getActiveSheet();
 var options = {
   "clean": true,
   "flatten": true,
 };
 
 getDataAsync(sheet, "Gender", ["Male", "Female"], options).then(function (data) {
   console.log(data.length);
 });
```

Next is an example using the native Tableau JavaScript API to first filter 
the workbook on "Male" and "Female" values, but only retrieve the raw JSON output 
from Tableau for the "Male" data points in the workbook:

```javascript
 var sheet = viz.getWorkbook().getActiveSheet();
 var options = {
   "raw": true,
   "filter": false,
 };
 
 sheet.applyFilterAsync("Gender", ["Male", "Female"], "REPLACE")
 .then(function () {
 	 return getDataAsync(sheet, "Gender", "Male", options)
 	 .then(function (data) {
	   console.log(data.length);
	 });
 });
```

Last is an example attempting to retrieve JSON for a filter value that does not exist, 
and showing an alert to the end-user to display the error message returned by
getDataAsync() function:

```javascript
 var sheet = viz.getWorkbook().getActiveSheet();
 
getDataAsync(sheet, "Gender", "ale")
.then(function (data) {
  console.log(data.length);
})
.catch(function (err) {
  alert(err);
});
```


See the examples folder for more examples. (Coming soon.)
