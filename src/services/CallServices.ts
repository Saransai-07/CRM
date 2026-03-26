import { Alert } from "react-native";
import { getToken } from "../lib/secureStorage";
import { useState } from "react";


const startCall = async (
  scsNumber: string,
  studentContactId: number | null,
  BASE_URL: string,
  accessToken: string,
) => {
  try {
    //  Step 1: Get profile FIRST
    const profile = await getToken("USER_PROFILE_DATA");

    if (!profile) {
      Alert.alert("Error", "User profile not found");
      return null;
    }

    const parsed = JSON.parse(profile);

    //  Stop here if phone missing → NO API CALL
    if (!parsed?.phone_number) {
      Alert.alert("Error", "Agent phone number missing");
      return null;
    }

    //  Step 2: Build URL ONLY after validation
    const url = studentContactId
      ? `${BASE_URL}/call/wizklub_calling/?scsnumber=${scsNumber}&student_contact_id=${studentContactId}`
      : `${BASE_URL}/call/wizklub_calling/?scsnumber=${scsNumber}`;

    //  Step 3: Call API
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      Alert.alert("Error", `Request failed (${res.status})`);
      return null;
    }

    const data = await res.json();

    if (data.status !== "success" || !data.correlationId) {
      Alert.alert("Error", "Invalid response from server");
      return null;
    }

    return data.correlationId;

  } catch (err) {
    console.error("Start Call Error:", err);
    Alert.alert("Error", "Something went wrong");
    return null;
  }
};

export default startCall;

export const pollCallStatus = async (
  correlationId: string,
  BASE_URL: string,
  accessToken: string,
  onUpdate: (status: boolean) => void,
  controller: AbortController
) => {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  while (!controller.signal.aborted) {
    try {
      const res = await fetch(
        `${BASE_URL}/call/is_call_end/?correlation_id=${correlationId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        }
      );

      const data = await res.json();

      onUpdate(data.is_call_end);

      if (data.is_call_end) return;

      await delay(1000);
    } catch (err: any) {
      if (err.name === "AbortError") break;
      await delay(1000);
    }
  }
};

