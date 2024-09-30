import { createAction, props } from "@ngrx/store";



export const AllBooksAction = createAction(
    'All Books Counter',
    props<{ books: any[] }>()
);


export const LoginDataAction = createAction(
    'Login Data Counter',
    props<{ LoginData: any }>()
)