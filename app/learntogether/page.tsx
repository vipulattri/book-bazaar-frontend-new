'use client';
import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

type Message = {
  sender: string;
  text: string;
};

export default function LearnTogether() {
  const [fullName, setFullName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState('Enter your name to join');
  const [error, setError] = useState('');
  const [peerName, setPeerName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const STUN_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ];

  // Initialize peer connection with media tracks
  const createPeerConnection = () => {
    try {
      console.log('Creating new peer connection');
      const pc = new RTCPeerConnection({ iceServers: STUN_SERVERS });

      pc.onicecandidate = (e) => {
        if (e.candidate && socketRef.current) {
          console.log('Sending ICE candidate');
          socketRef.current.emit('ice-candidate', {
            candidate: e.candidate,
            to: peerName
          });
        }
      };

      pc.ontrack = (e) => {
        console.log('Received remote track:', e.streams);
        if (e.streams && e.streams[0]) {
          setRemoteStream(e.streams[0]);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
          setStatus('Video call connected!');
          setIsConnected(true);
        }
      };

      pc.onconnectionstatechange = () => {
        console.log('Connection state changed:', pc.connectionState);
        setStatus(`Connection: ${pc.connectionState}`);
        
        if (pc.connectionState === 'connected') {
          setIsConnected(true);
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          handleDisconnection();
        }
      };

      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'failed') {
          console.log('ICE failed, restarting...');
          pc.restartIce();
        }
      };

      // Add local tracks if available
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          console.log('Adding local track:', track.kind);
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      return pc;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      setError('Failed to create peer connection');
      return null;
    }
  };

  const handleDisconnection = () => {
    console.log('Handling disconnection');
    setIsConnected(false);
    setRemoteStream(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setStatus('Peer disconnected. Looking for new connection...');
    
    if (socketRef.current) {
      socketRef.current.emit('find-peer');
    }
  };

  // Start local media (camera and microphone)
  const startLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      console.log('Got local media stream');
      setLocalStream(stream);
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Could not access camera/microphone. Please check permissions.');
      throw err;
    }
  };

  // Setup all socket event handlers
  const setupSocketHandlers = () => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');
      setStatus('Connected to server. Looking for peers...');
      socket.emit('register', { name: fullName });
    });

    socket.on('waiting-for-peer', () => {
      console.log('Waiting for peer');
      setStatus('Waiting for another person to join...');
    });

    socket.on('peer-joined', ({ peerId, peerName }) => {
      console.log('Peer joined:', peerName);
      setPeerName(peerName);
      setStatus(`Found peer: ${peerName}. Establishing connection...`);
      
      // Create peer connection and initiate offer
      pcRef.current = createPeerConnection();
      if (pcRef.current) {
        createAndSendOffer();
      }
    });

    socket.on('peer-ready', ({ peerId, peerName }) => {
      console.log('Peer is ready:', peerName);
      setPeerName(peerName);
      setStatus(`Peer ${peerName} is ready. Waiting for offer...`);
      
      // Just create peer connection, will handle offer when received
      pcRef.current = createPeerConnection();
    });

    socket.on('offer-received', async ({ offer, from }) => {
      console.log('Received offer from:', from);
      setStatus('Processing connection request...');
      
      if (!pcRef.current) {
        pcRef.current = createPeerConnection();
      }

      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(offer));
        
        console.log('Creating answer');
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        
        console.log('Sending answer');
        socket.emit('answer', { answer, to: from });
        setStatus('Connection request accepted. Finalizing...');
      } catch (err) {
        console.error('Error handling offer:', err);
        setError('Failed to establish connection');
      }
    });

    socket.on('answer-received', async ({ answer }) => {
      console.log('Received answer');
      setStatus('Finalizing connection...');
      
      try {
        if (pcRef.current && pcRef.current.signalingState === 'have-local-offer') {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('Error handling answer:', err);
        setError('Failed to complete connection');
      }
    });

    socket.on('ice-candidate-received', async ({ candidate }) => {
      console.log('Received ICE candidate');
      
      try {
        if (pcRef.current && candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });

    socket.on('peer-disconnected', () => {
      console.log('Peer disconnected');
      handleDisconnection();
    });

    socket.on('chat-message', (message: Message) => {
      console.log('Received chat message');
      setMessages(prev => [...prev, message]);
    });

    socket.on('error', (errorMsg: string) => {
      console.error('Socket error:', errorMsg);
      setError(errorMsg);
    });
  };

  // Create and send offer to peer
  const createAndSendOffer = async () => {
    if (!pcRef.current || !socketRef.current) {
      console.error('No peer connection or socket');
      return;
    }

    try {
      console.log('Creating offer');
      const offer = await pcRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await pcRef.current.setLocalDescription(offer);
      
      console.log('Sending offer to:', peerName);
      socketRef.current.emit('offer', { 
        offer,
        to: peerName 
      });
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create connection offer');
    }
  };

  // Join the video chat
  const joinChat = async () => {
    if (!fullName.trim()) {
      setError('Please enter your name');
      return;
    }

    setError('');
    setStatus('Getting camera and microphone access...');

    try {
      await startLocalMedia();
      setStatus('Connecting to server...');

      // Connect to Socket.IO server
      socketRef.current = io(' https://book-bazaar-backend-new.onrender.com', {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
      });

      setupSocketHandlers();
      setIsJoined(true);

    } catch (err) {
      console.error('Join error:', err);
      setError('Failed to join chat. Please check your camera/microphone permissions.');
    }
  };

  // Send chat message
  const sendMessage = () => {
    if (!messageInput.trim() || !socketRef.current) return;
    
    const message = { 
      sender: fullName, 
      text: messageInput 
    };
    
    setMessages(prev => [...prev, message]);
    socketRef.current.emit('chat-message', message);
    setMessageInput('');
  };

  // Leave the chat
  const leaveChat = () => {
    console.log('Leaving chat');
    
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    
    setRemoteStream(null);
    setIsJoined(false);
    setIsConnected(false);
    setPeerName('');
    setMessages([]);
    setStatus('Enter your name to join');
    setShowChat(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveChat();
    };
  }, []);

  // Render UI
  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Join Video Chat</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              onKeyDown={(e) => e.key === 'Enter' && joinChat()}
            />
          </div>
          
          <button
            onClick={joinChat}
            disabled={!fullName.trim()}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Join Video Chat
          </button>
          
          <div className="mt-4 text-center text-gray-600 text-sm">
            {status}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Main Video Area */}
      <div className="relative w-full h-screen">
        {/* Remote Video (Main Screen) */}
        <div className="absolute inset-0">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-800"
          />
          {!remoteStream && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">
                  {peerName ? `Connecting to ${peerName}...` : 'Waiting for someone to join...'}
                </h2>
                <p className="text-gray-300">{status}</p>
              </div>
            </div>
          )}
          
          {/* Peer Name Overlay */}
          {remoteStream && peerName && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-2 rounded-lg">
              {peerName}
            </div>
          )}
        </div>

        {/* Local Video (Small Overlay - Bottom Right) */}
        <div className="absolute bottom-4 right-4 w-80 h-48 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
            You ({fullName})
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4">
          <div className="flex justify-between items-center text-white">
            <div>
              <h1 className="text-xl font-semibold">Video Chat</h1>
              {isConnected && peerName && (
                <p className="text-sm text-gray-300">Connected with {peerName}</p>
              )}
            </div>
            <button
              onClick={leaveChat}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Leave Call
            </button>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-3 rounded-full transition-colors ${
                showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
              } text-white`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-20 left-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg z-40 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className="break-words">
                    <div className={`p-3 rounded-lg max-w-xs ${
                      msg.sender === fullName 
                        ? 'bg-blue-600 text-white ml-auto' 
                        : 'bg-white text-gray-800 border'
                    }`}>
                      <div className="text-xs opacity-70 mb-1">{msg.sender}</div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center h-full flex items-center justify-center">
                {isConnected ? 'Start a conversation!' : 'Messages will appear here'}
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim() || !isConnected}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}