import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
    // 1. Get the current user from the API or context  
    // 2. Return the user data and any relevant functions (e.g., logout)
    
    const {isLoading,  data: user} = useQuery({
        queryKey: ["user"],
        queryFn: getCurrentUser,
    });
    return { user, isLoading , isAuthenticated: user?. role === "authenticated"};
}