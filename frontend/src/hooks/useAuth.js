
// import useStore from "./useStore";

import { useSelector } from "react-redux";

export const useAuth = () => {
    const user = useSelector((state) => state.user);
    console.log(user)
    return {
        isAuthenticated: !!user?.token, user, token: user?.token
    };
};
