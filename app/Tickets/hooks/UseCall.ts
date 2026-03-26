import { useEffect, useRef, useState } from "react";
import { getToken } from "@/src/lib/secureStorage";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
import { Alert } from "react-native";
import startCall, { pollCallStatus } from "../../../src/services/CallServices";

type CallState = "idle" | "calling" | "ended" | "error" | "call";

const useCall = () => {
  const { BASE_URL, logout } = useAuth();

  const [token, setToken] = useState<string>("");
  const [state, setState] = useState<CallState>("idle");

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const t = await getToken("ACCESS_TOKEN");

        if (!t) {
          await logout();
          router.replace("/(auth)/Login");
          return;
        }

        

        setToken(t);
      } catch (err) {
        console.error("Init Error:", err);
        Alert.alert("Error", "User data missing. Please login again.");
      }
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
    if (!token ) {
      Alert.alert("Error", "Agent phone number not available");
      return;
    }

    try {
      setState("calling");

      const controller = new AbortController();
      controllerRef.current = controller;

      const correlationId = await startCall(
        scsNumber,
        studentContactId ?? null,
        BASE_URL,
        token,
      );

      await pollCallStatus(
        correlationId,
        BASE_URL,
        token,
        (ended) => {
          if (ended) setState("call");
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