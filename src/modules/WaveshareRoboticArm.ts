import axios, { AxiosResponse } from 'axios'

export default class WaveshareRoboticArm implements RoboticArm {
    public static Class?: RoboticArmConstructor
    public static axios = axios

    private static defaultIpAddress = '192.168.4.1'
    private static defaultTimeoutMs = 5000

    private ipAddress: string
    private pi = 3.1415926

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

    public async executeCommand(options: ExecuteOptions) {
        const { waitAfterMs, ...cmd } = options ?? {}

        const response = await this.axios.get(`http://${this.ipAddress}/js`, {
            params: {
                json: JSON.stringify(cmd),
            },
        })

        await new Promise((resolve) => setTimeout(resolve, waitAfterMs))

        return response
    }

    public async moveTo(options: MoveOptions) {
        const { x, y, z, t = this.pi, spd = 0 } = options

        return await this.executeCommand({
            T: 104,
            x,
            y,
            z,
            t,
            spd,
        })
    }

    public async jointsTo(options: JointsOptions) {
        const {
            base,
            shoulder,
            elbow,
            hand = this.pi,
            spd = 0,
            acc = 0,
        } = options

        return await this.executeCommand({
            T: 102,
            base,
            shoulder,
            elbow,
            hand,
            spd,
            acc,
        })
    }

    public async resetToVertical() {
        return await this.jointsTo({
            base: 0,
            shoulder: 0,
            elbow: 0,
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
    executeCommand(options: ExecuteOptions): Promise<AxiosResponse>
    jointsTo(options: JointsOptions): Promise<AxiosResponse>
    moveTo(options: MoveOptions): Promise<AxiosResponse>
    resetToVertical(): Promise<AxiosResponse>
}

export interface RoboticArmOptions {
    ipAddress?: string
    timeoutMs?: number
}

export type RoboticArmConstructorOptions = Required<RoboticArmOptions>

export type RoboticArmConstructor = new (
    options?: RoboticArmOptions
) => RoboticArm

export type ExecuteOptions = CommandCode & (MoveOptions | JointsOptions)

export interface CommandCode {
    T: number
}

export interface MoveOptions {
    x: number
    y: number
    z: number
    t?: Radians
    spd?: number
    waitAfterMs?: number
}

export interface JointsOptions {
    base: Radians
    shoulder: Radians
    elbow: Radians
    hand?: Radians
    spd?: number
    acc?: number
    waitAfterMs?: number
}

export type Radians = number
