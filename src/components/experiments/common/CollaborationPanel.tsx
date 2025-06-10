import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Share2, Video, Mic, MicOff, VideoOff } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: 'student' | 'instructor';
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface CollaborationPanelProps {
  experimentId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor';
  onMessage?: (message: string) => void;
  onVideoToggle?: (enabled: boolean) => void;
  onAudioToggle?: (enabled: boolean) => void;
  onScreenShare?: () => void;
}

export function CollaborationPanel({
  experimentId,
  userId,
  userName,
  userRole,
  onMessage,
  onVideoToggle,
  onAudioToggle,
  onScreenShare,
}: CollaborationPanelProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    // Subscribe to experiment room
    // Handle real-time updates
    return () => {
      // Cleanup WebSocket connection
    };
  }, [experimentId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      senderId: userId,
      senderName: userName,
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    onMessage?.(newMessage);
    setNewMessage('');
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    onVideoToggle?.(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    onAudioToggle?.(!isAudioEnabled);
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    onScreenShare?.();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Participants Section */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Participants
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {participants.length} online
          </span>
        </div>
        <div className="space-y-2">
          {participants.map((participant) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {participant.name[0].toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {participant.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {participant.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {participant.isVideoEnabled ? (
                  <Video className="w-4 h-4 text-green-500" />
                ) : (
                  <VideoOff className="w-4 h-4 text-gray-400" />
                )}
                {participant.isAudioEnabled ? (
                  <Mic className="w-4 h-4 text-green-500" />
                ) : (
                  <MicOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Chat
        </h3>
        <div className="h-64 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: message.senderId === userId ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex flex-col ${
                message.senderId === userId ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-xs rounded-lg p-3 ${
                  message.senderId === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {message.senderName} • {message.timestamp.toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border dark:border-gray-600 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="p-4">
        <div className="flex items-center justify-around">
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoEnabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            } text-white`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${
              isAudioEnabled ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            } text-white`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={handleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
            } text-white`}
          >
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
} 