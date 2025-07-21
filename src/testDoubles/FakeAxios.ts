import { AxiosRequestConfig } from 'axios'

export default class FakeAxios {
    public static callsToGet: CallToAxiosGet[] = []

    public async get(url: string, config: AxiosRequestConfig) {
        FakeAxios.callsToGet.push({ url, config })
        return {}
    }

    public static resetTestDouble() {
        FakeAxios.callsToGet = []
    }
}

export interface CallToAxiosGet {
    url: string
    config: AxiosRequestConfig
}
