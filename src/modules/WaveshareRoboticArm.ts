import axios, { AxiosResponse } from 'axios'

export default class WaveshareRoboticArm implements RoboticArm {
    public static Class?: RoboticArmConstructor
    public static axios = axios
    private static defaultIpAddress = '192.168.4.1'

    private ipAddress: string
    private origin?: MoveOptions | JointsOptions
    private pi = 3.1415926

    private queue: Promise<unknown> = Promise.resolve()

    protected constructor(options?: RoboticArmOptions) {
        const { ipAddress, origin } = options ?? {}

        this.ipAddress = ipAddress ?? this.defaultIpAddress
        this.origin = origin
    }

    public static async Create(options?: RoboticArmOptions) {
        await this.assertIsReachable(options)
        return new (this.Class ?? this)(options)
    }

    private static async assertIsReachable(options?: RoboticArmOptions) {
        const { ipAddress = this.defaultIpAddress, timeoutMs } = options ?? {}
        await this.axios.get(`http://${ipAddress}`, { timeout: timeoutMs })
    }

    public async executeCommand(options: ExecuteOptions) {
        const { waitAfterMs = 0, ...cmd } = options ?? {}

        return this.runExclusive(async () => {
            const response = await this.axios.get(
                `http://${this.ipAddress}/js`,
                {
                    params: { json: JSON.stringify(cmd) },
                }
            )
            if (waitAfterMs > 0) {
                await new Promise((r) => setTimeout(r, waitAfterMs))
            }
            return response
        })
    }

    public async moveTo(options: MoveOptions) {
        const { x, y, z, t = this.pi, spd = 0, waitAfterMs } = options
        return this.executeCommand({ T: 104, x, y, z, t, spd, waitAfterMs })
    }

    public async jointsTo(options: JointsOptions) {
        const {
            base,
            shoulder,
            elbow,
            hand = this.pi,
            spd = 0,
            acc = 0,
            waitAfterMs,
        } = options

        return this.executeCommand({
            T: 102,
            base,
            shoulder,
            elbow,
            hand,
            spd,
            acc,
            waitAfterMs,
        })
    }

    public async resetToOrigin() {
        if (this.origin) {
            return this.resetToPassedOrigin()
        }
        return this.resetToDefaultOrigin()
    }

    private async resetToPassedOrigin() {
        if (this.originIsMoveCommand) {
            return this.moveTo(this.origin as MoveOptions)
        }
        return this.jointsTo(this.origin as JointsOptions)
    }

    private get originIsMoveCommand() {
        return 'x' in (this.origin ?? {})
    }

    private async resetToDefaultOrigin() {
        return this.jointsTo({ base: 0, shoulder: 0, elbow: 0 })
    }

    private get defaultIpAddress() {
        return WaveshareRoboticArm.defaultIpAddress
    }

    private get axios() {
        return WaveshareRoboticArm.axios
    }

    private runExclusive<T>(fn: () => Promise<T>) {
        const run = this.queue.then(fn, fn)
        this.queue = run.catch(() => {})
        return run
    }
}

export interface RoboticArm {
    executeCommand(options: ExecuteOptions): Promise<AxiosResponse>
    jointsTo(options: JointsOptions): Promise<AxiosResponse>
    moveTo(options: MoveOptions): Promise<AxiosResponse>
    resetToOrigin(): Promise<AxiosResponse>
}

export type RoboticArmConstructor = new (
    options?: RoboticArmOptions
) => RoboticArm

export interface RoboticArmOptions {
    ipAddress?: string
    timeoutMs?: number
    origin?: MoveOptions | JointsOptions
}

export type ExecuteOptions = BaseOptions & (MoveOptions | JointsOptions)

export interface BaseOptions {
    T: WaveshareCommandCode
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

export type WaveshareCommandCode = number
export type Radians = number
