export interface Billboard {
     id: string;
     label: string;
     imageUrl: string;
     isFeatured: boolean;
}

export interface Product {
     id: string;
     name: string;
     price: number;
     isFeatured: boolean;
     isArchived: boolean;
     images: Image[];
     category: { id: string; name: string };
     size: { id: string; name: string; value: string };
     color: { id: string; name: string; value: string };
}

export interface Category {
     id: string;
     name: string;
     billboardId: string;
     storeId: string;
}

export interface Store {
     id: string;
     name: string;
     storeUrl?: string;
     userId: string;
}
// types/auth.ts
export interface User {
     id: string;
     email: string;
     name: string;
     phone?: string;
     address?: string;
     image?: string;
     role?: "ADMIN" | "CUSTOMER";
}

export interface AuthResponse {
     token: string;
     user: User;
}

export interface LogoutResponse {
     success: boolean;
}
// types/auth.ts
export interface UserProfile {
     id: string;
     email: string;
     name: string;
     phone?: string;
     address?: string;
     image?: string;
     role: "ADMIN" | "CUSTOMER";
}

// export interface Product {
//      id: string;
//      category: Category;
//      name: string;
//      price: string;
//      isFeatured: boolean;
//      size: Size;
//      color: Color;
//      images: Image[];
// }

export interface Size {
     id: string;
     name: string;
     value: string;
}

export interface Image {
     id: string;
     url: string;
}

export interface Color {
     id: string;
     name: string;
     value: string;
}