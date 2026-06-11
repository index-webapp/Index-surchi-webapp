import React from 'react';

export interface InputField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder: string;
  options?: { label: string; value: string }[];
  defaultValue?: string;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  inputs: InputField[];
  buttonText: string;
  statusText: string;
  accentColor: 'green' | 'purple' | 'cyan';
}

export interface Citation {
  title: string;
  url: string;
}

export interface AnalysisResult {
  id: string;
  moduleId: string;
  moduleName: string;
  timestamp: string;
  payload: Record<string, string>;
  content: string;
  citations?: Citation[];
  source: string;
  isSimulated?: boolean;
  isQuotaExceeded?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  history: ChatMessage[];
}

