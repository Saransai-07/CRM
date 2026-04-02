
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Pressable,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { getToken } from "@/src/lib/secureStorage";
import { Theme, useThemedStyles } from "@/src/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Guardian, Student } from "@/src/Interface/InterfaceData";
import Dropdown, { Option } from "@/src/components/DropDown";
// import { Dropdown } from "react-native-element-dropdown";




const Row = ({ label, value }: { label: string; value?: string | number | null }) => (
  <View style={stylesStatic.row}>
    <Text style={stylesStatic.label}>{label}</Text>
    <Text style={stylesStatic.value}>{value ?? "-"}</Text>
  </View>
);

const StudentDetailsScreen = () => {
  const { id, scsnumber } = useLocalSearchParams();
  const router = useRouter();

  const { logout, BASE_URL } = useAuth();
  const styles = useThemedStyles(createStyles);

  const [data, setData] = useState<Student | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [relation, setRelation] = useState<number | null | string>(null);
  const [customName, setCustomName] = useState("");
  const [customephoneNumber, setCustomPhoneNumber] = useState("");
  const [relationOptions, setRelationOptions] = useState<Option[]>([])
  const [studentContact, setStudentContact] = useState<Guardian[]>([])
  const [editingId, setEditingId] = useState<number | null>(null);
  const [mobileNumber, setMobileNumber] = useState<string>('')
  const [showPhone, setShowPhone] = useState(false);
  
  const isValid = customName && relation && customephoneNumber

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

  const fetchRelationShip = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${BASE_URL}/students/relationship_type_dropdown/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        console.log("Relation API error:", json);
        throw new Error("API failed");
      }

      if (!Array.isArray(json)) {
        console.log("Unexpected response:", json);
        throw new Error("Invalid data format");
      }

      setRelationOptions(
        json.map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
      );
    } catch (error) {
      console.log("fetchRelationShip error:", error);
      Alert.alert("Error", "Failed to load relation options");
    }
  };

  const fetchmobilenumber = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${BASE_URL}/students/get_student_phone_number/?scsnumber=${scsnumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        console.log("Mobile number Error:", json);
        setMobileNumber('')
        throw new Error("API failed");
      }
      setMobileNumber(json.mobile_number)

    } catch (error) {
      console.log("Fetch Mobile Number Error:", error);
      Alert.alert("Error", "Failed to load Mobile Number");
    }
  };

  const fetchstudentContact = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        `${BASE_URL}/students/student_contacts_list/${id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch student Contact");
      }
      setStudentContact(data);
      // console.log(data)
    } catch (err) {
      console.log("Student contact fetch error:", err);
      setStudentContact([]);
    } finally {
    }
  }

  const fetchStudent = useCallback(async () => {
    if (!accessToken) return;
    try {
      setError(null);
      const response = await fetch(
        `${BASE_URL}/students/get_wizklub_student_by_id/${id}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch student");
      }
      setData(json);
    } catch (err) {
      console.log("Student fetch error:", err);
      setError("Failed to load student details");
      setData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken, id]);



  useEffect(() => {
    fetchStudent();
    fetchRelationShip();
    fetchstudentContact();
    fetchmobilenumber();
  }, [fetchStudent]);


  const onRefresh = () => {
    setRefreshing(true);
    fetchStudent();
    fetchRelationShip();
    fetchstudentContact();
    fetchmobilenumber();
  };

  const openEditModal = (item: any) => {
    setModalVisible(true);
    setEditingId(item.id);
    setRelation(item.relation_type);
    setCustomName(item.name);
    setCustomPhoneNumber(item.phone_number);
  };

  const handleSave = async () => {
    
    const payload = {
      relation_type: relation,
      name: customName,
      phone_number: customephoneNumber,
    };
    try {
      const url = editingId
        ? `${BASE_URL}/students/get_or_update_student_contacts/${editingId}/`
        : `${BASE_URL}/students/create_student_contacts/${id}/`;

      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // console.log(res.json())
      if (!res.ok) throw new Error("Failed to save");
      fetchstudentContact();
    } catch (err) {
      Alert.alert("Error", "Something went wrong");

    } finally {
    }
  };


  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  if (!data) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>❎ No Student Details Found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.card}>
        <Row label="SCS Number" value={data.SCS_Number} />
        <Row label="Student" value={data.name} />
        <Row label="Branch" value={data.branch_name} />
        <Row label="Orientation" value={data.orientation_name} />
        <Row label="Class" value={data.student_class_name} />
        <Row label="Enrolling Class" value={data.enrolling_class_name} />
        <Row label="Section" value={data.section_name} />
        <Row label="Academic Year" value={data.academic_year_name} />
        <Row label="No. of Updates" value={data.no_of_attempts} />
        <Row label="Agent" value={data.agent_name} />

        <Row
          label="Wizklub Branch"
          value={data.is_wizklub_branch ? "Yes" : "No"}
        />

        <Row
          label="Paid Last Year"
          value={data.is_wizklub_paid_last_year ? "Yes" : "No"}
        />

        <Row label="Admission Status" value={data.admission_status_name} />

        <Row label="Wizklub Paid" value={data.is_wizklub_paid ? "Yes" : "No"} />

        {/* <Row label="Phone Number" value="" /> */}
        <View style={styles.phoneToggleRow}>
          <Text style={stylesStatic.label}>Phone Number</Text>

          <Pressable onPress={() => setShowPhone(prev => !prev)}>
            <Text style={styles.phoneToggleValue}>
              {showPhone ? mobileNumber : "🔒"}
            </Text>
          </Pressable>
        </View>

        <TouchableOpacity
          onPress={() => {
            setModalVisible(true)
            setEditingId(null);
            setRelation(null);
            setCustomName("");
            setCustomPhoneNumber("");
          }}
        >
          <Text style={styles.link}>Add Custom Phone Number ➕</Text>
        </TouchableOpacity>


        {studentContact.map((item) => (
          <View key={item.id} style={styles.phoneRow}>

            <View>
              <Text style={styles.phoneRelation}>
                {item.relation_type_name}-{item.name}
              </Text>

              <Text style={styles.phoneNumber}>
                {item.phone_number}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => openEditModal(item)}
            >
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>

          </View>
        ))}

      </View>

      {data.siblings?.length > 0 && (
        <>
          <Text style={styles.siblingTitle}>Siblings</Text>

          {data.siblings.map((sib, index) => (
            <View key={index} style={styles.siblingCard}>
              <Row label="SCS Number" value={sib.SCS_Number} />
              <Row label="Student Name" value={sib.name} />
              <Row label="Admission Status" value={sib.admission_status_name} />
              <Row label="Branch" value={sib.branch_name} />
              <Row label="Orientation" value={sib.orientation_name} />
              <Row label="Class" value={sib.student_class_name} />

              <Row
                label="Wizklub paid last year"
                value={sib.is_wizklub_paid_last_year ? "Yes" : "No"}
              />

              <Row
                label="Wizklub Paid"
                value={sib.is_wizklub_paid ? "Yes" : "No"}
              />
            </View>
          ))}
        </>
      )}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior="padding"
        >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={StyleSheet.absoluteFill} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Add Phone Number</Text>

              {/* Relation Dropdown */}
              <Dropdown
                label="Relation"
                value={relation}
                options={relationOptions}
                onChange={setRelation}
              />

              {/* Name Input */}
              <Text style={styles.inputLabel}>Name</Text>

              <TextInput
                placeholder="Enter Name"
                placeholderTextColor="#777"
                value={customName}
                onChangeText={setCustomName}
                style={styles.input}
              />

              {/* Phone Input */}
              <Text style={styles.inputLabel}>Phone Number</Text>

              <TextInput
                placeholder="Enter phone number"
                placeholderTextColor="#777"
                keyboardType="phone-pad"
                value={customephoneNumber}
                onChangeText={setCustomPhoneNumber}
                style={styles.input}
              />

              {/* Buttons */}
              <View style={styles.modalButtons}>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => {
                    handleSave();
                    setModalVisible(false);
                  }}
                  disabled={!isValid}
                >
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>

              </View>

            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView >
  );
};

