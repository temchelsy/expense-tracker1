import { v4 as uuidv4 } from 'uuid';

export const maskAccountNumber = (accountNumber) => {
    // Ensure accountNumber is a string and has at least 12 characters
    if (typeof accountNumber !== 'string' || accountNumber.length < 12) {
        return accountNumber;
    }
    
    // Extract first and last four digits
    const firstFour = accountNumber.substring(0, 4);
    const lastFour = accountNumber.substring(accountNumber.length - 4); // Fixed subtraction for last four digits
    
    // Mask the middle digits
    const maskedDigits = '*'.repeat(accountNumber.length - 8); // Subtract first and last four digits for mask length

    return `${firstFour}${maskedDigits}${lastFour}`;
};

export const formatCurrency = (value, code) => {
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if value is a valid number
    if (isNaN(value)) {
        return 'Invalid input';
    }

    const numberValue = typeof value === "string" ? parseFloat(value) : value;

    // Format currency with proper Intl.NumberFormat
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: user?.currency || code || 'USD', // Use passed code or user currency or default to 'USD'
        minimumFractionDigits: 2,
    }).format(numberValue);
};

export const getDateSevenDaysAgo = () => {
    const today = new Date();

    // Create a new date object and subtract 7 days
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Convert to string and split into date components
    return sevenDaysAgo.toISOString().split('T')[0]; // Return only the date part (YYYY-MM-DD)
};
