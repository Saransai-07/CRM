
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";

interface Group {
  id: number;
  name: string;
}

interface Member {
  id: number;
  username: string;
  no_of_sales: number;
}

interface SalesData {
  sales_rank_group: number;
  sales_rank_group_name: string;
  total_sales: number;
  members: Member[];
}

export const useSalesRank = () => {
  const { BASE_URL, authState } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [data, setData] = useState<SalesData | null>(null);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoadingGroups(true);
      const res = await fetch(
        `${BASE_URL}/new_dashboards/sales_rank_group_dropdown/`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );
      const json = await res.json();
      const mapped = json.map((item: any) => ({
        id: item.id,
        name: item.name,
      }));
      setGroups(mapped);
      if (mapped.length > 0) {
        setSelectedGroup(mapped[0]); 
      }
    } catch (err) {
      setError("Failed to load groups");
    } finally {
      setLoadingGroups(false);
    }
  };

  // 🔹 Fetch sales data
  const fetchData = useCallback(async () => {
    if (!selectedGroup) return;

    try {
      setLoadingData(true);
      const res = await fetch(
        `${BASE_URL}/new_dashboards/agnet_wizklub_sales_rank_group/?sales_rank_group=${selectedGroup.id}`,
        {
          headers: {
            Authorization: `Bearer ${authState?.accessToken}`,
          },
        }
      );

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Failed to load sales data");
    } finally {
      setLoadingData(false);
    }
  }, [selectedGroup, BASE_URL, authState?.accessToken]);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchData();
    }
  }, [selectedGroup, fetchData]);

  return {
    groups,
    selectedGroup,
    setSelectedGroup,
    data,
    loadingGroups,
    loadingData,
    error,
    refetch: fetchData,
  };
};


const SalesRankDashboard = () => {
  const {
    groups,
    selectedGroup,
    setSelectedGroup,
    data,
    loadingData,
    error,
  } = useSalesRank();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <View style={styles.container}>
      
      {/* Dropdown */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownOpen((prev) => !prev)}
      >
        <Text style={styles.dropdownText}>
          {selectedGroup?.name || "Select Group"} ▼
        </Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={styles.dropdownMenu}>
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedGroup(group);
                setDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>
                {group.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Error */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Loading */}
      {loadingData ? (
        <ActivityIndicator size="large" />
      ) : !data ? (
        <Text style={styles.empty}>No Data</Text>
      ) : (
        <View style={styles.card}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              🏆 {data.sales_rank_group_name}
            </Text>
            <Text style={styles.total}>
              {data.total_sales} Sales
            </Text>
          </View>

          {/* Members */}
          <FlatList
            data={data.members}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              const max = Math.max(
                ...data.members.map((m) => m.no_of_sales),
                1
              );

              const percentage =
                (item.no_of_sales / max) * 100;

              return (
                <View style={styles.row}>
                  
                  {/* Name + Bar */}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>
                      {item.username}
                    </Text>

                    <View style={styles.progressBg}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${percentage}%` },
                        ]}
                      />
                    </View>
                  </View>

                  {/* Sales */}
                  <Text style={styles.sales}>
                    {item.no_of_sales}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default SalesRankDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#0f172a",
    borderRadius : 20,
  },

  dropdownButton: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  dropdownText: {
    color: "#fff",
    fontWeight: "600",
  },

  dropdownMenu: {
    backgroundColor: "#1e293b",
    borderRadius: 10,
    marginBottom: 12,
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderColor: "#334155",
  },

  dropdownItemText: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  title: {
    color: "#facc15",
    fontSize: 18,
    fontWeight: "700",
  },

  total: {
    color: "#10b981",
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  rank: {
    width: 40,
    color: "#9ca3af",
  },

  name: {
    color: "#fff",
    marginBottom: 4,
  },

  sales: {
    width: 50,
    textAlign: "right",
    color: "#60a5fa",
    fontWeight: "600",
  },

  progressBg: {
    height: 6,
    backgroundColor: "#374151",
    borderRadius: 10,
  },

  progressFill: {
    height: 6,
    backgroundColor: "#22c55e",
    borderRadius: 10,
  },

  error: {
    color: "red",
    marginBottom: 10,
  },

  empty: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});