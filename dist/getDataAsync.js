/* 

Copyright 2016 Kurt Fredericks
getDataAsync JavaScript library for retrieving data in JSON from Tableau Server

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in
compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

*/

function getDataAsync(sheet, fieldname, value, options) {
    var helpers = {
        cleanData: function (pair) {
            pair.forEach(function (p) {
                var cleanName = p.fieldName.replace(/^.*\(|\)/g, '');
                p.fieldName = cleanName;
            });
            return pair;
        },
        flattenData: function (d) {
            var obj = {};
            d.forEach(function (pair) {
                var name = pair.fieldName;
                if (helpers.settings().clean) { name = pair.fieldName.replace(/^.*\(|\)/g, ''); }
                obj[name] = pair.formattedValue;
            });
            return obj;
        },
        adjData: function (d) {
            var array = [];
            d.forEach(function (mark) {
                var pairs = mark.getPairs();
                if (helpers.settings().flatten) {
                    var obj = helpers.flattenData(pairs);
                } else if (helpers.settings().clean) {
                    var obj = helpers.cleanData(pairs);
                } else {
                    var obj = pairs;
                }
                array.push(obj);
            });
            return array;
        },
        e: function (err) {
            return '(' + String(err).replace('Error: ','') + ')';
        },
        defaults: {
            "clean": false,
            "flatten": false,
            "raw": false,
            "filter": true
        },
        settings: function () {
            var obj = helpers.defaults;
            if (!options) {
                return obj;
            } else {
                for (op in options) {
                    obj[op] = options[op]; 
                }
                return obj;
            }
        }
    };

    return new Promise(function(resolve, reject) {
        var settings = helpers.settings();
        if (settings.filter) {
            var getData = function () {
                return sheet.applyFilterAsync(fieldname, value, "REPLACE")
                .then(function () {
                    return sheet.selectMarksAsync(fieldname, value, "REPLACE")
                }, function (e) {
                    reject('Error: Filtering ' + helpers.e(e));
                })
            }
        } else {
            var getData = function () {
                return sheet.selectMarksAsync(fieldname, value, "REPLACE")
            }
        }
        getData()
        .then(function () {
            return sheet.getSelectedMarksAsync()
        }, function (e) {
            reject('Error: Selecting Marks ' + helpers.e(e));
        })
        .then(function (marks) {
            if (marks.length < 1) { reject('Error: No Data Available'); }
            if (settings.raw) {
                var data = marks;
            } else {
                var data = helpers.adjData(marks);
            }
            resolve(data);
        }, function (e) {
            reject('Error: Retrieving Marks ' + helpers.e(e));
        });
    });
}