export default StudentDetailsScreen;


const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1c1c1e",
      padding: 16,
    },
    wrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    center: {
      justifyContent: "center",
      alignItems: "center",
    },

    card: {
      backgroundColor: "#000000",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 20,
    },

    link: {
      color: "#4da3ff",
      fontSize: 14,
      marginTop: 12,
      fontWeight: "500",
    },

    siblingTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: "#f4f4f5",
      marginBottom: 12,
    },

    siblingCard: {
      backgroundColor: "#000000",
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 16,
      elevation: 6,
    },

    errorText: {
      color: "#fff",
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(71, 71, 71, 0.6)",
      justifyContent: "center",
      padding: 20,
    },

    modalContainer: {
      backgroundColor: "#000",
      borderRadius: 18,
      padding: 20,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
      marginBottom: 16,
    },

    inputLabel: {
      color: "#a1a1a1",
      fontSize: 13,
      marginBottom: 6,
      marginTop: 10,
    },

    input: {
      backgroundColor: "#1c1c1e",
      borderRadius: 10,
      padding: 12,
      color: "#fff",
      fontSize: 15,
    },


    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },

    cancelBtn: {
      backgroundColor: "#2c2c2e",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },

    saveBtn: {
      backgroundColor: "#4da3ff",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 10,
    },

    btnText: {
      color: "#fff",
      fontWeight: "600",
    },

    phoneRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.05)",
    },

    phoneRelation: {
      color: "#d4d4d4",
      fontSize: 13,
    },

    phoneNumber: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "600",
    },

    editBtn: {
      backgroundColor: "#1c1c1e",
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 8,
    },

    editText: {
      color: "#4da3ff",
      fontWeight: "500",
    },

    phoneToggleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.06)",
    },

    phoneToggleValue: {
      fontSize: 15,
      color: "#cbd1d6",
      fontWeight: "600",
    },
  });

/*
Static styles for Row (avoid rerender)
*/

const stylesStatic = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  label: {
    fontSize: 14,
    color: "#a1a1aa",
    fontWeight: "500",
  },

  value: {
    fontSize: 15,
    color: "#f4f4f5",
    fontWeight: "600",
    maxWidth: "55%",
    textAlign: "right",
  },
});