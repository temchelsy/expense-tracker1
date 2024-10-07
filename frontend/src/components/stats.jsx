import { IoAlbumsOutline } from "react-icons/io5";
import { SiCashapp } from 'react-icons/si'; 
import { formatCurrency } from "../libs";



const ICONS_STYLES = [
  'bg-blue-300 text-blue-800',
  'bg-gray-600 text-gray-300', 
  'bg-rose-400 text-rose-800'
];

const stats = ({ dt }) => { 
  const data = [
    {
      label: 'Total Balance', 
      amount: dt?.balance,
      increase: 10.9,
      icon: <IoAlbumsOutline size={26} /> 
    },
    {
      label: 'Total Expense', 
      amount: dt?.expense,
      increase: 10.9,
      icon: <SiCashapp size={26} /> 
    },
    {
      label: 'Total Income', 
      amount: dt?.income,
      increase: 8.9,
      icon: <IoAlbumsOutline size={26} /> 
    }
  ];

  const ItemCard = ({ item, index }) => {  
    return (
      <div className='flex items-center justify-between w-full h-48 gap-5 px-4 py-12 shadow-lg 2xl:min-w-1/3 2xl:px-8 border'>
        {/* Corrected Card to div, fixed class names */}
        <div className="flex items-center w-full h-full gap-4">
          <div className={`w-12 h-12 flex justify-center rounded-full ${ICONS_STYLES[index]}`}>
            {item.icon}
          </div>
          <div className="space-y-3">
            <span className="text-base text-gray-600 md:text-gray-400">
              {item.label}
            </span>
            <p className="text-2xl font-medium text-black 2xl:text-gray-400">
              {formatCurrency(item?.amount || 0.0)}
            </p>
            <span className="text-xs text-gray-600 md:text-sm 2xl:text-base">
              Overall {item.label}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {data.map((item, index) => (
        <ItemCard key={index} item={item} index={index} />
      ))}
    </div>
  );
};

export default stats;
