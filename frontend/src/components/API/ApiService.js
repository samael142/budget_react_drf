import axios from "axios";

export default class ApiService {

    static getUrl() {
        return "http://127.0.0.1:8000/api/"
    }

    static async getTransactions(date) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}transactions/`,
            {
                params: {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1
                }
            })
        return responseTransactions.data
    }

    // static getTransactions(date) {
    //     return axios.get(`${ApiService.getUrl()}transactions/`,
    //         { params: { 'year': date.getFullYear(), month: date.getMonth() + 1 } })
    //     // return responseTransactions.data
    // }

    static async getTotals(date) {
        const responseTotals = await axios.get(`${ApiService.getUrl()}total_balance/`,
            { params: { 
                year: date.getFullYear(), 
                month: date.getMonth() + 1 
            } })
        return responseTotals.data
    }

    // static getTotals(date) {
    //     return axios.get(`${ApiService.getUrl()}total_balance/`,
    //         { params: { 'year': date.getFullYear(), month: date.getMonth() + 1 } })
    // }

    static async getHeaders() {
        const responseHeaders = await axios.get(`${ApiService.getUrl()}headers/`)
        return Array.from(responseHeaders.data, x => x.name)
    }

    static async getCategories() {
        const responseCategories = await axios.get(`${ApiService.getUrl()}categories/`)
        return Array.from(responseCategories.data, x => x.name)
    }

    static async getSubcategories() {
        const responseSubcategories = await axios.get(`${ApiService.getUrl()}subcategories/`)
        return Array.from(responseSubcategories.data, x => x.name)
    }

    static async getMoneyAccounts() {
        const responseMoneyAccounts = await axios.get(`${ApiService.getUrl()}ma_list/`)
        return responseMoneyAccounts.data
    }

    static async postTransaction(transaction) {
        const resp = await axios.post(`${ApiService.getUrl()}transactions/`, transaction)
        return resp
    }

    static async patchTransaction(transaction, id) {
        const resp = await axios.patch(`${ApiService.getUrl()}transactions/${id}/`, transaction)
        return resp
    }

    static async patchMoneyAccount(moneyAccount, id) {
        const resp = await axios.patch(`${ApiService.getUrl()}money_accounts/${id}/`, moneyAccount)
        return resp
    }

    static async deleteTransaction(id) {
        const resp = await axios.delete(`${ApiService.getUrl()}transactions/${id}/`)
        return resp
    }

    static async deleteTransfer(id) {
        const resp = await axios.delete(`${ApiService.getUrl()}transactions/`,
        { params: { 'transfer_id': id } })
        return resp
    }


    static postPlainOperation(transaction) {
        axios.post(`${ApiService.getUrl()}plain_operations/`, transaction)
    }

    static async getLastHeaderTransaction(header) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { params: { 'last_header': header } })
        return response
    }

    static async getTransactionById(transactionId) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { params: { 'transaction_id': transactionId } })
        return response
    }

    static async getTransfer(transferId) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { params: { 'transfer_id': transferId } })
        return response.data
    }
}
