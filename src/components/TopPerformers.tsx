import React from "react";
import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { useTheme, useThemedStyles } from "../theme";
import { useTheme, useThemedStyles  } from "@/src/theme";

export interface TopPerformer {
  agent_id: number;
  agent_name: string;
  sales_count: number;
  agent_profile: string;
}

interface Props {
  data: TopPerformer[];
  onShowMore?: () => void;
}

export const TopPerformers = ({ data, onShowMore }: Props) => {
// export const TopPerformers = ({ data }: Props) => {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!data?.length) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} >Top Performers</Text>
        {onShowMore && (
          <TouchableOpacity onPress={onShowMore}>
            <Text style={styles.showMore}>
              {/* <Ionicons name="arrow-forward-circle-outline" color="#fff" size={24} /> */}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />
    

      {/* Cards */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.agent_id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.agent_profile }}
              style={styles.avatar}
            />

            <Text style={styles.name} numberOfLines={1}>
              {item.agent_name}
            </Text>

            <Text style={styles.subtitle}>
              {item.sales_count} Sale{item.sales_count > 1 ? "s" : ""}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export const TodayTopPerformers = ({ data }: Props) => {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!data?.length) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Today Top Performers</Text>

        {/* {onShowMore && (
          <TouchableOpacity onPress={onShowMore}>
            <Text style={styles.showMore}>Show More</Text>
          </TouchableOpacity>
        )} */}
      </View>

      <View style={styles.divider} />
      

      {/* Cards */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.agent_id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.agent_profile }}
              style={styles.avatar}
            />

            <Text style={styles.name} numberOfLines={1}>
              {item.agent_name}
            </Text>

            <Text style={styles.subtitle}>
              {item.sales_count} Sale{item.sales_count > 1 ? "s" : ""}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

import { StyleSheet } from "react-native";
import type { Theme } from "@/src/theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const createStyles = (theme: Theme) =>
  StyleSheet.create({
   container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      padding: theme.spacing.md,
      marginTop: 8,
    },

    header: {
      flexDirection: "row",
      justifyContent: 'space-between',
      alignItems: "center",
      marginBottom: 8,
    },

    list: {
      alignItems: 'center',
    },

    card: {
      width: Platform.OS === "ios" ? 100 : 150,
      borderRadius: 16,
      marginRight: 12,
      alignItems: "center",
      justifyContent: "center",

      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },


    title: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },

    showMore: {
      fontSize: 14,
      color: theme.colors.accent,
      fontWeight: "600",
    },
    
    
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      marginBottom: 12,
      backgroundColor: theme.colors.border,
    },
    
    divider: {
        height: 1,
        backgroundColor: "#464646",
        marginVertical: 14,
    },
    name: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },

    subtitle: {
      fontSize: 12,
      color: theme.colors.primary, // .textMuted
    },
  });
