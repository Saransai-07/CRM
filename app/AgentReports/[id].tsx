import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Theme, useThemedStyles } from '@/src/theme';
import { Pagination } from '@/src/components/Pagination';
import HeaderSearch from '@/src/components/ListHeader';
import { useAuth } from '@/src/context/AuthContext';
import {  AgentReportsInterface } from '@/src/Interface/InterfaceData';
import { getToken } from '@/src/lib/secureStorage';
import AgentCard from '@/src/components/CVR/AgentCard';
import AgentReports from '@/src/components/CVR/AgentReports';

const WizklubAgentsReports = () => {
  const { id, name } = useLocalSearchParams();
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<AgentReportsInterface[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('')
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const styles = useThemedStyles(createStyles);
  const [refreshing, setRefreshing] = useState(false);



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
        await Promise.all([
          fetchData(page, search),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, [accessToken, page, search, id]);



  const fetchData = async (pageNumber: number, search: string) => {
    try {
      const res = await fetch(`${BASE_URL}/wizklub/wizklub_agent_branch_wise_reports/?agent=${id}&page=${pageNumber}&search=${search}`, options);
      const json = await res.json();
      setData(json.results);
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
      {loading && !refreshing ? (
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
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={handleNext}
            onPrev={handlePrev}
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
  });
