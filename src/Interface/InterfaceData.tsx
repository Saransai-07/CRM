export interface AttendanceResponse {
  date: string;
  total_agents: number;
  no_of_present_agents: number;
  no_of_absent_agents: number;
  message: string;
  is_admin: boolean;
}

  
  export interface  MetricCardProps{
  id: number;
  heading: string;
  heading_value: string;
  sub_heading_1: string;
  sub_heading_1_value: string
  sub_heading_2: string;
  sub_heading_2_value: string;
  logo?: string;
}

export interface DataItem {
  label: string;
  sales: number;
  target: number;
}

export interface TopPerformer {
  agent_id: number;
  agent_name: string;
  sales_count: number;
  agent_profile: string;
}

export interface AgentReport {
  id: number;
  username: string;
  students_connected: number;
  no_of_interested: number;
  no_of_call_backs: number;
  no_of_branches: number;
  students_sales_count: number;
  no_of_not_interested: number;
  cvr: string;
}

// types/agent.ts

export interface Agent {
  id: number;
  username: string;
  students_connected: number;
  no_of_interested: number;
  no_of_call_backs: number;
  no_of_branches: number;
  students_sales_count: number;
  no_of_not_interested: number;
  cvr_count: number;
  cvr_percentage: number;
  cvr: string;
}

export interface AgentResponse {
  total_count: number;
  total_pages: number;
  current_page_number: number;
  next_page: string | null;
  previous_page: string | null;
  results: Agent[];
}
