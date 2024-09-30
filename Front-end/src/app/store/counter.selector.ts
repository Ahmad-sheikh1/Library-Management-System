import { AppState } from "./counter.state";



export const selectAllBooksState = (state : AppState) => state.AllBooks;

export const selectLoginData = (state : AppState) => state.LoginData;