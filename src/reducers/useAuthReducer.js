import { useReducer } from "react";

function reducer(state, action) {
    switch (action?.type) {
        case "field": {
            return {
                ...state,
                [action.fieldName]: action.payload,
            };
        }
        case "login": {
            return {
                ...state,
                error: "",
                isLoading: true,
            };
        }
        case "success": {
            return {
                ...state,
                isLoggedIn: true,
                isLoading: false,
            };
        }
        case "error": {
            return {
                ...state,
                error: {
                    exists: true,
                    message: "Login e/ou senha inválido(s)!",
                },
                isLoggedIn: false,
                isLoading: false,
            };
        }
        case "clearError": {
            return {
                ...state,
                error: {
                    exists: false,
                    message: "",
                },
            };
        }
        case "logOut": {
            return {
                ...state,
                isLoggedIn: false,
                login: "",
                password: "",
            };
        }
        default:
        return state;
    }
}

const initialState = {
    login: "",
    password: "",
    isLoading: false,
    error: {
        exists: false,
        message: "",
    },
    isLoggedIn: false,
};

export default function useAuthReducer() {
    return useReducer(reducer, initialState);
}