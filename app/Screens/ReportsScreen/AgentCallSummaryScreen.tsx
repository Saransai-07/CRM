import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { getToken } from '@/src/lib/secureStorage';
import { Theme, useThemedStyles } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';
import { AgentCallSummaryInterface } from '@/src/Interface/InterfaceData';
import { Pagination } from '@/src/components/Pagination';
import HeaderSearch from '@/src/components/ListHeader';
import AgentCallSummary from '@/src/components/Reports/AgentCallSummary';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateRangeModal from '@/src/components/DoubleDatePicker';

const AgentCallSummaryScreen = () => {

  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<AgentCallSummaryInterface[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('')
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const styles = useThemedStyles(createStyles);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);




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

  useEffect(() => {
    if (!accessToken) return;
    const loadSales = async () => {
      try {
        setLoading(true);
        await fetchData(page, search)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, [accessToken, page, search, startDate, endDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1)
    await fetchData(1, search);
    setRefreshing(false);
  };

  const fetchData = async (pageNumber: number, search: string) => {

    try {
      const res = await fetch(`${BASE_URL}/call/agent_wise_wizklub_call_analytics/?page=${pageNumber}&search=${search}&start_date=${startDate ?? ""}&end_date=${endDate ?? ""}`, options);
      const json = await res.json();
      setData(json.results);
      console.log(json)
      setTotalPages(json.total_pages);
      setPage(json.current_page_number);
    } catch (error) {
      console.log("Error:", error);
    } finally {
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1)
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
    }
  };



  return (
    <View style={styles.container}>

      <HeaderSearch
        title="Agents summary"
        placeholder="Search..."
        onSearchChange={(searchText) => { setSearch(searchText), setPage(1) }}
      />

      <View style={styles.dateContainer}>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={styles.dateText}>
            {startDate && endDate
              ? `📅  ${startDate} → ${endDate}`
              : "📅  Select Date Range"}
          </Text>
        </TouchableOpacity>
      </View>


      {loading && !refreshing ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AgentCallSummary item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={() => (
              <Text style={styles.emptycomponent}>❎ No agents found</Text>
            )}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </>
      )}
      <DateRangeModal
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onApply={(start, end) => {
          setStartDate(start);
          setEndDate(end);
          setPage(1);
        }}
      />
    </View>

  )
}


export default AgentCallSummaryScreen;

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

  });