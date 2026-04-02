import AgentInputsComponent from '@/src/components/CVR/AgentInputsComponent';
import HeaderSearch from '@/src/components/ListHeader';
import { useAuth } from '@/src/context/AuthContext';
import { AgentInputsInterface } from '@/src/Interface/InterfaceData';
import { getToken } from '@/src/lib/secureStorage';
import { Theme, useThemedStyles } from '@/src/theme';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AgentInputs = () => {
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<AgentInputsInterface[]>([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);


  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);

  const styles = useThemedStyles(createStyles);

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

  // Fetch first page when accessToken or search changes
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

  const fetchData = async (pageNumber: number, searchText: string, isFirstPage: boolean) => {
    try {
      const res = await fetch(
        `${BASE_URL}/wizklub/wizklub_agent_wise_input/?page=${pageNumber}&search=${searchText}`,
        options
      );
      const json = await res.json();

      if (isFirstPage) {
        setData(json.results);
        setTotalCount(json.total_count || 0);

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
        title="🕵️ Agent Inputs"
        placeholder="Search..."
        onSearchChange={(searchText) => { setSearch(searchText) }}
      />

      <View style={styles.TotalContainer}>
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
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <AgentInputsComponent item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() => (
            <Text style={styles.emptycomponent}> ❎ No Agent Inputs found</Text>
          )}
        />
      )}

    </View>
  )
};

const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.surface,
      paddingHorizontal: 12,
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

    TotalContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 12,
      gap: 10
    },
    countContainer: {
      justifyContent: "center",
      paddingHorizontal: 10,
      paddingVertical: 10,
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
  });


export default AgentInputs