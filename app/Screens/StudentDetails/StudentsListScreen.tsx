import StudentListComponent from '@/src/components/StudentsDetails/StudentListComponent';
import DateRangeModal from '@/src/components/DoubleDatePicker';
import HeaderSearch from '@/src/components/ListHeader';
import { useAuth } from '@/src/context/AuthContext';
import { Studentlist } from '@/src/Interface/InterfaceData';
import { getToken } from '@/src/lib/secureStorage';
import { Theme, useThemedStyles } from '@/src/theme';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

const StudentsListScreen = () => {

  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<Studentlist[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const styles = useThemedStyles(createStyles);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);

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
  }, [accessToken, search, startDate, endDate]);

  const fetchData = async (pageNumber: number, searchText: string, isFirstPage: boolean) => {
    try {
      const res = await fetch(`${BASE_URL}/students/wizklub_student/?page=${pageNumber}&search=${searchText}`, options);
      if(!res.ok){
        if (isFirstPage) setData([]);
        return;
      }
      const json = await res.json();
      
      if (isFirstPage) {
        setData(json.results);
      } else {
        setData(prev => [...prev, ...json.results]);
      }
      totalPagesRef.current = json.total_pages;
      pageRef.current = json.current_page_number;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    pageRef.current = 1;
    setData([]);
    await fetchData(1, search, true);
    setRefreshing(false);
  };

  const handleLoadMore = useCallback(async () => {
    if (loadingMore || pageRef.current >= totalPagesRef.current) return;

    const nextPage = pageRef.current + 1;
    setLoadingMore(true);
    await fetchData(nextPage, search, false);
    setLoadingMore(false);
  }, [loadingMore, search, options]);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator style={{ marginVertical: 16 }} size="small" />
    );
  };

  return (
    <View style={styles.container}>

      <HeaderSearch
        title="Students List"
        placeholder="Search..."
        onSearchChange={(searchText) => { setSearch(searchText) }}
      />
{/* 
      <View style={styles.dateContainer}>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={styles.dateText}>
            {startDate && endDate
              ? ` ${startDate} → ${endDate}`
              : "  Select Date Range"}
          </Text>
        </TouchableOpacity>
      </View> */}


      {initialLoading && !refreshing ? (
        <ActivityIndicator size='large' />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${item.student_id}-${index}`}
          renderItem={({ item }) => (
            <StudentListComponent item={item} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => (
            <Text style={styles.emptycomponent}>❎ No students found</Text>
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
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

export default StudentsListScreen


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