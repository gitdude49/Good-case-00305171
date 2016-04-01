/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            // success callback
            function (dir) {
                dir.root.getFile("red_dot.jpeg", {create:true}, function(file) {
                    var contentType = 'image/jpeg',
                        b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

                    file.createWriter(function (writer) {
                        function b64toBlob(b64Data, contentType, sliceSize) {
                            contentType = contentType || '';
                            sliceSize = sliceSize || 512;

                            var byteCharacters = atob(b64Data);
                            var byteArrays = [];

                            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                var slice = byteCharacters.slice(offset, offset + sliceSize);

                                var byteNumbers = new Array(slice.length);
                                for (var i = 0; i < slice.length; i++) {
                                    byteNumbers[i] = slice.charCodeAt(i);
                                }

                                var byteArray = new Uint8Array(byteNumbers);

                                byteArrays.push(byteArray);
                            }

                            var blob = new Blob(byteArrays, {type: contentType});
                            return blob;
                        }
                        var blob = b64toBlob(b64Data, contentType);
                        writer.onwriteend = function() {
                            file.file(function (file) {
                                var reader = new FileReader();
                                 reader.onloadend = function (evt) {
                                    var img = document.createElement('IMG');
                                    img.setAttribute('src', evt.target.result);
                                    document.getElementById('binary-image').appendChild(img);

                                    //upload
                                    var fileTransfer = new FileTransfer(),
                                        options = new FileUploadOptions(),
                                        filePath = file.fullPath,
                                        fileOptions = file.fileOptions,
                                        //uploadUrl = "http://requestb.in/yg9wf6yg"; //"http://httpbin.org/post"; //Original bin from Good
                                        uploadUrl = "http://requestb.in/1me02xe1"; //Bin for BLAUD

                                    options.fileKey = "testFileKey";
                                    options.fileName = file.name;//"red_dot.png";
                                    options.mimeType = file.type;//"image/png";
                                    options.params = {
                                        param1 : "value1",
                                        param2 : "value2"
                                    };
                                    fileTransfer.upload(file.fullPath, uploadUrl, function (response) {
                                        alert('Response from server: ' + response.responseCode + ' ' + response.response);
                                        var p = document.createElement("P");
                                        p.innerHTML = 'File ' + file.fullPath + ' was successfully uploaded. Open link ' + uploadUrl + ' on your desktop browser to see more details.';
                                        document.getElementById('binary-image').appendChild(p);
                                    }, function (fail){
                                        alert("FAIL !")
                                    }, options, true);
                                 };
                                 reader.readAsDataURL(file);
                            });
                        }
                        writer.write(blob);
                    });
                });
            },
            // error callback
            function (error) {
                alert('ERROR: ' + JSON.stringify(error))
            }
        );
    }
};
