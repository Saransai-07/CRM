import React from "react";
import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme, useThemedStyles } from "@/src/theme";
import { StyleSheet } from "react-native";
import type { Theme } from "@/src/theme";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!data?.length) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Top Performers</Text>

        {onShowMore && (
          <TouchableOpacity onPress={onShowMore}>
            <Text style={styles.showMore}>
               <MaterialCommunityIcons name="arrow-right-circle" color="#000" size={24} />
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* Cards */}
      <View style={styles.row}>
        {data.slice(0, 3).map((item) => (
          <View key={item.agent_id} style={styles.item}>

            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: item.agent_profile }}
                style={styles.avatar}
              />
            </View>

            <Text numberOfLines={1} style={styles.name}>
              {item.agent_name}
            </Text>

            <Text style={styles.subtitle}>
              {item.sales_count} Sales
            </Text>

          </View>
        ))}
      </View>
    </View>
  );
};


export const TodayTopPerformers = ({ data, onShowMore }: Props) => {
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!data?.length) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Today Top Performers</Text>

        {onShowMore && (
          <TouchableOpacity onPress={onShowMore}>
            <Text style={styles.showMore}>
               <MaterialCommunityIcons name="arrow-right-circle" color="#000" size={24} />
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.divider} />

      {/* Cards */}
      <View style={styles.row}>
        {data.slice(0, 3).map((item) => (
          <View key={item.agent_id} style={styles.item}>

            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: item.agent_profile }}
                style={styles.avatar}
              />
            </View>

            <Text numberOfLines={1} style={styles.name}>
              {item.agent_name}
            </Text>

            <Text style={styles.subtitle}>
              {item.sales_count} Sales
            </Text>

          </View>
        ))}
      </View>
    </View>
  );
};



const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#1c1c1e",
      borderRadius: 20,
      paddingVertical: 18,
      paddingHorizontal: 16,
      marginTop: 12,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },

    title: {
      fontSize: 18,
      fontWeight: "700",
      color: "#fff",
    },

    showMore: {
      fontSize: 14,
      fontWeight: "600",
      color: "#9BE870",
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    item: {
      flex: 1,
      alignItems: "center",
    },

    avatarWrapper: {
      width: 70,
      height: 70,
      borderRadius: 18,
      // backgroundColor: "#2c2c2e",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
    },

    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
    },

    name: {
      fontSize: 13,
      fontWeight: "600",
      color: "#fff",
      marginBottom: 2,
      textAlign: "center",
    },
    divider: {
      height: 1,
      backgroundColor: "#464646",
      marginVertical: 4,
    },

    subtitle: {
      fontSize: 12,
      color: "#8e8e93",
    },
  });