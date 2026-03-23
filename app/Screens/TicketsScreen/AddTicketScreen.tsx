

import Dropdown, { Option } from "@/src/components/DropDown";
import { useAuth } from "@/src/context/AuthContext";
import { TicketInterface } from "@/src/Interface/InterfaceData";
import { getToken } from "@/src/lib/secureStorage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView } from "react-native-safe-area-context";

const AddTicketScreen = () => {
  const { id, scsnumber } = useLocalSearchParams();
  const { logout, BASE_URL } = useAuth();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [ticketData, setTicketData] = useState<TicketInterface | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);

  const [categoryData, setCategoryData] = useState<Option[]>([]);
  const [category, setCategory] = useState<number | null>(null);

  const [priorityData, setPriorityData] = useState<Option[]>([]);
  const [priority, setPriority] = useState<number | null>(null);

  const [subCategoryData, setSubCategoryData] = useState<Option[]>([]);
  const [subcategory, setSubcategory] = useState<number | null>(null);

  const [description, setDescription] = useState("");
  const [callBacktime, setCallBackTime] = useState("");
  const [showCallBackFielsd, setShowCallBackField] = useState(false);
  const [showPicker, setShowPicker] = useState(false)

  const [showPickerModal, setShowPickerModal] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const isEditMode = !!ticketData && Object.keys(ticketData).length > 0;

  const isValid = category && subcategory && priority;

  const options = useMemo(() => ({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }),
    [accessToken]
  );

  useEffect(() => {
    const loadToken = async () => {
      const token = await getToken("ACCESS_TOKEN");
      if (!token) {
        await logout();
        router.replace("/(auth)/Login");
        return;
      }
      setAccessToken(token);
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    fetchTicket();
    fetchCategory();
    fetchPriority();
  }, [accessToken]);

  useEffect(() => {
    if (!category) return;
    // setSubcategory(null); // reset
    fetchSubCategory();
  }, [category]);

  useEffect(() => {
    setShowCallBackField(category === 2 || category === 3);
  }, [category]);

  useEffect(() => {
    if (!ticketData) return;

    setTicketNumber(ticketData.ticket_number || null);
    setCategory(ticketData.category || null);
    setSubcategory(ticketData.subcategory || null);
    setPriority(ticketData.priority || null);
    setDescription(ticketData.description || "");
    setCallBackTime(ticketData.call_back_time || "");
  }, [ticketData]);


  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/wizklub/ticket_operations/${id}/`,
        options
      );
      if (!res.ok) {
        setTicketData(null);
        return;
      }
      const json = await res.json();
      setTicketData(json);
    } catch (error) {
      console.log("Ticket Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/wizklub/wizklub_categories_dropdown_based_on_student/?scs_number=${scsnumber}/`,
        options
      );

      if (!res.ok) {
        setCategoryData([]);
        return;
      }

      const json = await res.json();
      setCategoryData(
        json.map((item: any) => ({
          value: item.category_id,
          label: item.category_name,
        }))
      );
    } catch (error) {
      console.log("Category Error:", error);
    }
  };

  const fetchSubCategory = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/wizklub/subcategories_by_category/${category}/`,
        options
      );

      if (!res.ok) {
        setSubCategoryData([]);
        return;
      }

      const json = await res.json();
      setSubCategoryData(
        json.results.map((item: any) => ({
          value: item.subcategory_id,
          label: item.subcategory_name,
        }))
      );
    } catch (error) {
      console.log("SubCategory Error:", error);
    }
  };

  const fetchPriority = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/wizklub/wizklub_priorities_dropdown/`,
        options
      );
      if (!res.ok) {
        setPriorityData([]);
        return;
      }
      const json = await res.json();
      setPriorityData(
        json.map((item: any) => ({
          value: item.priority_id,
          label: item.priority_name,
        }))
      );
    } catch (error) {
      console.log("Priority Error:", error);
    }
  };

  const onSave = async () => {
    try {
      setLoading(true);

      if (!id) {
        throw new Error("ID is required for this API");
      }

      const payload = {
        ...(ticketNumber && { ticket_number: ticketNumber }),
        category,
        subcategory,
        priority,
        call_back_time: callBacktime || null,
        description,
      };

      // SAME URL ALWAYS
      const url = `${BASE_URL}/wizklub/ticket_operations/${id}/`;

      // ONLY method changes
      const method = ticketData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("API ERROR:", data);
        throw new Error("Failed to save ticket");
      }

      router.back()

    } catch (error) {
      console.log("Save Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 140 } // space for glass bar + keyboard
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='never'
        >
          <Text style={styles.title}>
            {isEditMode ? "Update Ticket" : "Create Ticket"}
          </Text>

          <View style={styles.card}>
            {/* Category */}
            <View style={styles.field}>
              <Dropdown
                label="Category"
                value={category}
                options={categoryData}
                onChange={setCategory}
              />
            </View>

            {/* Callback DateTime */}
            {showCallBackFielsd && (
              <View style={styles.field}>
                <Text style={styles.label}>Callback Time</Text>

                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => {
                    setTempDate(callBacktime ? new Date(callBacktime) : new Date());
                    setPickerMode("date");
                    setShowPickerModal(true);
                  }}
                >
                  <Text style={styles.inputText}>
                    {callBacktime
                      ? new Date(callBacktime).toLocaleString()
                      : "Select date & time"}
                  </Text>
                </TouchableOpacity>


                <Modal
                  visible={showPickerModal}
                  transparent
                  animationType="fade"
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>

                      <Text style={styles.modalTitle}>
                        {pickerMode === "date" ? "Select Date" : "Select Time"}
                      </Text>

                      <DateTimePicker
                        value={tempDate}
                        mode={pickerMode}
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          if (!selectedDate) return;

                          if (pickerMode === "date") {
                            // Step 1 → Save date, move to time
                            setTempDate(selectedDate);
                            setPickerMode("time");
                          } else {
                            // Step 2 → Combine date + time and close
                            const finalDate = new Date(tempDate);
                            finalDate.setHours(selectedDate.getHours());
                            finalDate.setMinutes(selectedDate.getMinutes());
                            setCallBackTime(finalDate.toISOString());
                            setShowPickerModal(false);
                          }
                        }}
                      />

                      <TouchableOpacity
                        onPress={() => setShowPickerModal(false)}
                        style={styles.cancelBtn}
                      >
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                </Modal>
              </View>
            )}

            {/* Subcategory */}
            <View style={styles.field}>
              <Dropdown
                label="Sub Category"
                value={subcategory}
                options={subCategoryData}
                onChange={setSubcategory}
              />
            </View>

            {/* Priority */}
            <View style={styles.field}>
              <Dropdown
                label="Priority"
                value={priority}
                options={priorityData}
                onChange={setPriority}
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={setDescription}
                multiline
                placeholder="Describe your issue..."
                placeholderTextColor="#888"
              />
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, !isValid && styles.disabled]}
            onPress={onSave}
            disabled={!isValid || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Save Ticket</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddTicketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
  },
  content: {
    padding: 20,
    // paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    color: "#d4d4d4",
    marginBottom: 6,
    fontWeight: "500",
  },

  inputBox: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#555558",
    paddingHorizontal: 14,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2c2c2e",
  },

  inputText: {
    color: "#fff",
    fontSize: 15,
  },

  textArea: {
    height: 120,
    borderRadius: 16,
    backgroundColor: "#4a4a4b",
    padding: 14,
    color: "#fff",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#2c2c2e",
  },

  button: {
    marginTop: 30,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#32D74B",
    justifyContent: "center",
    alignItems: "center",

    // depth
    shadowColor: "#32D74B",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },

  disabled: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#1c1c1e",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },

  cancelBtn: {
    marginTop: 10,
    padding: 12,
    alignItems: "center",
  },

  cancelText: {
    color: "#ff453a",
    fontSize: 16,
    fontWeight: "600",
  },
});