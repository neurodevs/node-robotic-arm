import axios from 'axios'

export default class WaveshareRoboticArm implements RoboticArm {
    public static Class?: RoboticArmConstructor
    public static axios = axios

    private static ipAddress = '192.168.4.1'
    private static baseUrl = `http://${this.ipAddress}`

    protected constructor() {}

    public static async Create() {
        await this.assertIpAddressIsReachable()
        return new (this.Class ?? this)()
    }

    protected static async assertIpAddressIsReachable() {
        await this.axios.get(this.baseUrl, {
            timeout: 5000,
        })
    }
}

export interface RoboticArm {}

export type RoboticArmConstructor = new () => RoboticArm
