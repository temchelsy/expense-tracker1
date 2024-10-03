import { getMonthName } from "../libs/index.js";
import { pool } from "../libs/database.js";

// Get Transactions Controller
export const getTransactions = async (req, res) => {
  try {
    const today = new Date();
    const _sevenDaysAgo = new Date(today);
    _sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];

    const { df, dt, s } = req.query;
    const { id: userId } = req.user; // Get userId from req.user

    const startDate = new Date(df || sevenDaysAgo);
    const endDate = new Date(dt || new Date());

    const transactions = await pool.query({
      text: `SELECT * FROM tbltransaction 
             WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 
             AND (description ILIKE '%' || $4 || '%' 
                  OR status ILIKE '%' || $4 || '%' 
                  OR source ILIKE '%' || $4 || '%') 
             ORDER BY id DESC`,
      values: [userId, startDate, endDate, s],
    });

    res.status(200).json({
      status: "success",
      data: transactions.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Get Dashboard Information Controller
export const getDashboardInformation = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get userId from req.user

    let totalIncome = 0;
    let totalExpense = 0;

    // Fetch transactions grouped by type (income/expense)
    const transactionsResult = await pool.query({
      text: `SELECT type, SUM(amount) AS totalamount 
             FROM tbltransaction 
             WHERE user_id = $1 
             GROUP BY type`,
      values: [userId],
    });

    const transactions = transactionsResult.rows;

    // Calculate total income and expenses
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.totalamount;
      } else {
        totalExpense += transaction.totalamount;
      }
    });

    const availableBalance = totalIncome - totalExpense;

    // Aggregate transactions by month
    const year = new Date().getFullYear();
    const start_Date = new Date(year, 0, 1); // January 1st of the year
    const end_Date = new Date(year, 11, 31, 23, 59, 59); // December 31st of the year

    const result = await pool.query({
      text: `SELECT EXTRACT(MONTH FROM createdat) AS month, type, SUM(amount) AS totalamount 
             FROM tbltransaction 
             WHERE user_id = $1 
             AND createdat BETWEEN $2 AND $3 
             GROUP BY EXTRACT(MONTH FROM createdat), type`,
      values: [userId, start_Date, end_Date],
    });

    // Organize monthly income and expenses
    const data = new Array(12).fill().map((_, index) => {
      const monthData = result.rows.filter(
        (item) => parseInt(item.month) === index + 1
      );

      const income =
        monthData.find((item) => item.type === "income")?.totalamount || 0;
      const expense =
        monthData.find((item) => item.type === "expense")?.totalamount || 0;

      return {
        label: getMonthName(index),
        income,
        expense,
      };
    });

    // Fetch last 5 transactions
    const lastTransactionsResult = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
      values: [userId],
    });

    const lastTransactions = lastTransactionsResult.rows;

    // Fetch last 4 accounts
    const lastAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
      values: [userId],
    });

    const lastAccount = lastAccountResult.rows;

    res.status(200).json({
      status: "success",
      availableBalance,
      totalIncome,
      totalExpense,
      chartData: data,
      lastTransactions,
      lastAccount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Add Transaction Controller
export const addTransaction = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get userId from req.user
    const { id: accountId } = req.params; // Get account id from the URL parameters
    const { description, source, amount } = req.body;

    // Validate input
    if (!description || !source || !amount) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide all required fields.",
      });
    }

    const newAmount = Number(amount);
    if (newAmount <= 0) {
      return res.status(400).json({
        status: "failed",
        message: "Amount should be greater than 0.",
      });
    }

    // Check if the account exists
    const accountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [accountId],
    });

    const accountInfo = accountResult.rows[0];
    if (!accountInfo) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid account information.",
      });
    }

    // Check for sufficient balance (if applicable)
    if (accountInfo.account_balance < newAmount) {
      return res.status(403).json({
        status: "failed",
        message: "Transaction failed. Insufficient account balance.",
      });
    }

    // Begin Transaction
    await pool.query("BEGIN");

    // Update account balance
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, accountId],
    });

    // Insert into transactions
    const transactionResult = await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) 
             VALUES($1, $2, 'expense', 'Completed', $3, $4) RETURNING *`,
      values: [userId, description, newAmount, source],
    });

    // Commit Transaction
    await pool.query("COMMIT");

    res.status(200).json({
      status: "success",
      message: "Transaction completed successfully.",
      data: transactionResult.rows[0], // Return the transaction data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Transfer Money to Account Controller
export const transferMoneyToAccount = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get userId from req.user
    const { from_account, to_account, amount } = req.body;

    if (!(from_account || to_account || amount)) {
      return res.status(403).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const newAmount = Number(amount);

    if (newAmount <= 0)
      return res.status(403).json({
        status: "failed",
        message: "Amount should be greater than 0.",
      });

    // Check 'from_account' details and balance
    const fromAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [from_account],
    });

    const fromAccount = fromAccountResult.rows[0];

    if (!fromAccount) {
      return res.status(404).json({
        status: "failed",
        message: "Account information not found.",
      });
    }

    if (newAmount > fromAccount.account_balance) {
      return res.status(403).json({
        status: "failed",
        message: "Transfer failed. Insufficient account balance.",
      });
    }

    // Begin transaction
    await pool.query("BEGIN");

    // Transfer from 'from_account'
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [newAmount, from_account],
    });

    // Transfer to 'to_account'
    const toAccount = await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [newAmount, to_account],
    });

    // Insert transaction records
    const description = `Transfer (${fromAccount.account_name} - ${toAccount.rows[0].account_name})`;
    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) 
             VALUES($1, $2, $3, $4, $5, $6)`,
      values: [userId, description, "expense", "Completed", amount, fromAccount.account_name],
    });

    const description1 = `Received (${fromAccount.account_name} - ${toAccount.rows[0].account_name})`;
    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) 
             VALUES($1, $2, $3, $4, $5, $6)`,
      values: [userId, description1, "income", "Completed", amount, toAccount.rows[0].account_name],
    });

    // Commit transaction
    await pool.query("COMMIT");

    res.status(200).json({
      status: "success",
      message: "Transfer completed successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
