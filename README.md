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

getDataAsync(sheet, fieldname, value, options)

## Options

getDataAsync can be configured through an options object. Right now,
only a simple "clean" option can be set in the options object, but 
additional options will be added in the future.

```javascript
var options = {
  "clean": true
};
```

By default, the "clean" option is set to false. 

When set to true, the "clean" setting will strip aggregations, such as "SUM" 
and "MIN"from the field name titles in your worksheet, which Tableau includes
by default, and transform your JSON output into a single-dimensional array 
of objects. This may make it easier to work with your JSON output, but this 
option must be explicitly set to true if you would like to use it.  

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
   "clean": true
 };
 
 getDataAsync(sheet, "Gender", ["Male", "Female"], options).then(function (data) {
   console.log(data.length);
 });
```

See the examples folder for more examples. (Coming soon.)
