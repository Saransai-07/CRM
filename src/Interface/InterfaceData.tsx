export interface AttendanceResponse {
  date: string;
  total_agents: number;
  no_of_present_agents: number;
  no_of_absent_agents: number;
  message: string;
  is_admin: boolean;
}


export interface MetricCardProps {
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

export interface CommomApiInterface {
  total_count: number;
  total_pages: number;
  current_page_number: number;
  next_page: string | null;
  previous_page: string | null;
  results: any[];
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

export interface AgentReportsInterface {
  branch_id: string;
  name: string;
  students_connected: number;
  no_of_interested: number;
  no_of_call_backs: number;
  no_of_not_interested: number;
  students_sales_count: number;
  cvr_count: number;
  cvr_percentage: number;
  cvr: string;
}

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

export interface AgentInputsInterface {
  id: number;
  username: string;
  no_of_branches: number;
  no_of_calls: number;
  no_of_call_connected: number;
  unique_lead_touch: number;
  unique_lead_touch_connected: number;
  less_than_30_secs: number;
  less_than_1_min: number;
  less_than_1_min_30_secs: number;
  greater_than_1_min_30_secs: number;
}

export interface BranchCVRInterface {
  branch_id: number;
  name: string;
  zone: number;
  zone_name: string;
  category: string;
  ist: string | null;
  YLP_student_count: number;
  unique_lead_connected: number;
  branch_renewal_sales: number;
  agent_renewal_sales: number;
  lead_touch_per: string;
  total_target: number;
  branch_new_sales: number;
  branch_total_sales: number;
  branch_new_sales_cvr_per: string;
  branch_current_sales_cvr_per: string;
  agent_new_sales: number;
  agent_total_sales: number;
  agent_new_sales_cvr_per: string
  agent_current_sales_cvr_per: string;
  expected_cvr_per: string;
  difference_in_cvr_per: string;
}

export interface AgentCallSummaryInterface {

  id: number;
  username: string;
  total_calls: number;
  total_duration: string
  total_answered_calls_by_agent: number;
  total_answered_calls_by_parent:number;
  total_missed_calls_by_agent: number;
  total_missed_calls_by_parent: number;
  last_call_date: number| string | null;
  unique_lead_touch: number;  

}
