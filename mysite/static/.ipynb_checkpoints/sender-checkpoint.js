const webSocket = new WebSocket("ws://127.0.0.1:3000")


var roomName = JSON.parse(document.getElementById('room-name').textContent);
console.log(roomName)
webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data) {
    switch (data.type) {
        case "answer":
            peerConn.setRemoteDescription(data.answer)
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

let username


let localStream
let peerConn
function startCall() {
    document.getElementById("video-call-div")
    .style.display = "inline"
    
    document.getElementById("vcvc")
    .style.display= "none"
    
    
        sendUsername();
        function sendUsername() {

            username = JSON.parse(document.getElementById('json-username').textContent);
            console.log(username)
            sendData({
                type: "store_user"
            })
        }

        function sendData(data) {
            data.username = username
            webSocket.send(JSON.stringify(data))
        }
    


    navigator.getUserMedia({
        video: {
            frameRate: 24,
            width: {
                min: 480, ideal: 720, max: 1280
            },
            aspectRatio: 1.33333
        },
        audio: true
    }, (stream) => {
        localStream = stream
        document.getElementById("local-video").srcObject = localStream

        let configuration = {
            iceServers: [
                {
                    "urls": ["stun:stun.l.google.com:19302", 
                    "stun:stun1.l.google.com:19302", 
                    "stun:stun2.l.google.com:19302"]
                }
            ]
        }

        peerConn = new RTCPeerConnection(configuration)
        peerConn.addStream(localStream)

        peerConn.onaddstream = (e) => {
            document.getElementById("remote-video")
            .srcObject = e.stream
        }

        peerConn.onicecandidate = ((e) => {
            if (e.candidate == null)
                return
            sendData({
                type: "store_candidate",
                candidate: e.candidate
            })
        })

        createAndSendOffer()
    }, (error) => {
        console.log(error)
    })
}

function createAndSendOffer() {
    
    function sendData(data) {
            data.username = username
            webSocket.send(JSON.stringify(data))
        }
    
    peerConn.createOffer((offer) => {
        sendData({
            type: "store_offer",
            offer: offer
        })

        peerConn.setLocalDescription(offer)
    }, (error) => {
        console.log(error)
    })
}

let isAudio = true
function muteAudio() {
    isAudio = !isAudio
    localStream.getAudioTracks()[0].enabled = isAudio
}

let isVideo = true
function muteVideo() {
    isVideo = !isVideo
    localStream.getVideoTracks()[0].enabled = isVideo
}

function endcall(){
    webSocket.close()
    document.querySelector('#declinevc').click();
}