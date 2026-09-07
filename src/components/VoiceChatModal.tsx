import React from 'react';
import { VoiceModeOverlay } from './VoiceModeOverlay';

interface VoiceChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpokenQuery?: (query: string) => void;
  onSwitchToText?: (query?: string) => void;
}

export const VoiceChatModal: React.FC<VoiceChatModalProps> = (props) => {
  return <VoiceModeOverlay {...props} />;
};

export { VoiceModeOverlay };
