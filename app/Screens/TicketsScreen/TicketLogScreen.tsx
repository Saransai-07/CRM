import {
  View,
  Text,
  StyleSheet,
  SectionList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { router, useLocalSearchParams } from "expo-router";
import { getToken } from "@/src/lib/secureStorage";
import { Theme, useThemedStyles } from "@/src/theme";
import {
  PreviousYearTicketLogItem,
  TicketLogItem,
} from "@/src/components/Tickets/TicketLogComponent";
import { useAudioPlayerContext } from "@/src/context/AudioPlayerContext";

const TicketLogScreen = () => {
  const { id } = useLocalSearchParams();
  const { logout, BASE_URL } = useAuth();
  const { pause } = useAudioPlayerContext();
  const styles = useThemedStyles(createStyles);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [sections, setSections] = useState<any[]>([]);

  // 🔹 Load token
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

      // Fetch ticket
      const ticketRes = await fetch(
        `${BASE_URL}/wizklub/ticket_operations/${id}/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const ticketData = await ticketRes.json();
      const ticketId = ticketData.ticket_id;

      // Parallel fetch
      const [logsRes, prevLogsRes] = await Promise.all([
        fetch(
          `${BASE_URL}/wizklub/wizklub_ticket_logs_by_ticket/${ticketId}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ),
        fetch(
          `${BASE_URL}/wizklub/previous_year_wizklub_ticket_logs_details/${id}/`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        ),
      ]);

      const logsData = logsRes.ok ? await logsRes.json() : { results: [] };
      const prevData = prevLogsRes.ok ? await prevLogsRes.json() : [];

      // Transform into SectionList format
      const formattedSections = [
        {
          title: "This Year Ticket Logs",
          type: "current",
          data: logsData.results || [],
        },
        ...prevData.map((item: any) => ({
          title: "2025-2026",
          type: "previous",
          data: item.logs,
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
          keyExtractor={(item) => item.ticket_log_id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onScrollBeginDrag={pause}
          onMomentumScrollBegin={pause}
          renderItem={({ item, section }) =>
            section.type === "current" ? (
              <TicketLogItem item={item} />
            ) : (
              <PreviousYearTicketLogItem item={item} />
            )
          }
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {section.title} ({section.data.length})
              </Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>❎ No Ticket Logs Found</Text>
          )}
        />
      )}
    </View>
  );
};

export default TicketLogScreen;

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