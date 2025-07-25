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

    public async executeCommand(
        cmd: ExecutableCommand,
        options?: ExecuteOptions
    ) {
        const { shouldReset = true, waitAfterMs } = options ?? {}

        const response = await this.executeCommandWithoutReset(cmd, {
            waitAfterMs,
        })

        if (shouldReset) {
            await this.resetToVertical()
        }

        return response
    }

    private async executeCommandWithoutReset(
        cmd: ExecutableCommand,
        options?: ExecuteOptions
    ) {
        const { waitAfterMs } = options ?? {}

        const response = await this.axios.get(`http://${this.ipAddress}/js`, {
            params: {
                json: JSON.stringify(cmd),
            },
        })

        await new Promise((resolve) => setTimeout(resolve, waitAfterMs))

        return response
    }

    public async moveTo(cmd: MoveCommand) {
        const { x, y, z, t = this.pi, spd = 0 } = cmd

        return await this.executeCommandWithoutReset({
            T: 104,
            x,
            y,
            z,
            t,
            spd,
        })
    }

    public async resetToVertical() {
        return await this.executeCommandWithoutReset({
            T: 102,
            base: 0,
            shoulder: 0,
            elbow: 0,
            hand: this.pi,
            spd: 0,
            acc: 0,
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
    executeCommand(
        cmd: ExecutableCommand,
        options?: ExecuteOptions
    ): Promise<AxiosResponse>

    moveTo(cmd: MoveCommand): Promise<AxiosResponse>

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

export type ExecutableCommand = CommandCode & (MoveCommand | JointsCommand)

export interface CommandCode {
    T: number
}

export interface MoveCommand {
    x: number
    y: number
    z: number
    t?: number
    spd?: number
}

export interface JointsCommand {
    base: number
    shoulder: number
    elbow: number
    hand: number
    spd: number
    acc: number
}

export interface ExecuteOptions {
    shouldReset?: boolean
    waitAfterMs?: number
}
