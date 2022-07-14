import axios from "axios";

export default class ApiService {

    static getUrl() {
        return "http://127.0.0.1:8000/api/"
    }

    static async getTransactions(date) {
        const responseTransactions = await axios.get(`${ApiService.getUrl()}transactions/`,
            { params: { 'year': date.getFullYear(), month: date.getMonth() + 1 } })
        return responseTransactions.data
    }

    static async getTotals(date) {
        const responseTotals = await axios.get(`${ApiService.getUrl()}total_balance/`,
            { params: { 'year': date.getFullYear(), month: date.getMonth() + 1 } })
        return responseTotals.data
    }

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
        axios.post(`${ApiService.getUrl()}transactions/`, transaction)
    }

    static async postPlainOperation(transaction) {
        axios.post(`${ApiService.getUrl()}plain_operations/`, transaction)
    }

    static async getLastHeaderTransaction(header) {
        const response = await axios.get(`${ApiService.getUrl()}transactions/`,
            { params: { 'header': header } })
        return response
    }
}
