interface Book {
    id: string;
    title: string;
    author: string;
    publisher: string;
    genre: string;
    language: string;
    pages: number;
    quantity: number;
    description: string;
}

export interface ApiResponse {
    status: string;
    data: Book[];
}

export interface LoginApiResponse {
    status: string,
    token: string,
    data: {}
}

export interface BookDetailInterface {
    id: string;
    title: string;
    author: string;
    publisher: string;
    genre: string;
    language: string;
    pages: number;
    quantity: number;
    description: string;
    created_at: string; // or Date, if you prefer to work with Date objects
    updated_at: string; // or Date
}


export interface Genre {
    Gener: string;
    Description: string;
    ImageURL: string;
}