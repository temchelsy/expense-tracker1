import React from 'react';

const DateRange = ({ startDate, endDate, setStartDate, setEndDate }) => {
    return (
        <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex flex-col">
                <label htmlFor="start-date" className="text-sm text-gray-600 dark:text-gray-400">
                    Start Date
                </label>
                <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-700 dark:text-gray-400 bg-transparent"
                />
            </div>
            <div className="flex flex-col">
                <label htmlFor="end-date" className="text-sm text-gray-600 dark:text-gray-400">
                    End Date
                </label>
                <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-700 dark:text-gray-400 bg-transparent"
                />
            </div>
        </div>
    );
};

export default DateRange;
