import axios from "axios";

export default class ApiService {

    static getUrl() {
        return "http://127.0.0.1:8000/api/"
    }

    static getApiHeaders() {
        return { 'Authorization': 'Token ' + localStorage.getItem('token') }
    }

    static async tryFetching() {
        
        try {
            const response = await axios.get(ApiService.getUrl(), { headers: ApiService.getApiHeaders() })
            return response
        } catch (err) {
            return err.response.statusText;
        }

    }

    static async getToken(login, password) {
        const response = await axios.post(`${ApiService.getUrl()}api-token-auth/`, {
            username: login,
            password: password
        })
        return response
    }

    static async getTransactions(date) {
        try {
            const responseTransactions = await axios.get(`${ApiService.getUrl()}transactions/`,
                {
                    headers: ApiService.getApiHeaders(),
                    params: {
                        year: date.getFullYear(),
                        month: date.getMonth() + 1
                    }
                },)
            return responseTransactions.data
        } catch (err) {
            return err.response.statusText;
        }

    }

    static async getTransactionsPerAccount(date, accountId) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}transactions/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    acc: accountId
                }
            })
        return responseTransactions.data
    }

    static async getTotals(date) {
        try {
            const responseTotals = await axios.get(`${ApiService.getUrl()}total_balance/`,
                {
                    headers: ApiService.getApiHeaders(),
                    params: {
                        year: date.getFullYear(),
                        month: date.getMonth() + 1
                    }
                })
            return responseTotals.data
        } catch (err) {
            return err.response.statusText;
        }
    }

    static async getTotalsPerAccount(date, accountId) {
        const responseTotals = await axios.get(`${ApiService.getUrl()}total_balance_per_account/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    acc: accountId
                }
            })
        return responseTotals.data
    }

    static async getHeadersRating() {
        const response = await axios.get(`${ApiService.getUrl()}headers_rating/`, { headers: ApiService.getApiHeaders() })
        return Array.from(response.data, x => x.name)
    }

    static async getHeaders() {
        const responseHeaders = await axios.get(`${ApiService.getUrl()}headers/`, { headers: ApiService.getApiHeaders() })
        return Array.from(responseHeaders.data, x => x.name)
    }

    static async getCategories() {
        const responseCategories = await axios.get(`${ApiService.getUrl()}categories/`, { headers: ApiService.getApiHeaders() })
        return Array.from(responseCategories.data, x => x.name)
    }

    static async getCategoriesWithId() {
        const responseCategories = await axios.get(`${ApiService.getUrl()}categories/`, { headers: ApiService.getApiHeaders() })
        return responseCategories.data
    }

    static async getSubcategories() {
        const responseSubcategories = await axios.get(`${ApiService.getUrl()}subcategories/`, { headers: ApiService.getApiHeaders() })
        return Array.from(responseSubcategories.data, x => x.name)
    }

    static async getMoneyAccounts() {
        const responseMoneyAccounts = await axios.get(`${ApiService.getUrl()}ma_list/`, { headers: ApiService.getApiHeaders() })
        return responseMoneyAccounts.data
    }

    static async postTransaction(transaction) {
        const resp = await axios.post(`${ApiService.getUrl()}transactions/`, transaction, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async patchTransaction(transaction, id) {
        const resp = await axios.patch(`${ApiService.getUrl()}transactions/${id}/`, transaction, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async patchMoneyAccount(moneyAccount, id) {
        const resp = await axios.patch(`${ApiService.getUrl()}money_accounts/${id}/`, moneyAccount, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async deleteTransaction(id) {
        const resp = await axios.delete(`${ApiService.getUrl()}transactions/${id}/`, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async deleteTransfer(id) {
        const resp = await axios.delete(`${ApiService.getUrl()}transactions/`,
            { headers: ApiService.getApiHeaders(), params: { 'transfer_id': id } })
        return resp
    }


    static async postPlainOperation(transaction) {
        await axios.post(`${ApiService.getUrl()}plain_operations/`, transaction, { headers: ApiService.getApiHeaders(), })
    }

    static async getLastHeaderTransaction(header) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { headers: ApiService.getApiHeaders(), params: { 'last_header': header } })
        return response
    }

    static async getTransactionById(transactionId) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { headers: ApiService.getApiHeaders(), params: { 'transaction_id': transactionId } })
        return response
    }

    static async getTransfer(transferId) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { headers: ApiService.getApiHeaders(), params: { 'transfer_id': transferId } })
        return response.data
    }

    static async getReportData(category, start, end) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}report/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    category: category,
                    start: start,
                    end: end
                }
            })
        return responseTransactions.data
    }

    static async getExcludeReportData(category, month) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}ex_report/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    category: category,
                    month: month,
                }
            })
        return responseTransactions.data
    }

    static async getTransactionsForModal(category, operationDate) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}transactions/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    category: category,
                    date: operationDate,
                    past: false
                }
            })
        return responseTransactions.data
    }

    static async postMoneyAccount(moneyAccount) {
        const resp = await axios.post(`${ApiService.getUrl()}money_accounts/`, moneyAccount, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async getStatisticData(start, end, category) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}statistic/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    start: start,
                    end: end,
                    category: category
                }
            })
        return responseTransactions.data
    }

    static async getTransactionsForLast20() {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}transactions/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    last20: true
                }
            })
        return responseTransactions.data
    }

    static async getTransactionsForFilter(params) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}transactions/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    ...params,
                    filter: true
                }
            })
        return responseTransactions.data
    }

    static async getBudgets() {
        const response = await axios.get(`${ApiService.getUrl()}budget/`, { headers: ApiService.getApiHeaders(), })
        return response.data
    }

    static async getBudgetById(id) {
        const response = await axios.get(`${ApiService.getUrl()}budget/${id}/`, { headers: ApiService.getApiHeaders(), })
        return response.data

    }

    static async postBudget(budget) {
        const resp = await axios.post(`${ApiService.getUrl()}budget/`, budget, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async getBudgetDetail(start, end, category, summ) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}budget_detail/`,
            {
                headers: ApiService.getApiHeaders(),
                params: {
                    start: start,
                    end: end,
                    category: category,
                    summ: summ
                }
            })
        return responseTransactions.data
    }

    static async patchBudget(budget, id) {
        const resp = await axios.patch(`${ApiService.getUrl()}budget/${id}/`, budget, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async deleteBudget(id) {
        const resp = await axios.delete(`${ApiService.getUrl()}budget/${id}/`, { headers: ApiService.getApiHeaders(), })
        return resp
    }

    static async getPlainOperations() {
        const response = await axios.get(`${ApiService.getUrl()}plain_operations/`, { headers: ApiService.getApiHeaders(), })
        return response.data
    }

    static async getPlainOperationById(plainOperationId) {
        const response = await axios.get(`${ApiService.getUrl()}plain_operations/${plainOperationId}`, { headers: ApiService.getApiHeaders(), })
        return response.data
    }

    static async getPlainTransactions(plainOperationId) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { headers: ApiService.getApiHeaders(), params: { 'plain_id': plainOperationId } })
        return response.data
    }

    // static async deletePlainOperation(id) {
    //     await axios.delete(`${ApiService.getUrl()}transactions/`,
    //         { params: { 'plain_id': id } })
    // }
    static async deletePlainOperation(id) {
        await axios.delete(`${ApiService.getUrl()}plain_operations/${id}`, { headers: ApiService.getApiHeaders(), })
    }
}
