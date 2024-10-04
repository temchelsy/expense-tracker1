import React, { useEffect, useState } from 'react';
import useStore from '../../stores';
import { RiVisaLine } from 'react-icons/ri';
import { FaBtc, FaPaypal } from 'react-icons/fa'; 
import { MdAdd } from 'react-icons/md'; 
import Title from '../components/title';
import { toast } from 'react-toastify'; 
import api, { setAuthToken } from '../libs/apiCall';

const ICONS = {
  crypto: (
    <div className='w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full'>
      <FaBtc size={26} />
    </div>
  ),
  'visa debit card': (
    <div className='w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full'>
      <RiVisaLine size={26} />
    </div>
  ),
  cash: (
    <div className='w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full'></div>
  ),
  paypal: (
    <div className='w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full'>
      <FaPaypal size={26} />
    </div>
  ),
};

const AccountPage = () => {
  const { user } = useStore((state) => state); 

  // Define state variables
  const [isOpen, setIsOpen] = useState(false); // Modal for adding accounts
  const [isOpenTopup, setIsOpenTopup] = useState(false); // Modal for topping up accounts
  const [isOpenTransfer, setIsOpenTransfer] = useState(false); // Modal for transferring funds
  const [selectedAccount, setSelectedAccount] = useState(''); // Selected account for actions
  const [data, setData] = useState([]); // Account data
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const fetchAccounts = async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await api.get('account'); 
      setData(res?.data);
    } catch (error) {
      console.error('Error fetching accounts:', error.response || error.message);
      toast.error(error?.response?.data?.message || 'Failed to fetch accounts');
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token); // Set token for authorization
      fetchAccounts(); // Fetch accounts on mount
    } else {
      toast.error('User not authenticated'); // Handle unauthenticated state
    }
  }, [user]); // Fetch accounts whenever user changes

  return (
    <>
      <div className='w-full py-10'>
        <div className='flex items-center justify-between'>
          <Title title='Accounts Information' /> 
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsOpen(true)} // Open the add account modal
              className='py-1.5 px-2 rounded bg-black dark:bg-violet-600 text-white dark:text-white flex items-center justify-center gap-2 border border-gray-500'
            >
              <MdAdd size={22} /> <span>Add</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className='w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg'>
            <span>Loading Accounts...</span>
          </div>
        ) : data.length === 0 ? (
          <div className='w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg'>
            <span>No Account Found</span>
          </div>
        ) : (
          <div className='w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6'>
            {data.map((acc, index) => (
              <div
                key={index}
                className='w-full h-48 flex gap-4 bg-gray-50 dark:bg-slate-800 rounded shadow'
              >
                <div>{ICONS[acc?.account_name?.toLowerCase()] || <div className='w-12 h-12 bg-gray-400 rounded-full'></div>}</div>
                <div className='space-y-2 w-full'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <p className='text-black dark:text-white text-2xl font-bold'>
                        {acc?.account_name}
                      </p>
                    </div>
                    <div>
                      <button onClick={() => {
                          setSelectedAccount(acc); 
                          setIsOpenTopup(true); // Open the top-up modal for this account
                        }}>
                        Top Up
                      </button>
                      <button onClick={() => {
                          setSelectedAccount(acc); 
                          setIsOpenTransfer(true); // Open the transfer modal for this account
                        }}>
                        Transfer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal components would go here, using isOpen, isOpenTopup, isOpenTransfer, etc. */}
    </>
  );
};

export default AccountPage;
