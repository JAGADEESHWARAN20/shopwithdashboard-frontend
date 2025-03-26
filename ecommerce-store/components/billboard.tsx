import { Billboard as BillboardType } from "@/types"

interface BillboardProps {
     data: BillboardType
};

const Billboard: React.FC<BillboardProps> = ({ data }) => {
     return (
          <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
               <div
                    className="relative rounded-xl overflow-hidden aspect-square md:aspect-[2.4/1] bg-cover"
                    style={{
                         backgroundImage: `url(${data?.imageUrl})`,
                         backgroundPosition: 'center center'
                    }}
               >
                    <div className="h-full w-full flex flex-col justify-center items-center text-center bg-black bg-opacity-30 p-8">
                         <div className="font-bold text-white max-w-xs md:max-w-xl text-3xl sm:text-5xl lg:text-6xl">
                              {data.label}
                         </div>
                    </div>
               </div>
          </div>
     )
}

export default Billboard
