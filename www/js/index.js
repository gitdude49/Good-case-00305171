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
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
            // success callback
            function (dir) {
                dir.getFile("logo.png", {create:true}, function(file) {
                    var contentType = 'image/png',
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

                        writer.seek(writer.length);
                        writer.onwriteend = function() {
                            file.file(function (file) {
                                var reader = new FileReader();
                                 reader.onloadend = function (evt) {
                                    alert(evt.target.result)

                                    var img = document.createElement('IMG');
                                    img.setAttribute('src', evt.target.result);
                                    document.getElementById('binary-image').appendChild(img);
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
