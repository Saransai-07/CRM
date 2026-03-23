import { useEffect, useRef, useState } from "react";
import { getToken } from "@/src/lib/secureStorage";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
// import { startCall, pollCallStatus } from "@/src/services/callService";
import { Alert } from "react-native";
import startCall, { pollCallStatus } from "../services/CallServices";

type CallState = "idle" | "calling" | "ended" | "error";

const useCall = () => {
  const { BASE_URL, logout } = useAuth();

  const [token, setToken] = useState<string>("");
  const [state, setState] = useState<CallState>("idle");

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const init = async () => {
      const t = await getToken("ACCESS_TOKEN");
      if (!t) {
        await logout();
        router.replace("/(auth)/Login");
        return;
      }
      setToken(t);
    };

    init();

    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const initiateCall = async (
    scsNumber: string,
    studentContactId?: number
  ) => {
    if (!token) return;

    try {
      setState("calling");

      const controller = new AbortController();
      controllerRef.current = controller;

      const correlationId = await startCall(
        scsNumber,
        studentContactId ?? null,
        BASE_URL,
        token
      );

      await pollCallStatus(
        correlationId,
        BASE_URL,
        token,
        (ended) => {
          if (ended) setState("ended");
        },
        controller
      );
    } catch (err) {
      console.error(err);
      setState("error");
      Alert.alert("Call Failed", "Please try again");
    }
  };

  const cancelCall = () => {
    controllerRef.current?.abort();
    setState("idle");
  };

  return {
    initiateCall,
    cancelCall,
    state,
  };
};

export default useCall;