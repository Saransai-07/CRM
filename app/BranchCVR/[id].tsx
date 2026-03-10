import { View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getToken } from '@/src/lib/secureStorage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Theme, useThemedStyles } from '@/src/theme';
import { useAuth } from '@/src/context/AuthContext';
import { BranchCVRInterface } from '@/src/Interface/InterfaceData';
import { Pagination } from '@/src/components/Pagination';
import HeaderSearch from '@/src/components/ListHeader';
import BranchCard from '@/src/components/ConverstionCard';

const BranchCVRScreen = () => {

  const { id, name } = useLocalSearchParams();
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<BranchCVRInterface[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
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
          fetchData(),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSales();
  }, [accessToken, page,  id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/wizklubcvr/branch_cvr/${id}/`, options);
      const json = await res.json();
      setData([json]);
    } catch (error) {
      console.log("Error:", error);
    } finally {
    }
  };



  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1)
    await fetchData();
    setRefreshing(false);
  };

  return (

    <View style={styles.container}>

      {loading && !refreshing ? (
        <ActivityIndicator size='large' />
      ) : (
        <>
          <FlatList
            data={data}
            keyExtractor={(item) => item.branch_id.toString()}
            renderItem={({ item }) => <BranchCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={() => (
              <Text style={styles.emptycomponent}> ❎ No Data Found</Text>
            )}
          />
          <View style={styles.pagiantion}>

          </View>
        </>
      )}
    </View>

  )
}

export default BranchCVRScreen


const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.surface,
      paddingHorizontal: 0,
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

  });
