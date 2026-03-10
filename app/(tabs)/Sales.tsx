// screens/AgentReportScreen.tsx

import BranchCard from "@/src/components/ConverstionCard";
import { useAuth } from "@/src/context/AuthContext";
import { Agent, CommomApiInterface } from "@/src/Interface/InterfaceData";
import { getToken } from "@/src/lib/secureStorage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, FlatList } from "react-native";

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
  }, [accessToken, page, search]);


  const fetchData = async (pageNumber: number, search: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/wizklub/wizklub_agent_reports/?page=${pageNumber}&search=${search}`, options);
      const json: CommomApiInterface = await res.json();
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

  const data1 = [

    {
      branch_id: 18,
      name: "ADDANKI",
      zone_name: "Ongole",
      category: "A",
      zone: 18,
      lead_touch_per: "40%",
      branch_new_sales_cvr_per: "32%",
      agent_new_sales_cvr_per: "31%",
      agent_new_sales: 12,
      total_target: 20,
      unique_lead_connected: 10,
      YLP_student_count: 30,
      ist: null,
      branch_renewal_sales: 3,
      agent_renewal_sales: 2,
      branch_new_sales: 3,
      branch_total_sales: 5,
      branch_current_sales_cvr_per: '15%',
      agent_total_sales: 10,
      agent_current_sales_cvr_per : "16%",
      expected_cvr_per: "18%",
      difference_in_cvr_per: '30%',
    },

  ];


  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>

      <FlatList
        data={data1}
        keyExtractor={(item) => item.branch_id.toString()}
        renderItem={({ item }) => (
          <BranchCard item={item} />
        )}
      />

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
