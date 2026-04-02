import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Modal,
  FlatList,
  Pressable,
} from "react-native";
import Dropdown from "../DropDown";
import { useAuth } from "@/src/context/AuthContext";
import ActivityRing from "../ActivityRing";

const BranchScreen = () => {
  const { BASE_URL, authState } = useAuth();
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null | string>(null);
  const [branchData, setBranchData] = useState<any>(null);
  const [branchRenewalsData, setBranchRenewalsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [showSalesModal, setShowSalesModal] = useState(false);
  const [showRenewalsModal, setShowRenewalsModal] = useState(false);

  const fetchBranches = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/branches/wizklub_branches_dropdown/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );

      const data = await res.json();
      setBranches(
        data.map((item: any) => ({
          value: item.branch_id,
          label: item.name,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBranchSales = async (id: any) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/new_dashboards/branch_class_wise_sales_report/?branch_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );

      const data = await res.json();
      setBranchData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchRenewalSales = async (id: any) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/new_dashboards/branch_class_wise_renewals_report/?branch_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );

      const data = await res.json();
      setBranchRenewalsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchBranchSales(selectedBranchId || 418);
    fetchBranchRenewalSales(selectedBranchId || 418);
  }, [selectedBranchId]);

  const transformBranchData = (data: any) => {
    if (!data?.class_wise_sales)
      return { totalSales: 0, totalStrength: 0 };

    return data.class_wise_sales.reduce(
      (acc: any, item: any) => {
        acc.totalSales += item.total_sales || 0;
        acc.totalStrength += item.strength || 0;
        return acc;
      },
      { totalSales: 0, totalStrength: 0 }
    );
  };

  const transformBranchRenewalData = (data: any) => {
    if (!data?.class_wise_sales)
      return { totalRenewalSales: 0, totalRenewalStrength: 0 };

    return data.class_wise_sales.reduce(
      (acc: any, item: any) => {
        acc.totalRenewalSales += item.renewal_sales || 0;
        acc.totalRenewalStrength += item.last_year_sales || 0;
        return acc;
      },
      { totalRenewalSales: 0, totalRenewalStrength: 0 }
    );
  };

  const { totalSales, totalStrength } = transformBranchData(branchData);
  const { totalRenewalSales, totalRenewalStrength } = transformBranchRenewalData(branchRenewalsData);

  const progress =  totalStrength === 0 ? 0 : totalSales / totalStrength;

  const progressRenewals =  totalRenewalStrength === 0 ? 0 : totalRenewalSales / totalRenewalStrength;

  return (
    <View style={styles.container}>

      {/* Dropdown Card */}
      <View style={styles.card}>
        <Dropdown
          value={selectedBranchId || 418}
          options={branches}
          onChange={setSelectedBranchId}
        />
      </View>

      <ClassWiseModal
        visible={showSalesModal}
        onClose={() => setShowSalesModal(false)}
        data={branchData}
        type="Sales"
      />

      <ClassWiseModal
        visible={showRenewalsModal}
        onClose={() => setShowRenewalsModal(false)}
        data={branchRenewalsData}
        type="Renewals"
      />

      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.ringRow}>
          <TouchableOpacity
            style={styles.ringCard}
            onPress={() => setShowSalesModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.ringTitle}>Sales</Text>
            <ActivityRing progress={progress} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ringCard}
            onPress={() => setShowRenewalsModal(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.ringTitle}>Renewals</Text>
            <ActivityRing progress={progressRenewals} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default BranchScreen;


const ClassWiseModal = ({
  visible,
  onClose,
  data,
  type,
}: any) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>

        <View style={modalStyles.overlay}>
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>
              {type} - Class Wise
            </Text>

            <FlatList
              data={data?.class_wise_sales || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={modalStyles.row}>
                  <Text style={modalStyles.className}>
                    {item.class_name}
                  </Text>

                  <Text style={modalStyles.value}>
                    {type === "Sales"
                      ? `${item.total_sales} / ${item.strength} `
                      : `${item.renewal_sales} / ${item.last_year_sales}`}
                  </Text>
                </View>
              )}
            />

            <Pressable onPress={onClose} style={modalStyles.closeBtn}>
              <Text style={{ color: "#fff" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#0f172a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "70%",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#333",
  },

  className: {
    color: "#ccc",
    fontSize: 14,
  },

  value: {
    color: "#fff",
    fontWeight: "600",
  },

  closeBtn: {
    marginTop: 16,
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    paddingHorizontal: 16,
    borderRadius: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 16,
    color: "#1A1A1A",
  },

  card: {
    borderRadius: 16,
    padding: 7,
    marginBottom: 5,

  },
  ringRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // modern spacing
    marginBottom: 10,
  },

  ringCard: {
    flex: 1, //  makes both equal width
    backgroundColor: "#0f172a",
    borderRadius: 18,
    paddingBottom: 20,
    alignItems: "center",

    shadowColor: "#505050",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  ringTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#cecece",
  },
});