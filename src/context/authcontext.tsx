"use client"
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface User {
  id: String;
  username: String;
  email: String;
}
interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: Boolean;
  loading:Boolean;
  revalidate: ()=>void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loading,setLoading]= useState<Boolean>(true)
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false);
  const router= useRouter()
  const fetchUser = async () => {
    const response = await fetch("/api/profile");
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      setUser(data);
      setIsAuthenticated(true);
      setLoading(false)
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchUser();
  },[]);

  const logout = async() => {
    const response=await fetch("api/logout")
    if(response.ok){
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login")
    }
    const data= await response.json()
    console.log("from logout", data);
  };

  const revalidate=async()=>{
     await fetchUser()
  }
  return (
    <AuthContext.Provider value={{user, logout, isAuthenticated, loading, revalidate}}>
      {children}
      </AuthContext.Provider>
  );
};

export const useAuth=()=>{
  const context= useContext(AuthContext);
  if(!context){
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
