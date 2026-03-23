import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

const width = Dimensions.get("window").width;

export default function SegmentControl({ routes, index, setIndex }: any) {

  const translateX = useRef(new Animated.Value(0)).current;
  const tabWidth = (width - 32) / routes.length;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
    }).start();
  }, [index]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        
        {/* sliding pill */}
        <Animated.View
          style={[
            styles.activePill,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        {routes.map((route: any, i: number) => (
          <TouchableOpacity
            key={route.key}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => setIndex(i)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, index === i && styles.activeLabel]}>
              {route.title}
            </Text>
          </TouchableOpacity>
        ))}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 12,
    // marginBottom : 8
  },

  wrapper: {
    flexDirection: "row",
    backgroundColor: "#1c1c1e",
    borderRadius: 25,
    position: "relative",
    overflow: "hidden",
  },

  tab: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    color: "#aaa",
    fontWeight: "600",
  },

  activeLabel: {
    color: "#000",
  },

  activePill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#44eb2e",
    borderRadius: 25,
  },
});