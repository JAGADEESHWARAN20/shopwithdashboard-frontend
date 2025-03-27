import { Category } from "@/types";

interface MainNavProps {
     data: Category[];
}

const MainNav = ({ data }: MainNavProps) => {
     return (
          <div>
               {data.map((category) => (
                    <span key={category.id}>{category.name}</span> // Adjust rendering as needed
               ))}
          </div>
     );
};

export default MainNav;