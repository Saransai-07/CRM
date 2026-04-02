import { getToken, removeToken, saveToken } from "@/src/lib/secureStorage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface LoginResponse{
access: string;
  refresh: string;
  userData: any;
  userProfileData: any;
  is_firstlogin: boolean;
  userAbilities: any[];
}
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (data: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  BASE_URL : string;
}

const AuthContext  = createContext<AuthContextType | null>(null);

export const AuthProvider : React.FC<{children: React.ReactNode}> = ({children,}) =>{
    const [authState, SetAuthState] =useState<AuthState>({
        isAuthenticated : false,
        accessToken: null,
        user : null,
    });

    const [loading, setLoading] = useState(true);
    // // const BASE_URL = "http://202.65.141.178:8025";
    // const BASE_URL = "http://10.10.8.13:8025/";
    const BASE_URL = "https://app.srichaitanyacrm.com";



 // Auto login on app start
    useEffect(()=>{
        const loadTokens = async () =>{
            const accessToken : any = await getToken('ACCESS_TOKEN');
            const userDataRaw = await getToken('USER_PROFILE_DATA');
            let userProfileData: any = null;
            if (userDataRaw) {
                try {
                    userProfileData = JSON.parse(userDataRaw);
                } catch {
                    userProfileData = null;
                }
            }

            if (accessToken ){
                SetAuthState({
                    isAuthenticated : true,
                    accessToken,
                    user : userProfileData,
                });
            }
            setLoading(false);
        };
        loadTokens();
    },[]);

    //  Login 

    const login = async (data: LoginResponse) => {
        await saveToken("ACCESS_TOKEN", data.access);
        await saveToken(
            "USER_PROFILE_DATA",
            data.userProfileData != null ? JSON.stringify(data.userProfileData) : ""
        );

        SetAuthState({
        isAuthenticated: true,
        accessToken: data.access,
        user: data.userProfileData,
        });
    };

    // Logout 
    const logout = async () => {
        await removeToken("ACCESS_TOKEN");
        await removeToken('USER_PROFILE_DATA');

        SetAuthState({
        isAuthenticated: false,
        accessToken: null,
        user: null,
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, loading, BASE_URL }}>
          {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be use inside Authprovider");
    }
    return context
}
