import { Redirect, Stack } from "expo-router";
import Login from "./Login";
import { ActivityIndicator } from "react-native";
import { useAuth } from "@/src/context/AuthContext";

export default function authLayout (){
    
    const  { authState, loading } = useAuth();
        if (loading) {
            return <ActivityIndicator size='large'/>
        }
        return authState.isAuthenticated ? <Redirect href={'/(tabs)/DashBoard'}/> : <Login/>;
}