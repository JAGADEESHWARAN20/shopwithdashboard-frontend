// types/index.ts
export interface Billboard {
     id: string;
     label: string;
     imageUrl: string;
     isFeatured?: boolean; // Made optional to match Prisma schema
}

export interface Product {
     id: string;
     name: string;
     price: number; // Matches Prisma Float
     isFeatured: boolean;
     isArchived: boolean;
     images: Image[];
     category: Category;
     size: Size;
     color: Color;
     storeId: string; // Added to match Prisma schema
     createdAt: string; // Added for completeness (Prisma DateTime maps to string in JSON)
     updatedAt: string; // Added for completeness
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

export interface StoreName {
     id: string;
     name: string;
     userId: string;
     storeUrl?: string;
}

export interface User {
     id: string;
     email: string;
     name: string;
     phone?: string;
     address?: string;
     image?: string;
     role: "ADMIN" | "CUSTOMER"; // Made non-optional to match Prisma schema
}

export interface UserProfile {
     id: string;
     email: string;
     name: string;
     phone?: string;
     address?: string;
     image?: string;
     role: "ADMIN" | "CUSTOMER";
}

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