import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDateSevenDaysAgo } from "../libs";

const DateRange = () => {
    const sevenDaysAgo = getDateSevenDaysAgo();

    const [searchParams, setSearchParams] = useSearchParams();

    const [dateForm, setDateForm] = useState(() => {
        const df = searchParams.get('df'); // Fixed df being accessed as a string
        return df && new Date(df).getTime() <= new Date().getTime()
            ? df
            : sevenDaysAgo || new Date().toISOString().split('T')[0]; // Fix split typo
    });

    const [dateTo, setDateTO] = useState(() => {
        const dt = searchParams.get('dt');
        return dt && new Date(dt).getTime() >= new Date(dateForm).getTime()
            ? dt
            : new Date().toISOString().split('T')[0]; // Fix split typo
    });

    useEffect(() => {
        setSearchParams({ df: dateForm, dt: dateTo });
    }, [dateForm, dateTo]);

    const handleDateFromChange = (e) => {
        const dt = e.target.value;
        setDateTO(dt);
        if (new Date(dt).getTime() < new Date(dateForm).getTime()) {
            setDateForm(dt);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <label 
                    className="block text-gray-700 dark:text-gray-400 text-sm mb-2"
                    htmlFor="datefrom"
                >
                    Filter
                </label>
                <input 
                    className="inputStyles"
                    name="dateFrom"
                    type="date"
                    max={dateTo}
                    value={dateForm}
                    onChange={handleDateFromChange}
                />
            </div>
            <div className="flex items-center gap-1">
                <label
                    className="block text-gray-700 dark:text-gray-400 text-sm mb-2"
                    htmlFor="dateTo"
                >
                    TO
                </label>
                <input 
                    className="inputStyles"
                    name="dateTo"
                    type="date"
                    max={dateTo} // Fix "m" to "max"
                    value={dateTo} // Fix to use correct dateTo value
                    onChange={handleDateFromChange}
                />
            </div>
        </div>
    );
};

export default DateRange;
