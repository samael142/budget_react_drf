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
        return responseHeaders.data
    }

    static async getCategories() {
        const responseCategories = await axios.get(`${ApiService.getUrl()}categories/`)
        return responseCategories.data
    }

    static async getSubcategories() {
        const responseSubcategories = await axios.get(`${ApiService.getUrl()}subcategories/`)
        return responseSubcategories.data
    }

    static async getMoneyAccounts() {
        const responseMoneyAccounts = await axios.get(`${ApiService.getUrl()}ma_list/`)
        return responseMoneyAccounts.data
    }

    static async getLastHeaders() {
        const lastHeaders = await axios.get(`${ApiService.getUrl()}last_headers/`)
        return lastHeaders.data
    }
}
