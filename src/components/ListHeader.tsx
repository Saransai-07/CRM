import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";

type HeaderSearchProps = {
  title?: string | string[];
  placeholder?: string;
  onSearchChange?: (text: string) => void;
  showSearch?: boolean;
};

const HeaderSearch = ({
  title = "Title",
  placeholder = "Search...",
  onSearchChange,
  showSearch = true,
}: HeaderSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchvalue, setSearchValue] = useState("");

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchValue("");
      onSearchChange?.("");
    }
  };

  const handleChange = (searchText: string) => {
    setSearchValue(searchText);
    onSearchChange?.(searchText);
  };

  return (
    <View style={styles.container}>
      {isSearching ? (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            value={searchvalue}
            onChangeText={handleChange}
            placeholder={placeholder}
            placeholderTextColor="#999"
            style={styles.input}
            autoFocus
          />
          <Pressable onPress={handleSearchToggle}>
            <Ionicons name="close" size={20} color="#a450ff" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          {showSearch && (
            <Pressable onPress={handleSearchToggle} hitSlop={10}>
              <Ionicons name="search" size={22} color="#a450ff" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

export default HeaderSearch;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: "#fff",
    fontSize: 16,
  },
});
