"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/auth");
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <p>Loading...</p>; // Or a spinner component
    }

    return <Component {...props} />;
  };
  return AuthComponent;
};

export default withAuth;