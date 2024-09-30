import { StateI , LoginDataState } from "./counter.reducers";



export interface AppState {
    AllBooks: StateI,
    LoginData : LoginDataState;
}