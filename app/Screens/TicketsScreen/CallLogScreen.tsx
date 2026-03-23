import { CallLogCard } from '@/src/components/Tickets/CallLogComponent';
import { useAuth } from '@/src/context/AuthContext';
import { getToken } from '@/src/lib/secureStorage';
import { Theme, useThemedStyles } from '@/src/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SectionList, StyleSheet, Text, View } from 'react-native';

const CallLogScreen = () => {
  const { id } = useLocalSearchParams();
  const { logout, BASE_URL } = useAuth();
  const styles = useThemedStyles(createStyles);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [sections, setSections] = useState<any[]>([]);

  //  Load token
  useEffect(() => {
    const init = async () => {
      const token = await getToken("ACCESS_TOKEN");
      if (!token) {
        await logout();
        router.replace("/(auth)/Login");
        return;
      }
      setAccessToken(token);
    };
    init();
  }, []);

  //  Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!accessToken) return;

    try {
      setLoading(true);

      const [logsRes, prevLogsRes] = await Promise.all([
        fetch(`${BASE_URL}/call/student_wise_wizklub_call_logs/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
        fetch(`${BASE_URL}/call/student_wise_previous_year_wizklub_call_logs/${id}/`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      ]);

      const logsData = logsRes.ok ? await logsRes.json() : { results: [] };
      const prevData = prevLogsRes.ok
        ? await prevLogsRes.json()
        : { results: [] };

      // 🔥 Sort helper
      const sortByDate = (arr: any[]) =>
        arr.sort(
          (a, b) =>
            new Date(b.call_start_time_).getTime() -
            new Date(a.call_start_time_).getTime()
        );

      const formattedSections = [
        {
          title: "This Year Call Logs",
          type: "current",
          data: sortByDate(logsData.results || []),
        },

        ...(prevData.results || []).map((item: any) => ({
          title: "2025-2026",
          type: "previous",
          data: sortByDate(item.call_logs || []),
        })),
      ];

      setSections(formattedSections);
    } catch (err) {
      console.log("Error:", err);
      setSections([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchAllData();
  }, [accessToken]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };



  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) =>
            `${item.student}-${index}`
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => <CallLogCard item={item} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {section.title} ({section.data.length})
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>❎ No call Logs Found</Text>
          )}
        />
      )}
    </View>
  )
}

export default CallLogScreen;



const createStyles = (t: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.colors.surface,
    },

    listContent: {
      padding: 16,
      paddingBottom: 40,
    },

    sectionHeader: {
      marginTop: 16,
      marginBottom: 8,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
    },

    emptyText: {
      textAlign: "center",
      marginTop: 40,
      fontSize: 16,
      color: "#aaa",
    },

  });