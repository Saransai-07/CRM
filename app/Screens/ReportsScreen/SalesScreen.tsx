import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/src/context/AuthContext';
import { Theme, useThemedStyles } from '@/src/theme';
import { getToken } from '@/src/lib/secureStorage';
import { router } from 'expo-router';
import HeaderSearch from '@/src/components/ListHeader';
// import { FlatList } from 'react-native-reanimated/lib/typescript/Animated';
import { Pagination } from '@/src/components/Pagination';
import DateRangeModal from '@/src/components/DoubleDatePicker';
import { SalesReportInterface } from '@/src/Interface/InterfaceData';
import SalesComponent from '@/src/components/Reports/SalesComponent';

const SalesScreen = () => {

  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<SalesReportInterface[]>([]);
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
    fetchData(page, search)
  }, [accessToken, page, search, startDate, endDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1)
    await fetchData(1, search);
    setRefreshing(false);
  };

  const fetchData = async (pageNumber: number, search: string) => {

    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/wizklub/wizklub_agent_sales/?page=${pageNumber}&student__is_last_year_paid=&on_call=&search=${search}&from_date=${startDate ?? ""}&to_date=${endDate ?? ""}`, options);
      const json = await res.json();
      setData(json.results);
      setTotalPages(json.total_pages);
      setPage(json.current_page_number);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false)
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
            keyExtractor={(item, index) => `${item.student_id}-${index}`}
            renderItem={({ item }) => (
              <SalesComponent item={item}  />
            )}
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

  });