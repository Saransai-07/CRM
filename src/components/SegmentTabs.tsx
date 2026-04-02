// import React, { useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Animated,
//   Dimensions,
// } from "react-native";

// const width = Dimensions.get("window").width;

// export default function SegmentControl({ routes, index, setIndex }: any) {

//   const translateX = useRef(new Animated.Value(0)).current;
//   const tabWidth = (width - 32) / routes.length;

//   useEffect(() => {
//     Animated.spring(translateX, {
//       toValue: index * tabWidth,
//       useNativeDriver: true,
//     }).start();
//   }, [index]);

//   return (
//     <View style={styles.container}>
//       <View style={styles.wrapper}>
        
//         {/* sliding pill */}
//         <Animated.View
//           style={[
//             styles.activePill,
//             {
//               width: tabWidth,
//               transform: [{ translateX }],
//             },
//           ]}
//         />

//         {routes.map((route: any, i: number) => (
//           <TouchableOpacity
//             key={route.key}
//             style={[styles.tab, { width: tabWidth }]}
//             onPress={() => setIndex(i)}
//             activeOpacity={0.8}
//           >
//             <Text style={[styles.label, index === i && styles.activeLabel]}>
//               {route.title}
//             </Text>
//           </TouchableOpacity>
//         ))}

//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 16,
//     marginTop: 12,
//     // marginBottom : 8
//   },

//   wrapper: {
//     flexDirection: "row",
//     backgroundColor: "#1c1c1e",
//     borderRadius: 25,
//     position: "relative",
//     overflow: "hidden",
//   },

//   tab: {
//     paddingVertical: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   label: {
//     color: "#aaa",
//     fontWeight: "600",
//   },

//   activeLabel: {
//     color: "#000",
//   },

//   activePill: {
//     position: "absolute",
//     height: "100%",
//     backgroundColor: "#44eb2e",
//     borderRadius: 25,
//   },
// });


import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface Route {
  name: string;
  title: string;
  badge?: number;
}

export default function SegmentControl({
  routes,
  index,
  setIndex,
  layoutWidth,
}: {
  routes: Route[];
  index: number;
  setIndex: (i: number) => void;
  layoutWidth: number;
}) {
  const tabWidth = (layoutWidth - 32) / routes.length;

  const translateX = useSharedValue(index * tabWidth);

  useEffect(() => {
    translateX.value = withSpring(index * tabWidth, {
      damping: 15,
      stiffness: 120,
    });
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Animated.View
          style={[
            styles.activePill,
            { width: tabWidth },
            animatedStyle,
          ]}
        />

        {routes.map((route, i) => (
          <TouchableOpacity
            key={route.name}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => setIndex(i)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={[styles.label, index === i && styles.activeLabel]}>
                {route.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginTop: 12 },
  wrapper: {
    flexDirection: "row",
    backgroundColor: "#1c1c1e",
    borderRadius: 25,
    overflow: "hidden",
  },
  tab: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { color: "#aaa", fontWeight: "600" },
  activeLabel: { color: "#000" },
  activePill: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#44eb2e",
    borderRadius: 25,
  },

  // 🔴 Badge styles
  badge: {
    marginLeft: 6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});