import axios from 'axios'

export default class WaveshareRoboticArm implements RoboticArm {
    public static Class?: RoboticArmConstructor
    public static axios = axios

    private static defaultIpAddress = '192.168.4.1'
    private static defaultTimeoutMs = 5000

    protected constructor() {}

    public static async Create(options?: RoboticArmOptions) {
        await this.assertIsReachable(options)
        return new (this.Class ?? this)()
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
}

export interface RoboticArm {}

export interface RoboticArmOptions {
    ipAddress?: string
    timeoutMs?: number
}

export type RoboticArmConstructor = new () => RoboticArm
