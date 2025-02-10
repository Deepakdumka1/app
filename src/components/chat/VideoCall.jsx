import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon
} from '@mui/icons-material';
import Peer from 'simple-peer';

const VideoCall = ({ open, onClose, peer, socket }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const connectionRef = useRef();

  useEffect(() => {
    if (open && socket) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          localVideoRef.current.srcObject = currentStream;
        })
        .catch((err) => console.error('Error accessing media devices:', err));

      socket.on("call_user", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
      });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socket) {
        socket.off("call_user");
      }
    };
  }, [open, socket]);

  const handleMuteToggle = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoToggle = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleEndCall = () => {
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setCallAccepted(false);
    setReceivingCall(false);
    onClose();
  };

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("start_call", {
        roomId: id,
        signalData: data,
      });
    });

    peer.on("stream", (stream) => {
      remoteVideoRef.current.srcObject = stream;
    });

    socket.on("call_accepted", (signal) => {
      peer.signal(signal);
      setCallAccepted(true);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    });

    peer.on("signal", (data) => {
      socket.emit("accept_call", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      remoteVideoRef.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  return (
    <Dialog open={open} onClose={handleEndCall} maxWidth="md" fullWidth>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, height: '400px' }}>
          <Box sx={{ flex: 1, position: 'relative' }}>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transform: 'scaleX(-1)' // Mirror effect for self-view
              }}
            />
            <Typography
              sx={{ 
                position: 'absolute', 
                bottom: 8, 
                left: 8, 
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.5)',
                padding: '2px 8px',
                borderRadius: 1
              }}
            >
              You {isMuted && '(Muted)'}
            </Typography>
          </Box>
          {callAccepted && (
            <Box sx={{ flex: 1, position: 'relative' }}>
              <video
                ref={remoteVideoRef}
                autoPlay
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <Typography
                sx={{ 
                  position: 'absolute', 
                  bottom: 8, 
                  left: 8, 
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.5)',
                  padding: '2px 8px',
                  borderRadius: 1
                }}
              >
                {peer?.name || 'Peer'}
              </Typography>
            </Box>
          )}
        </Box>
        {receivingCall && !callAccepted && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="h6">
              {caller} is calling...
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={answerCall}
              sx={{ mt: 1 }}
            >
              Answer Call
            </Button>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <IconButton
            onClick={handleMuteToggle}
            color={isMuted ? 'error' : 'primary'}
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <IconButton
            onClick={handleVideoToggle}
            color={isVideoOff ? 'error' : 'primary'}
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
          <IconButton onClick={handleEndCall} color="error">
            <CallEndIcon />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall; 