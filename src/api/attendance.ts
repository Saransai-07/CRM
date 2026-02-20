import { getToken } from "@/src/lib/secureStorage";
import { useAuth } from "../context/AuthContext";



export interface AttendanceResponse {
  date: string;
  total_agents: number;
  no_of_present_agents: number;
  no_of_absent_agents: number;
  message: string;
  is_admin: boolean;
}

export const fetchAttendance = async (): Promise<AttendanceResponse> => {
  const token = await getToken("ACCESS_TOKEN");
  const { BASE_URL } = useAuth();

  const response = await fetch(`${BASE_URL}/attendance/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch attendance");
  }

  return data;
};
