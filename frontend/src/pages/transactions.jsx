import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../components/loading';
import Title from '../components/title';
import { IoSearchOutline } from 'react-icons/io5';
import { MdAdb } from 'react-icons/md';
import { CiExport } from 'react-icons/ci';
import * as XLSX from 'xlsx'; 
import DateRange from '../components/dataRange';

const Transactions = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenView, setIsOpenView] = useState(false);
    const [Selected, setSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);

    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState(searchParams.get('df') || '');
    const [endDate, setEndDate] = useState(searchParams.get('dt') || '');

    const handleViewTransaction = (el) => {
        setSelected(el);
        setIsOpenView(true);
    };

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const URL = `https://expense-tracker1-mbs9.onrender.com/api-v1/transaction?df=${startDate}&dt=${endDate}&search=${search}`;
            
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed');
                }
                throw new Error('Network response was not ok');
            }

            const res = await response.json();
            setData(res?.data || []);
        } catch (error) {
            console.error(error);
            toast.error(
                error?.message ||
                'Something unexpected happened. Try again later.'
            );

            if (error.message === 'Authentication failed') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        setSearchParams({
            df: startDate,
            dt: endDate,
        });
        await fetchTransactions();
    };

    const exportToExcel = (data, filename) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `${filename}.xlsx`);
    };

    useEffect(() => {
        fetchTransactions();
    }, [startDate, endDate]);

    if (isLoading) return <Loading />;

    return (
        <>
            <div className='w-full py-10'>
                <div className='flex flex-col md:flex-row md:items-center justify-between mb-10'>
                    <Title title='Transactions Activity' />

                    <div className='flex flex-col md:flex-row md:items-center gap-4'>
                        <DateRange 
                            startDate={startDate} 
                            endDate={endDate} 
                            setStartDate={setStartDate} 
                            setEndDate={setEndDate} 
                        />

                        <form onSubmit={handleSearch}>
                            <div className='w-full flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2'>
                                <IoSearchOutline className='text-xl text-gray-600 dark:text-gray-500' />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    type='text'
                                    placeholder='Search now ...'
                                    className='outline-none group bg-transparent text-gray-700 dark:text-gray-400 placeholder:text-gray-600'
                                />
                            </div>
                        </form>

                        <button
                            onClick={() => setIsOpen(true)}
                            className='py-1.5 px-2 rounded text-white bg-black dark:bg-blue-400 flex items-center justify-center gap-2 border'
                        >
                            <MdAdb size={22} />
                            <span>paye</span>
                        </button>
                        
                        <button
                            onClick={() => exportToExcel(data, `transactions_${startDate}_${endDate}`)}
                            className='flex items-center gap-2 text-black dark:text-gray-300'
                        >
                            Export <CiExport size={24} />
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="w-full border-b border-gray-500 dark:border-gray-700">
                            <tr className="w-full text-left text-black dark:text-gray-400">
                                <th className="px-2 py-2">Date</th>
                                <th className="px-2 py-2">Description</th>
                                <th className="px-2 py-2">Source</th>
                                <th className="px-2 py-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((transaction, index) => (
                                <tr key={index} className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="px-2 py-2">{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td className="px-2 py-2">{transaction.description}</td>
                                    <td className="px-2 py-2">{transaction.source || 'N/A'}</td>
                                    <td className="px-2 py-2">${transaction.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {data.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No transactions found.</p>
                )}
            </div>
        </>
    );
};

export default Transactions;