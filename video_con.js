const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const messageDisplay = document.getElementById('messageDisplay');
const messageInput = document.getElementById('messageInput');
const messageButton = document.getElementById('messageButton');

let localStream;
let remoteStream;
let peerConnection;

// Initialize the media devices and start the video stream
async function start() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

// Create and configure the peer connection
function createPeerConnection() {
  peerConnection = new RTCPeerConnection();

  // Add local stream to the peer connection
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle incoming remote stream
  peerConnection.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  // Handle ICE candidate exchange
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      // Send the ICE candidate to the remote peer
      // Example code for sending the candidate using WebSocket or HTTP request
      // Replace with your own implementation
      sendMessage({ type: 'candidate', candidate: event.candidate });
    }
  };
}

// Start the video call
function startCall() {
  createPeerConnection();

  // Create offer and set local description
  peerConnection.createOffer()
    .then((offer) => peerConnection.setLocalDescription(offer))
    .then(() => {
      // Send the offer to the remote peer
      // Example code for sending the offer using WebSocket or HTTP request
      // Replace with your own implementation
      sendMessage({ type: 'offer', offer: peerConnection.localDescription });
    })
    .catch((error) => console.error('Error'))
}
