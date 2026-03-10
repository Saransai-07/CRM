import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router } from 'expo-router';
import { getToken } from '@/src/lib/secureStorage';
import { Theme, useThemedStyles } from '@/src/theme';
import { BranchCVRInterface } from '@/src/Interface/InterfaceData';
import { useAuth } from '@/src/context/AuthContext';
import { Pagination } from '@/src/components/Pagination';
import HeaderSearch from '@/src/components/ListHeader';
import BranchCVRComponent from '@/src/components/CVR/BranchCVRComponent';

const BranchCVR = () => {
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<BranchCVRInterface[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('')
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

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
  }, [accessToken, page, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1)
    await fetchData(1, search);
    setRefreshing(false);
  };



  const fetchData = async (pageNumber: number, search: string) => {
    try {
      const res = await fetch(`${BASE_URL}/wizklubcvr/branch_cvr/?page=${pageNumber}&search=${search}&from_date=&to_date=/`, options);
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



  return (
    <View style={styles.container}>

      <HeaderSearch
        title="📊 Branch CVR"
        placeholder="Search agents..."
        onSearchChange={(searchText) => { setSearch(searchText), setPage(1) }}
      />

      {loading && !refreshing ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.branch_id.toString()}
            renderItem={({ item }) => <BranchCVRComponent item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={() => (
              <Text style={styles.emptycomponent}>❎ No Branches found</Text>
            )}
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
    }

  });

export default BranchCVR