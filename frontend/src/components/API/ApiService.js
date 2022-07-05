import axios from "axios";

export default class ApiService {

    static async getTransactions(date) {
        const responseTransactions = await axios.get("http://127.0.0.1:8000/api/transactions/",
            { params: { 'year': date.getFullYear(), month: date.getMonth() + 1 } })
        return responseTransactions.data
    }

    static async getTotals(date) {
        const responseTotals = await axios.get("http://127.0.0.1:8000/api/total_balance/",
            { params: { 'year': date.getFullYear(), month: date.getMonth() + 1 } })
        return responseTotals.data
    }
}