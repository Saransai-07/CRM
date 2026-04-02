import SalesComponent from '@/src/components/Reports/SalesComponent';
import DateRangeModal from '@/src/components/DoubleDatePicker';
import HeaderSearch from '@/src/components/ListHeader';
import { useAuth } from '@/src/context/AuthContext';
import { SalesReportInterface } from '@/src/Interface/InterfaceData';
import { getToken } from '@/src/lib/secureStorage';
import { Theme, useThemedStyles } from '@/src/theme';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import Dropdown, { Option } from '@/src/components/DropDown';

const SalesScreen = () => {
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<SalesReportInterface[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const styles = useThemedStyles(createStyles);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statesDropdownData, setStatesDropdownData] = useState<Option[]>([])
  const [selectedState, setSelectedState] = useState<number | string | null>("");
  const [zonesDropdownData, setZoneDropdownData] = useState<Option[]>([]);
  const [selectedZone, setSelectedZone] = useState<number | string | null>("");
  const [branchDropdownData, setBranchDropdownData] = useState<Option[]>([])
  const [selectedBranch, setSelectedBranch] = useState<number | string | null>("");
  const [agentDropdownData, setAgentDropdownData] = useState<Option[]>([])
  const [selectedAgent, setSelectedAgent] = useState<number | string | null>("");
  const [classDropdownData, setClassDropdownData] = useState<Option[]>([])
  const [selectedClass, setSelectedClass] = useState<number | string | null>("");
  const [selectedOncall, setSelectedOncall] = useState<number | string | null>("")
  const [selectedisLastYearPaid, setSelectedisLastYearPaid] = useState<number | string | null>("")
  
  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);

  const onCallOptions: Option[] = [
    {
      value: 0,
      label: "NO"
    },
    {
      value: 1,
      label: "YES"
    },
  ]

  const options = React.useMemo(() => ({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  }), [accessToken]);

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

  // Fetch first page when accessToken, search, or date range changes
  useEffect(() => {
    if (!accessToken) return;
    const loadInitial = async () => {
      try {
        setInitialLoading(true);
        setData([]);
        pageRef.current = 1;
        await fetchData(1, search, true);
      } catch (err) {
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitial();
  }, [accessToken, search, startDate, endDate, selectedState, selectedZone, selectedBranch, selectedAgent, selectedOncall, selectedClass, selectedisLastYearPaid]);

  const fetchData = async (pageNumber: number, searchText: string, isFirstPage: boolean) => {
    try {
      const queryParams = new URLSearchParams({
        state: selectedState?.toString() || "",
        zone: selectedZone?.toString() || "",
        student__branch: selectedBranch?.toString() || "",
        agent: selectedAgent?.toString() || "",
        on_call: selectedOncall?.toString() || "",
        student__student_class: selectedClass?.toString() || "",
        student__is_last_year_paid : selectedisLastYearPaid?.toString() || "",
      })
      const res = await fetch(
        // `${BASE_URL}/wizklub/wizklub_agent_sales/?page=${pageNumber}&student__is_last_year_paid=&on_call=&search=${searchText}&from_date=${startDate ?? ""}&to_date=${endDate ?? ""}`,
        `${BASE_URL}/wizklub/wizklub_agent_sales/?page=${pageNumber}&search=${searchText}&from_date=${startDate ?? ""}&to_date=${endDate ?? ""}&${queryParams}`,
        options
      );
      const json = await res.json();
      if (isFirstPage) {
        setData(json.results || []);
        setTotalCount(json.total_count || 0);
      } else {
        setData(prev => [...prev, ...(json.results || [])]);
      }
      totalPagesRef.current = json.total_pages;
      pageRef.current = json.current_page_number;
    } catch (error) {
      console.log("Error:", error);
    }
  };


  const fetchStates = async () => {
    try {
      const res = await fetch(`${BASE_URL}/branches/branches_state_dropdown/`, options);
      if (!res.ok) {
        setStatesDropdownData([]);
        return;
      }
      const json = await res.json();
      setStatesDropdownData(
        json.results.map((item: any) => ({
          value: item.state_id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.log("States data Error:", error);
    }
  };
  const fetchZones = async () => {
    try {
      const res = await fetch(`${BASE_URL}/branches/branches_zone_dropdown/${selectedState || 0}/`, options);
      if (!res.ok) {
        setZoneDropdownData([]);
        return;
      }
      const json = await res.json();
      setZoneDropdownData(
        json.results.map((item: any) => ({
          value: item.zone_id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.log("Zones data Error:", error);
    }
  };
  const fetchBranches = async () => {
    try {
      const res = await fetch(`${BASE_URL}/branches/wizklub_branches_dropdown/`, options);
      if (!res.ok) {
        setBranchDropdownData([]);
        return;
      }
      const json = await res.json();
      setBranchDropdownData(
        json.map((item: any) => ({
          value: item.branch_id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.log("Branches data Error:", error);
    }
  };
  const fetchClasses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/branches/wizklub_class_names_dropdown/`, options);
      if (!res.ok) {
        setClassDropdownData([]);
        return;
      }
      const json = await res.json();
      setClassDropdownData(
        json.map((item: any) => ({
          value: item.class_name_id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.log("Classes data Error:", error);
    }
  };
  const fetchAgents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/teammgmt/get_team_members_by_teammgmt/2/`, options);
      if (!res.ok) {
        setAgentDropdownData([]);
        return;
      }
      const json = await res.json();
      setAgentDropdownData(
        json.map((item: any) => ({
          value: item.id,
          label: item.username,
        }))
      );
    } catch (error) {
      console.log("Agents data Error:", error);
    }
  };

  const OpenModel = () => {
    fetchStates();
    fetchZones();
    fetchBranches();
    fetchAgents();
    fetchClasses();
    setFilterModalVisible(true);
  }

  const onRefresh = async () => {
    setRefreshing(true);
    pageRef.current = 1;
    setData([]);
    await fetchData(1, search, true);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || pageRef.current >= totalPagesRef.current) return;
    const nextPage = pageRef.current + 1;
    setLoadingMore(true);
    await fetchData(nextPage, search, false);
    setLoadingMore(false);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator style={{ marginVertical: 16 }} size="small" />
    );
  };

  return (
    <View style={styles.container}>

      <HeaderSearch
        title="Wizklub Sales"
        placeholder="Search..."
        onSearchChange={(searchText) => { setSearch(searchText) }}
      />

      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDateModalVisible(true)}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center" }}
          >
            <Text style={styles.dateText}>
              {startDate && endDate
                ? `${startDate} → ${endDate}`
                : "📅 Date Range"}
            </Text>
          </ScrollView>
        </TouchableOpacity>

        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {totalCount} Records
          </Text>
        </View>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            OpenModel();
          }}
        >
          <Text style={styles.filterText}>Filters ⚙️</Text>
        </TouchableOpacity>

      </View>

      {initialLoading && !refreshing ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.student_id}-${index}`}
          renderItem={({ item }) => (
            <SalesComponent item={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => (
            <Text style={styles.emptycomponent}>❎ No agents found</Text>
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
      >
        <TouchableWithoutFeedback onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>

              <Text style={styles.modalTitle}>Filters</Text>

              {/* STATE */}
              <Text style={styles.label}>State</Text>
              <Dropdown
                options={statesDropdownData}
                value={selectedState}
                onChange={setSelectedState}
              />

              <Text style={styles.label}>Zone</Text>
              <Dropdown
                options={zonesDropdownData}
                value={selectedZone}
                onChange={setSelectedZone}
              />

              <Text style={styles.label}>Branch</Text>
              <Dropdown
                options={branchDropdownData}
                value={selectedBranch}
                onChange={setSelectedBranch}
              />

              <Text style={styles.label}>On Call</Text>
              <Dropdown
                options={onCallOptions}
                value={selectedOncall}
                onChange={setSelectedOncall}
              />


              <Text style={styles.label}>Is Last Yeat Paid</Text>
              <Dropdown
                options={onCallOptions}
                value={selectedisLastYearPaid}
                onChange={setSelectedisLastYearPaid}
              />

              <Text style={styles.label}>Class</Text>
              <Dropdown
                options={classDropdownData}
                value={selectedClass}
                onChange={setSelectedClass}
              />

              <Text style={styles.label}>Agents</Text>
              <Dropdown
                options={agentDropdownData}
                value={selectedAgent}
                onChange={setSelectedAgent}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={() => {
                    setSelectedState(null);
                    setSelectedZone(null);
                    setSelectedBranch(null);
                    setSelectedAgent(null);
                    setSelectedOncall(null);
                    setSelectedClass(null);
                    setSelectedisLastYearPaid(null);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={styles.resetText}>Clear</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => {
                    setFilterModalVisible(false);
                    pageRef.current = 1;
                    fetchData(1, search, true);
                  }}
                >
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <DateRangeModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onApply={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

    </View>
  )
}
export default SalesScreen

const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.surface,
      paddingHorizontal: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "700",
      color: "#fff",
    },
    emptycomponent: {
      flex: 1,
      fontSize: 20,
      color: '#fff'
    },
    dateContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
      gap: 10
    },
    dateButton: {
      flex: 1,
      backgroundColor: "#1f2937",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#374151"
    },
    dateText: {
      color: "#fff",
      fontWeight: "500",
      textAlign: "center"
    },
    countContainer: {
      justifyContent: "center",
      paddingHorizontal: 10,
      backgroundColor: "#111827",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#374151",
    },
    countText: {
      color: "#10b981",
      fontWeight: "700",
    },
    filterButton: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 12,
      backgroundColor: "#1f2937",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#374151",
    },
    filterText: {
      color: "#fff",
      fontSize: 16,
    },


    // Modal styling
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: "#111827",
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
      marginBottom: 12,
    },
    label: {
      color: "#9ca3af",
      marginTop: 10,
    },
    input: {
      backgroundColor: "#1f2937",
      padding: 12,
      borderRadius: 8,
      marginTop: 6,
    },
    inputText: {
      color: "#fff",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    resetBtn: {
      padding: 12,
    },
    resetText: {
      color: "#ef4444",
      fontWeight: "600",
    },
    applyBtn: {
      backgroundColor: "#10b981",
      padding: 12,
      borderRadius: 8,
    },
    applyText: {
      color: "#000",
      fontWeight: "700",
    },
  });