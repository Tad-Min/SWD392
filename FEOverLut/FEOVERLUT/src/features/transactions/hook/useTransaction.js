import { useState } from 'react';
import { getTransactionsApi, createTransactionApi } from '../api/transactionApi';

export const useTransaction = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTransactions = async (params) => {
        setLoading(true);
        setError(null);
        try {
            return await getTransactionsApi(params);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tải lịch sử giao dịch";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    const createTransaction = async (data) => {
        setLoading(true);
        setError(null);
        try {
            return await createTransactionApi(data);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Lỗi tạo giao dịch";
            setError(errorMsg);
            throw errorMsg;
        } finally {
            setLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getTransactions,
        createTransaction
    };
};
