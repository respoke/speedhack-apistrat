var appid = ""; // <-- your app ID here
var username = "";
var groupId = "";
var friendId = "";
var group = null;
var call = null;
var client;

/**
 * Respoke app
 */

function myRespokeApp() {

    /**
     * Welcome to the speed hack challenge
     * Your mission:
     * 1. Add your appid above
     * 2. Finsh the speedHack() function
     * 3. Send us a chat message with your codepen URL using http://respoke-messaging.herokuapp.com/
     * 4. Accept the video call and tell us what you want to use Respoke for
     * 
     * Notes:
     * - speedHack() is called when the "call" button is clicked
     * - Start a call with the endpoint specified by the friendID variable
     * - The onConnect() and onLocalVideo() helper callbacks are available to you to attach video to the UI
     * - Docs here may help: https://docs.respoke.io/js-library/respoke.Client.html#startCall
     * - Go! 
    **/

    // speedhackers do dis
    function speedHack() {

    // your speedhack code here
        client.startCall({
           endpointId: friendId,
           onConnect: onConnect,
           onLocalMedia: onLocalVideo
        });

    }

    // create Respoke client object
    client = respoke.createClient({
        appId: appid,
        developmentMode: true
    });

    // connect to Respoke on connect button click
    $("#controls").on("click", "#connectButton", function() {
        username = $('#username').val();
        ui.showConnectingStatus();

        client.connect({
            endpointId: username,
            onError: onError
        });

    });

    // listen for the 'connect' event 
    client.listen('connect', function(evt) {
        console.log('connect evt:', evt);
        ui.showConnectedState();
    });

    // join group on join button click
    $("#controls").on("click", "#joinButton", function() {
        console.log('you clicked the join button');
        ui.showConnectingStatus();
        groupId = $('#groupId').val();

        console.log('joining a group now...');
        client.join({
            id: groupId,
            onSuccess: onClientJoinSuccess,
            onError: onError,
            onJoin: onJoin,
            onLeave: onLeave
        });
    });

    // client.join helper functions [onClientJoinSuccess, onError, onJoin, onLeave]
    function onClientJoinSuccess(newGroup) {
        console.log('join success evt:', newGroup);
        console.log(username, 'joined', newGroup.id);
        group = newGroup; // store group object globally

        // populate contacts drop-down
        group.getMembers({
            onSuccess: function(members) {
                members.forEach(function(member) {
                    if (member.endpointId !== username) {
                        ui.addMenu(member.endpointId);
                    }
                });
            }
        });
        ui.showJoinedState();
    }

    function onError(e) {
        console.log('error', e);
    }

    function onJoin(evt) {
        console.log('onJoin evt:', evt);
        if (!group) {
            group = evt.target; // store group object globally if not already there
        }
        var endpointId = evt.connection.endpointId;
        console.log(endpointId, 'joined', group.id);
        ui.showJoinAlert(endpointId);
    }

    function onLeave(evt) {
        console.log('onLeave evt:', evt);
        var endpointId = evt.connection.endpointId;
        console.log(endpointId, 'left', group.id);
        ui.showLeaveAlert(endpointId);
    }

    // call friendID when call button is clicked
    $("#controls").on("click", "#callButton", function() {
        friendId = $('#friendList').val();
        console.log('calling', friendId);
        
        // function call for APIstrat challenge
        speedHack();

    });

    // listen for the 'call' event
    client.listen('call', function(evt) {
        call = evt.call; // strore call object globally
        evt.call.answer({
            onConnect: onConnect,
            onLocalMedia: onLocalVideo
        });
        // listen for the 'hangup' event for this call
        evt.call.listen('hangup', hangup);
    });

    // startCall / answer helper fucntions [onConnect, onLocalVideo]
    function onConnect(evt) {
        ui.setVideo('remoteVideoSource', evt.element);
    }

    function onLocalVideo(evt) {
        ui.setVideo('localVideoSource', evt.element);
    }

    // hangup call on hangup button click
    $("#controls").on("click", "#hangupButton", hangup);

    function hangup(evt) {
        console.log('hangup evt:', evt);
        call.hangup();
        call = null;
        ui.resetVideo();
    }
}

/**
 * All UI changes are handled here.
 */
var ui = {

    init: function() {
        $('#status')
            .html("Not connected")
            .addClass("red");
        var controlsHTML = [
            '<input placeholder="username" id="username" type="text" autofocus />',
            '<button id="connectButton">Connect</button>',
            '<div id="alert">Enter your name for endpoint ID</div>'
        ];
        $("#controls")
            .empty()
            .html(controlsHTML.join(''));
        $("#alert")
            .addClass("green")
            .fadeIn(2000);
    },

    showConnectingStatus: function() {
        $("#status")
            .html("Connecting...")
            .addClass("yellow");
    },

    showConnectedState: function() {
        var statusHTML = [
            "Connected to Respoke as ",
            "<strong>" + username + "</strong>"
        ];
        var connectedHTML = [
            '<input placeholder="Team Name" id="groupId" type="text" autofocus />',
            '<button id="joinButton" class="joinButton">Join</button>',
            '<div id="alert">Enter your team name for group ID</div>'
        ];

        $("#status")
            .empty()
            .html(statusHTML.join(''))
            .addClass("green");
        $("#controls")
            .empty()
            .html(connectedHTML.join(''));
        $("#groupId").get(0).focus();
        $("#alert")
            .addClass("green")
            .fadeIn(2000);
    },

    showJoinedState: function() {
        var statusHTML = [
            "Connected to Respoke as ",
            "<strong>" + username + "</strong>",
            " in ",
            "<strong>" + groupId + "</strong>",
            " group"
        ];
        var controlsHTML = [
            '<select id="friendList">',
            '  <option value="" disabled="disabled" selected="selected">Select a name to call</option>',
            '</select>',
            '<button id="callButton">Call</button>',
            '<button id="hangupButton">Hang Up</button>',
            '<span id="alert">stuff here</span>'
        ];
        $("#status")
            .empty()
            .html(statusHTML.join(''))
            .addClass("green");
        $("#controls")
            .empty()
            .html(controlsHTML.join(''));
    },

    showJoinAlert: function(endpointId) {
        $("#alert")
            .text(endpointId + " joined " + groupId)
            .removeClass("red")
            .addClass("green")
            .fadeIn(2000)
            .fadeOut(2000);
        $('#friendList').append(
            $('<option>', {
                value: endpointId,
                text: endpointId,
                id: endpointId
            })
        );
    },

    addMenu: function(endpointId) {
        $('#friendList').each(function(i) {
            if (i !== endpointId) {
                $('#friendList').append(
                    $('<option>', {
                        value: endpointId,
                        text: endpointId,
                        id: endpointId
                    })
                );
            }
        });
    },

    showLeaveAlert: function(endpointId) {
        $("#alert")
            .text(endpointId + " left " + groupId)
            .removeClass("green")
            .addClass("red")
            .fadeIn(2000)
            .fadeOut(2000);
        $('#' + endpointId).remove();
    },

    setVideo: function(elementId, videoElement) {
        $("#" + elementId)
            .html(videoElement)
            .children('video')
            .addClass(elementId);
    },

    resetVideo: function() {
        $("#remoteVideoSource").empty();
        $("#localVideoSource").empty();
    }

};


// Initialize

ui.init();
myRespokeApp();
