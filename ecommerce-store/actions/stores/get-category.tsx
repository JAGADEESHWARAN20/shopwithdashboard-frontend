import { Category } from "@/types";
const URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const getCategory = async (storeid: string, id:string): Promise<Category> => {

     const res = await fetch(`${URL}/api/${storeid}/categories/${id}`);

     return res.json();
}

export default getCategory;

