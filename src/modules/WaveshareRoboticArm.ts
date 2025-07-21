import axios, { AxiosResponse } from 'axios'

export default class WaveshareRoboticArm implements RoboticArm {
    public static Class?: RoboticArmConstructor
    public static axios = axios
    private static defaultIpAddress = '192.168.4.1'
    private static defaultTimeoutMs = 5000

    private ipAddress: string

    protected constructor(options?: RoboticArmOptions) {
        const { ipAddress } = options ?? {}

        this.ipAddress = ipAddress ?? this.defaultIpAddress
    }

    public static async Create(options?: RoboticArmOptions) {
        await this.assertIsReachable(options)
        return new (this.Class ?? this)(options)
    }

    private static async assertIsReachable(options?: RoboticArmOptions) {
        const {
            ipAddress = this.defaultIpAddress,
            timeoutMs = this.defaultTimeoutMs,
        } = options ?? {}

        await this.axios.get(`http://${ipAddress}`, {
            timeout: timeoutMs,
        })
    }

    public async resetToVertical() {
        return await this.axios.get(`http://${this.ipAddress}/js`, {
            params: {
                json: JSON.stringify({
                    T: 102,
                    base: 0,
                    shoulder: 0,
                    elbow: 0,
                    hand: 3.1415926,
                    spd: 0,
                    acc: 0,
                }),
            },
        })
    }

    private get defaultIpAddress() {
        return WaveshareRoboticArm.defaultIpAddress
    }

    private get axios() {
        return WaveshareRoboticArm.axios
    }
}

export interface RoboticArm {
    resetToVertical(): Promise<AxiosResponse>
}

export interface RoboticArmOptions {
    ipAddress?: string
    timeoutMs?: number
}

export type RoboticArmConstructorOptions = Required<RoboticArmOptions>

export type RoboticArmConstructor = new () => RoboticArm
