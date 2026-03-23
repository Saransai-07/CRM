import { useAuth } from "@/src/context/AuthContext";
import { getToken } from "@/src/lib/secureStorage";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";

export const startCall = async (scsNumber: string, studentContactId: number, BASE_URL: string, accessToken: string) => {
  try {
    const res = await fetch(`${BASE_URL}/call/wizklub_calling/?scsnumber=${scsNumber}&student_contact_id=${studentContactId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },

    });

    const data = await res.json();

    if (data.status !== "success") {
      throw new Error("Call initiation failed");
    }
    return data.correlationId;

  } catch (error) {

    throw error;
  }
};



export const pollCallStatus = async (
  correlationId: string,
  BASE_URL: string,
  accessToken: string,
  onUpdate: (status: boolean) => void,
  signal: { cancelled: boolean }
) => {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (!signal.cancelled) {
    try {
      const data = await fetch(
        `${BASE_URL}/call/is_call_end/?correlation_id=${correlationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
      ).then((res) => res.json());

      onUpdate(data.is_call_end);

      if (data.is_call_end) {
        return true; // stop polling
      }

      await delay(1000);
    } catch (err) {
      console.log("In calling Polling error:", err);
      await delay(1000); // retry
    }
  }

  return false;
};


const useCall = () => {
  const { logout, BASE_URL } = useAuth();
  const [accessToken, setAccessToken] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const cancelRef = useRef({ cancelled: false });

  // const options = useMemo(() => ({
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${accessToken}`,
  //   },
  // }),
  //   [accessToken]
  // );


  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken("ACCESS_TOKEN");
      const agentNumber = await getToken('USER_PROFILE_DATA');
      if (!token) {
        await logout();
        router.replace("/(auth)/Login");
        return;
      }
      if (!agentNumber) {
        return;
      }
      setAccessToken(token);
    };
    loadToken();
  }, []);

  const initiateCall = async (scsNumber: string, studentContactId: number) => {
    if (!accessToken) {
      console.warn("Token or phone number not ready");
      return;
    }

    try {
      setLoading(true);
      setCallEnded(false);

      cancelRef.current.cancelled = false;

      const correlationId = await startCall(scsNumber, studentContactId, BASE_URL, accessToken);

      await pollCallStatus(
        correlationId,
        BASE_URL,
        accessToken,
        (status) => {
          setCallEnded(status);
        },
        cancelRef.current
      );
    } catch (error) {
      console.error("Call error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelCall = () => {
    cancelRef.current.cancelled = true;
    setLoading(false);
  };

  return {
    initiateCall,
    cancelCall,
    loading,
    callEnded,
  };
};

export default useCall

