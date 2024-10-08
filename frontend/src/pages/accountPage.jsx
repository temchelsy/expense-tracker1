import React, { useEffect, useState } from 'react';
import useStore from '../../stores'; // Assuming this is where you're managing the user state
import { RiVisaLine } from 'react-icons/ri';
import { FaBtc, FaPaypal } from 'react-icons/fa'; 
import { MdAdd } from 'react-icons/md'; 
import Title from '../components/title';
import { toast } from 'sonner'; // Notification system
import api, { setAuthToken } from '../libs/apiCall'; // API call helper and token management
import Loading from '../components/loading';

// Define account icons
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
  const { user } = useStore((state) => state); // Access user info from the store

  // State management
  const [isOpen, setIsOpen] = useState(false); // Modal for adding accounts
  const [isOpenTopup, setIsOpenTopup] = useState(false); // Modal for topping up accounts
  const [isOpenTransfer, setIsOpenTransfer] = useState(false); // Modal for transferring funds
  const [selectedAccount, setSelectedAccount] = useState(''); // Selected account for actions
  const [data, setData] = useState([]); // Account data
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching data

  // Fetch account data
  const fetchAccounts = async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await api.get('account'); // API call to fetch account data
      console.log('Fetched Accounts:', res?.data); // Log the data for debugging
      setData(res?.data); // Store the fetched account data in state
    } catch (error) {
      console.error('Error fetching accounts:', error?.response || error.message);
      toast.error(error?.response?.data?.message || 'Failed to fetch accounts'); // Show error message
    } finally {
      setIsLoading(false); // Stop loading after request
    }
  };

  // Fetch accounts on component mount
  useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token); // Set the authorization token for API requests
      fetchAccounts(); // Fetch account data
    } else {
      toast.error('User not authenticated');
    }
  }, [user]);

  return (
    <>
      <div className='w-full py-10'>
        {/* Page title and Add button */}
        <div className='flex items-center justify-between'>
          <Title title='Accounts Information' /> 
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setIsOpen(true)} // Open the modal to add an account
              className='py-1.5 px-2 rounded bg-black dark:bg-violet-600 text-white dark:text-white flex items-center justify-center gap-2 border border-gray-500'
            >
              <MdAdd size={22} /> <span>Add</span>
            </button>
          </div>
        </div>

        {/* Display loading indicator if data is being fetched */}
        {isLoading ? (
          <div className='w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg'>
            <span>Loading Accounts...</span>
          </div>
        ) : data.length === 0 ? (
          /* If no accounts are found */
          <div className='w-full flex items-center justify-center py-10 text-gray-600 dark:text-gray-700 text-lg'>
            <span>No Account Found</span>
          </div>
        ) : (
          /* Display accounts if data is available */
          <div className='w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6'>
            {data.map((acc, index) => (
              <div
                key={index}
                className='w-full h-48 flex gap-4 bg-gray-50 dark:bg-slate-800 rounded shadow'
              >
                {/* Display the account icon */}
                <div>
                  {ICONS[acc?.account_name?.toLowerCase()] || (
                    <div className='w-12 h-12 bg-gray-400 rounded-full'></div>
                  )}
                </div>
                {/* Display account information */}
                <div className='space-y-2 w-full'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <p className='text-black dark:text-white text-2xl font-bold'>
                        {acc?.account_name || 'N/A'}
                      </p>
                    </div>
                    {/* Account actions: Top up or Transfer */}
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => {
                          setSelectedAccount(acc); // Set selected account for top-up
                          setIsOpenTopup(true); // Open top-up modal
                        }}
                        className='text-blue-600 hover:underline'
                      >
                        Top Up
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAccount(acc); // Set selected account for transfer
                          setIsOpenTransfer(true); // Open transfer modal
                        }}
                        className='text-green-600 hover:underline'
                      >
                        Transfer
                      </button>
                    </div>
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Balance: {acc?.balance || 0} USD {/* Display account balance */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AccountPage;
