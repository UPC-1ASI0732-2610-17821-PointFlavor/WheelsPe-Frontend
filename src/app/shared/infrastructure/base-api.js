import { apiClient } from './apiClient.js'

// BaseApi delegates to the shared `apiClient` so endpoints built on
// `BaseEndpoint` can continue to call `this.http.get/post/...`.
export class BaseApi {
    #http
    constructor() {
        this.#http = apiClient
    }
    get http() {
        return this.#http
    }
}