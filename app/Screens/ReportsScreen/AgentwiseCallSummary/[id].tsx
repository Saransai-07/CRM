import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getToken } from '@/src/lib/secureStorage';
import { Theme, useThemedStyles } from '@/src/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { AgentWiseCallLogInterface } from '@/src/Interface/InterfaceData';
import { Pagination } from '@/src/components/Pagination';
import HeaderSearch from '@/src/components/ListHeader';
import AgentWiseCallComponent from '@/src/components/Reports/AgentWiseCallComponent';
import DateRangeModal from '@/src/components/DoubleDatePicker';

const AgentWiseCallLog = () => {
  const { id, name, startDate, endDate } = useLocalSearchParams();
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<AgentWiseCallLogInterface[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('')
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const [refreshing, setRefreshing] = useState(false);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [startDate1, setStartDate] = useState<any>(startDate);
  const [endDate1, setEndDate] = useState<any>(endDate);



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
    fetchData(page, search)
  }, [accessToken, page, search, id, startDate1, endDate1]);



  const fetchData = async (pageNumber: number, search: string) => {
    try {
      setLoading(true)
      // const fromDate = typeof startDate === "string" ? startDate : "";
      // const toDate = typeof endDate === "string" ? endDate : "";

      const res = await fetch(
        `${BASE_URL}/call/agent_wise_wizklub_call_logs/${id}/?page=${pageNumber}&search=${search}&from_date=${startDate1}&to_date=${endDate1}`,
        options
      );
      const json = await res.json();
      setData(json.results);
      setTotalPages(json.total_pages);
      setPage(json.current_page_number);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
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

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1)
    await fetchData(page, search);
    setRefreshing(false);
  };



  return (
    <View style={styles.container}>
      <HeaderSearch
        title={name}
        placeholder="Search"
        onSearchChange={(searchText) => { setSearch(searchText), setPage(1) }}
      />

      <View style={styles.dateContainer}>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={styles.dateText}>
            {startDate1 && endDate1
              ? `📅  ${startDate1} → ${endDate1}`
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
            keyExtractor={(item, index) => `${item.student}-${index}`}
            renderItem={({ item }) => <AgentWiseCallComponent item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={() => (
              <Text style={styles.emptycomponent}> ❎ No Call Logs Found</Text>
            )}
          />
          <View style={styles.pagiantion}>
            {data.length > 0 ? (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onNext={handleNext}
                onPrev={handlePrev}
              />

            ) : (
              <>
              </>
            )}
          </View>
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

export default AgentWiseCallLog


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

    pagiantion: {
      marginBottom: 10
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