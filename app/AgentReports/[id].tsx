import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Theme, useThemedStyles } from '@/src/theme';
import { Pagination } from '@/src/components/Pagination';
import HeaderSearch from '@/src/components/ListHeader';
import { useAuth } from '@/src/context/AuthContext';
import { AgentReportsInterface } from '@/src/Interface/InterfaceData';
import { getToken } from '@/src/lib/secureStorage';
import AgentCard from '@/src/components/CVR/AgentCard';
import AgentReports from '@/src/components/CVR/AgentReports';

const WizklubAgentsReports = () => {
  const { id, name } = useLocalSearchParams();
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<AgentReportsInterface[]>([]);
  const [page, setPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('')
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);

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
  }, [accessToken, search]);



  const fetchData = async (pageNumber: number, search: string, isFirstPage: boolean) => {
    try {
      setLoading(true)
      const res = await fetch(`${BASE_URL}/wizklub/wizklub_agent_branch_wise_reports/?agent=${id}&page=${pageNumber}&search=${search}`, options);
      const json = await res.json();
      setData(json.results || "");
      setTotalCount(json.total_count || 0);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1)
    await fetchData(page, search, true);
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
        title={name}
        placeholder="Search"
        onSearchChange={(searchText) => { setSearch(searchText) }}
      />


      <View style={styles.dateContainer}>

        {/* Total Count */}
        <View style={styles.countContainer}>
          <Text style={styles.countText}>
            {totalCount} Records
          </Text>
        </View>

      </View>



      {initialLoading && !refreshing ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.branch_id.toString()}
            renderItem={({ item }) => <AgentReports key={item.branch_id} item={item} />}
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
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
          />
        </>
      )}
    </View>

  )
};

export default WizklubAgentsReports

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

    countContainer: {
      justifyContent: "center",
      paddingHorizontal: 10,
      paddingVertical : 10,
      backgroundColor: "#111827",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "#374151",
    },

    countText: {
      color: "#10b981",
      fontWeight: "700",
    },


  });
