/* 

Copyright 2016 Kurt Fredericks
getDataAsync JavaScript library for receiving data in JSON from Tableau Server
Version: 1.0 Date: 2/12/16 

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this work except in
compliance with the License. You may obtain a copy of the License in the LICENSE file, or at:

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is
distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

*/

function getDataAsync(sheet, fieldname, value, options) {
    var cleanData = function(marks) {
        var data = [];
        for (var markIndex = 0; markIndex < marks.length; markIndex++) {
            var pairs = marks[markIndex].getPairs();
            var obj = {};
            for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
                var pair = pairs[pairIndex];
                obj[pair.fieldName.replace("SUM(", "").replace("AGG(", "").replace("MAX(", "").replace("MIN(", "").replace("AVG(", "").replace("MINUTE(", "").replace(")", "")] = pair.formattedValue;
            }
            data.push(obj);
        }
        return data;
    };
    return new Promise(function(resolve, reject) {
        sheet.applyFilterAsync(fieldname, value, "REPLACE").then(function() {
            sheet.selectMarksAsync(fieldname, value, "REPLACE").then(function () {
                sheet.getSelectedMarksAsync().then(function (marks) {
                    if (options.clean) {
                        var values = cleanData(marks);
                    } else {
                        var values = marks;
                    }
                    resolve(values);
                });
            });
        });
    });
}
