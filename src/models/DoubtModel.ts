export interface Message {
  role: string;
  content: string;
}

export interface DoubtRequest {
  main_conversation_history: Message[];
  conversation_history: Message[];
  current_message: string;
}

// Response body interface
export interface DoubtResponse {
  assistant_reply: string;
  assistant_visual_aid: string;
  doubt_resolved: boolean;
}

// Request body interface
export interface AskDoubtRequest {
  user_id: string;
  video_id: string;
  timestamp: number;
  query: string;
}

// Response body interface
export interface AskDoubtResponse {
  response: string;
  additional_resources?: {
    type: string;
    url: string;
  }[];
}
