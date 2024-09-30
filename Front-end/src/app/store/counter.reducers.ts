import { createReducer, on } from "@ngrx/store";
import { AllBooksAction, LoginDataAction } from "./counter.action";


export interface StateI {
    AllBooks: any[]
}

export const initialstate: StateI = {
    AllBooks: []
};

export interface LoginDataState {
    LoginData: any;
}

export const loginInitialState: LoginDataState = {
    LoginData: {}
};

export const reducer = createReducer(
    initialstate,
    on(AllBooksAction, (state, { books }) => ({
        ...state,
        AllBooks: books
    }))
)

export const LoginReducer = createReducer(
    loginInitialState,
    on(LoginDataAction, (state, { LoginData }) => ({
        ...state,
        LoginData : LoginData
    }))
)