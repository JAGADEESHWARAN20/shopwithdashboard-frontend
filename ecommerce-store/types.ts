export interface Category {
     id: string;
     name: string;
     storeId: string;
     billboard?: Billboard;
     billboardId?: string;
     createdAt?: string;
     updatedAt?: string;
}

export interface Billboard {
     id: string;
     label: string;
     imageUrl: string;
}

export interface Product {
     id: string;
     category: Category;
     name: string;
     price: string;
     isFeatured: boolean;
     size: Size;
     color: Color;
     images: Image[];
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