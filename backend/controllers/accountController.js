import { pool } from "../libs/database.js";

export const getAccounts = async (req, res) => {
  try {
    const { userId } = req.body;

    const accounts = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1`,
      values: [userId],
    });

    res.status(200).json({
      status: "success",
      data: accounts.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    // Destructure fields from the request body
    const { userId, name, amount, account_number } = req.body;

    // Validate inputs
    if (!userId || !name || !amount || !account_number) {
      console.log('Validation failed: missing fields', req.body);
      return res.status(400).json({ status: "failed", message: "Missing required fields" });
    }

    // Check if the account already exists
    const accountExistQuery = {
      text: `SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2`,
      values: [name, userId],
    };

    const accountExistResult = await pool.query(accountExistQuery);
    console.log('Existing account check result:', accountExistResult.rows);

    if (accountExistResult.rows.length > 0) {
      console.log('Account already exists, aborting creation');
      return res.status(409).json({ status: "failed", message: "Account already created." });
    }

    // Create the new account
    const createAccountResult = await pool.query({
      text: `INSERT INTO tblaccount(user_id, account_name, account_number, account_balance) VALUES($1, $2, $3, $4) RETURNING *`,
      values: [userId, name, account_number, amount],
    });

    console.log('Create account result:', createAccountResult);

    if (createAccountResult.rows.length === 0) {
      console.log('Failed to create account: no rows returned');
      return res.status(500).json({ status: "failed", message: "Failed to create account." });
    }

    const account = createAccountResult.rows[0];

    // Respond with the account details
    res.status(201).json({
      status: "success",
      message: `${account.account_name} Account created successfully`,
      data: account,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};


export const addMoneyToAccount = async (req, res) => {
  try {
    const { user, amount } = req.body; // Destructure directly from req.body
    const userId = user?.userId; // Use optional chaining to safely extract userId
    const { id } = req.params; // Account ID from the URL parameters

    // Validate inputs
    if (!userId || !id || !amount) {
      console.log('Validation failed: missing fields', req.body);
      return res.status(400).json({ status: "failed", message: "Missing required fields" });
    }

    const newAmount = Number(amount);

    // Update the account balance
    const result = await pool.query({
      text: `UPDATE tblaccount SET account_balance = (account_balance + $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [newAmount, id],
    });

    if (result.rows.length === 0) {
      console.log('Failed to update account balance: no rows returned');
      return res.status(404).json({ status: "failed", message: "Account not found." });
    }

    const accountInformation = result.rows[0];
    const description = `${accountInformation.account_name} (Deposit)`;

    // Insert the transaction
    const transQuery = {
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,  // Ensure this is not null
        description,
        "income",
        "Completed",
        newAmount,
        accountInformation.account_name,
      ],
    };

    const transactionResult = await pool.query(transQuery);
    console.log('Transaction result:', transactionResult);

    res.status(200).json({
      status: "success",
      message: "Operation completed successfully",
      data: accountInformation,
    });
  } catch (error) {
    console.error("Error adding money to account:", error);
    res.status(500).json({ status: "failed", message: error.message });
  }
};
