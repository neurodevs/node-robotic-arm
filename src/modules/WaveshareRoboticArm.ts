import axios, { AxiosResponse } from 'axios'

export default class WaveshareRoboticArm implements RoboticArm {
    public static Class?: RoboticArmConstructor
    public static axios = axios
    public static waitAfterMs = 2000
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

    public async executeCommand(cmd: ExecutableCommand, shouldReset = true) {
        const response = await this.executeCommandWithoutReset(cmd)

        if (shouldReset) {
            await this.resetToVertical()
        }

        return response
    }

    private async executeCommandWithoutReset(cmd: ExecutableCommand) {
        const response = await this.axios.get(`http://${this.ipAddress}/js`, {
            params: {
                json: JSON.stringify(cmd),
            },
        })

        await this.waitAfterCommand()

        return response
    }

    private waitAfterCommand() {
        return new Promise((resolve) => setTimeout(resolve, this.waitAfterMs))
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

    private get waitAfterMs() {
        return WaveshareRoboticArm.waitAfterMs
    }
}

export interface RoboticArm {
    executeCommand(
        cmd: ExecutableCommand,
        shouldReset?: boolean
    ): Promise<AxiosResponse>

    moveTo(cmd: MoveCommand): Promise<AxiosResponse>

    resetToVertical(): Promise<AxiosResponse>
}

export interface RoboticArmOptions {
    ipAddress?: string
    timeoutMs?: number
}

export type RoboticArmConstructorOptions = Required<RoboticArmOptions>

export type RoboticArmConstructor = new () => RoboticArm

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
