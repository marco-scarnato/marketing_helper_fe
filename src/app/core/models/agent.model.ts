export interface AgentInvokeRequest {
  client_id: string;
  objective: string;
  context?: Record<string, string>;
}

export interface AgentInvokeResponse {
  client_id: string;
  objective: string;
  output: string;
  steps: string[];
  model: string;
}
