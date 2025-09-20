import { AxiosRequestConfig } from 'axios'

export default class FakeAxios {
    public static callsToGet: CallToAxiosGet[] = []
    public static shouldThrow = false
    public static fakeErrorMessage = 'FakeAxios error'

    public async get(url: string, config: AxiosRequestConfig) {
        FakeAxios.callsToGet.push({ url, config })
        if (FakeAxios.shouldThrow) {
            throw new Error(FakeAxios.fakeErrorMessage)
        }
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
