// screens/AgentReportScreen.tsx

import { AgentTable } from "@/src/components/AgentsTable";
import HeaderSearch from "@/src/components/ListHeader";
import { Pagination } from "@/src/components/Pagination";
import { useAuth } from "@/src/context/AuthContext";
// import { Pagination } from "@/src/components/Pagination";
import { Agent, AgentResponse } from "@/src/Interface/InterfaceData";
import { getToken } from "@/src/lib/secureStorage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { SearchBar } from "react-native-screens";
// import { Agent, AgentResponse } from "../types/agent";
// import { AgentTable } from "../components/AgentTable";
// import { Pagination } from "../components/Pagination";

export default function AgentReportScreen() {
  const { logout, authState, BASE_URL } = useAuth();
  const [data, setData] = useState<Agent[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [search, setSearch] = useState('')
  

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
      setLoading(false);
    };
    loadToken();
  }, []); 

  useEffect(() => {
    if (!accessToken) return;
  
    const loadSales = async () => {
      try {
        setLoading(true);
  
        await Promise.all([
          fetchData(page, search)
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    loadSales();
  }, [accessToken,page, search]);


  const fetchData = async (pageNumber: number, search: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/wizklub/wizklub_agent_reports/?page=${pageNumber}&search=${search}`, options);
      const json: AgentResponse = await res.json();
      setData(json.results);
      setTotalPages(json.total_pages);
      setPage(json.current_page_number);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
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
        title="Agents"
        placeholder="Search Agents...   "
        onSearchChange={(searchText) => {setSearch(searchText), setPage(1)}}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <AgentTable data={data} />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#141414",
  },
});
