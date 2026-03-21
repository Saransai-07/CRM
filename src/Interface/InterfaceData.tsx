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

export interface UserProfileResponse {
    message: string;
    data: UserProfileData;
}

export interface UserProfileData {
    user_profile_id: number;
    user_id: number;
    photo: string ;
    bio: string;
    phone_number: string;
    username: string;
    is_idealtime : boolean;
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
  total_answered_calls_by_parent: number;
  total_missed_calls_by_agent: number;
  total_missed_calls_by_parent: number;
  last_call_date: number | string | null;
  unique_lead_touch: number;
}

export interface AgentWiseCallLogInterface {
  student: number;
  student_name: string;
  student_scs: string;
  agent_name: string;
  call_start_time_: string;
  call_end_time_: string;
  branch_name: string;
  call_duration_hms: string;
  conversation_duration_hms: string;
  caller_status: string;
  destination_status: string;
  call_status: string;
  aws_call_recording_file: any | null,
  zone_name: string;
  state_name: string;
}

export interface SalesReportInterface {
  wizklub_ticket_sales_id: number;
  name: string;
  SCS_Number: string;
  branch_name: string;
  student_class_name: string;
  student_id: string;
  saledate: string;
  state_name: string;
  zone_name: string;
  orientation_name: string;
  previous_orientation_name: string;
  is_last_year_paid: boolean;
  admission_status: string;
  final_agent: string | null;
  on_call: string;
  student_tag_names: string;
  sale_date: string;
  created_at: string;
  is_active: boolean;
  is_sale_by_call: boolean;
  is_sale_by_on_call: boolean;
  is_trainer_sale: boolean;
  is_ticket_sale: boolean;
  sale_amount: number;

  student: number;
  state: number;
  zone: number;
  branch: number;
  orientation: number;
  student_class: number;
  wizklub_ticket: number | null;
  academic_year: number;

  agent: number | null;
  last_call_by_agent: number | null;
  on_call_agent: number | null;
  sale_by_trainer: number | null;
  last_ticket_updated_user: number | null;
}

export interface Studentlist {
  student_id: number;
  SCS_Number: string;
  name: string;
  branch: number;
  student_class: number;
  admission_status: number;
  orientation: number;
  orientation_name: string;
  wizklub_agent_name: string | null;
  branch_name: string;
  student_class_name: string;
  wizklub_agent: number | null;
  admission_status_name: string;
  previous_orientation: number;
  previous_orientation_name: string;
  student_tags: any[];
  student_tag_names: string;
}


export interface FollowUpInterface {
  ticket_id: number;
  name: string;
  SCS_Number: string;
  branch_name: string;
  student_class_name: string;
  student_id: string;
  callbacktime: string;
  call_back_time: string;
  category_name: string;
  sub_category_name: string;
  is_last_year_paid: boolean;
  orientation_name: string;
  previous_orientation_name: string;
  agent_name: string;
  student_tag_names: string;
  ticket_number: string;
  description: string | null;
  remarks: string | null;
  resolve_notes: string | null;
  is_active: boolean;
  rating: number | null;
  created_at: string;
  updated_at: string;
  is_sale: boolean;
  is_ticket_by_trainer: boolean;
  student: number;
  disposition: number | null;
  category: number;
  subcategory: number;
  priority: number;
  ticket_status: number | null;
  academic_year: number;
  created_by: number;
  updated_by: number;
  ticket_closed_by: number | null;
}


export interface DailedInterface {
  ticket_id: number;
  name: string;
  SCS_Number: string;
  branch_name: string;
  student_class_name: string;
  student_id: string;
  callbacktime: string | null;
  call_back_time: string | null;
  category_name: string;
  sub_category_name: string;
  orientation_name: string;
  is_last_year_paid: boolean;
  wizklub_agent_name: string | null;
  student_tag_names: string;
  ticket_number: string;
  description: string;
  remarks: string;
  resolve_notes: string;
  is_active: boolean;
  rating: number | null;
  created_at: string;
  updated_at: string;
  is_sale: boolean;
  is_ticket_by_trainer: boolean;
  student: number;
  disposition: number | null;
  category: number;
  subcategory: number;
  priority: number;
  ticket_status: number | null;
  academic_year: number;
  created_by: number;
  updated_by: number;
  ticket_closed_by: number | null;
  agent_name: number;
}

export interface Sibling {
  SCS_Number: string;
  name: string;
  admission_status_name: string;
  state_name: string;
  zone_name: string;
  branch_name: string;
  orientation_name: string;
  section_name: string;
  student_class_name: string;
  is_wizklub_paid_last_year: boolean;
  is_wizklub_paid: boolean;
}

export interface Student {
  student_id: number;
  summercamp_agent: string | null;
  SCS_Number: string;
  name: string;
  is_active: boolean;
  gender_name: string;
  admission_status_name: string;
  state_name: string;
  zone_name: string;
  branch_name: string;
  orientation_name: string;
  student_class_name: string;
  enrolling_class_name: string;
  section_name: string;
  agent_name: string | null;
  academic_year_name: string;
  no_of_attempts: number;
  button: string;
  is_wizklub_branch: boolean;
  is_offline_branch: boolean;
  is_wizklub_paid_last_year: boolean;
  is_wizklub_paid: boolean;
  siblings: Sibling[];
}
 
export interface Guardian {
  id: number;
  student: number;
  relation_type: number;
  relation_type_name: string;
  name: string;
  phone_number: string;
}

export interface TicketInterface  {
  ticket_id: number;
  ticket_number: string;
  student: number;
  category: number;
  subcategory: number;
  priority: number;
  call_back_time: string;
  call_back_time_local: string;
  description: string | null;
  agent_name: number;
  academic_year_name: string;
  academic_year: number;
}


export interface TicketLogInterface {
  ticket_log_id: number;
  ticket_number: string;
  created_by_name: string;
  updated_by_name: string;
  created_at: string;
  updated_at: string;
  is_ticket_by_trainer: string; // Could be "Agent" or other values
  call_logs: any[]; // Array of call log objects, empty array if none
  remarks: string | null;
  is_active: boolean;
  heading: string;
  ticket: number;
  created_by: number;
  updated_by: number;
  correlations: any[]; // Array of correlation objects, empty array if none
  call_back_time: string;
  subcategory_name: string;
  category_name : string;
  priority_name : string;
  description : string
}