/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var charts = [{
    name: ROLE_COUNT,
    schema: [{
        "metadata": {
            "names": ["Time", "Type", "Count"],
            "types": ["time", "ordinal", "linear"]
        },
        "data": []
    }],
    chartConfig: {
        type: "scatter",
        charts: [{
            type: "scatter",
            x: "Time",
            y: "Count",
            color: "Type",
            size: "Count"
        }],
        padding: {
            "top": 30,
            "left": 60,
            "bottom": 60,
            "right": 110
        },
        range: false
    },
    types: [{
        name: TYPE_TOTAL_PUB_SUB_CHANNEL_COUNT,
        type: 3
    }],
    processData: function(data) {
        var result = [];
        data.forEach(function(row, i) {
            var timestamp = row['timestamp'];
            var type = row['type'];
            var count = parseFloat(row["count"]);
            //add result to visualize
            result.push([timestamp, type, count]);
        });
        return result;
    }
}];