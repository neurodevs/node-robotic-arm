import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import {
    AutoWifiConnector,
    FakeWifiConnector,
} from '@neurodevs/node-wifi-connector'
import axios, { AxiosResponse } from 'axios'
import WaveshareRoboticArm, {
    ExecuteOptions,
    JointsOptions,
    MoveOptions,
    RoboticArm,
    RoboticArmOptions,
} from '../modules/WaveshareRoboticArm'
import FakeAxios from '../testDoubles/FakeAxios'

export default class WaveshareRoboticArmTest extends AbstractSpruceTest {
    private static instance: RoboticArm
    private static readonly pi = 3.1415926

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeAxios()
        this.setFakeWifiConnector()

        delete WaveshareRoboticArm.Class

        this.instance = await this.WaveshareRoboticArm()
    }

    @test()
    protected static async createsWaveshareRoboticArmInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async instantiationAssertsIpAddressIsReachable() {
        assert.isEqual(
            this.firstCallToGet.url,
            this.baseUrl,
            'Should have called axios get with correct url!'
        )
    }

    @test()
    protected static async assertIpAddressTakesTimeoutMs() {
        assert.isEqual(
            this.firstCallToGet.config.timeout,
            this.defaultTimeoutMs,
            'Should have set a timeout of 5000ms'
        )
    }

    @test()
    protected static async canSetCustomIpAddress() {
        const ipAddress = generateId()

        await this.WaveshareRoboticArm({
            ipAddress,
        })

        assert.isEqual(
            this.secondCallToGet.url,
            `http://${ipAddress}`,
            'Should have called axios get with custom ip address!'
        )
    }

    @test()
    protected static async canSetCustomTimeoutMs() {
        const timeoutMs = Math.random()

        await this.WaveshareRoboticArm({
            timeoutMs,
        })

        assert.isEqual(
            this.secondCallToGet.config.timeout,
            timeoutMs,
            'Should have called axios get with custom config!'
        )
    }

    @test()
    protected static async hasMethodResetToOrigin() {
        await this.instance.resetToOrigin()
        this.assertResetToOrigin()
    }

    @test()
    protected static async hasMethodExecuteCommand() {
        const options = await this.executeCommand()

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { waitAfterMs, ...rest } = options

        assert.isEqualDeep(
            this.secondCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: { json: JSON.stringify(rest) },
                },
            },
            'Should execute command!'
        )
    }

    @test()
    protected static async waitsAfterExecutingCommand() {
        const t0 = Date.now()
        await this.executeCommand()
        const elapsed = Date.now() - t0

        assert.isTrue(
            elapsed >= this.waitAfterMs,
            `Should have waited at least ${this.waitAfterMs}ms, but only waited ${elapsed}ms!`
        )
    }

    @test()
    protected static async moveToCommandCallsAxios() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { waitAfterMs, ...options } = await this.moveToRandom()

        const expected = {
            T: 104,
            ...options,
            t: 3.1415926,
            spd: 0,
        }

        assert.isEqualDeep(
            this.secondCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: { json: JSON.stringify(expected) },
                },
            },
            'Should execute moveTo command!'
        )
    }

    @test()
    protected static async moveToAcceptsOptionalParams() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { waitAfterMs, ...options } = await this.moveToRandom(true)

        const expected = {
            T: 104,
            ...options,
        }

        assert.isEqualDeep(
            this.secondCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: { json: JSON.stringify(expected) },
                },
            },
            'Should execute moveTo command with optional params!'
        )
    }

    @test()
    protected static async moveToPassesOptionsToExecuteCommand() {
        let passedOptions: ExecuteOptions | undefined

        this.instance.executeCommand = async (options: ExecuteOptions) => {
            passedOptions = options
            return {} as AxiosResponse
        }

        const options = this.generateMoveOptions(true)

        await this.moveTo(options)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { T, ...rest } = passedOptions ?? {}

        assert.isEqualDeep(
            rest,
            options,
            'Should execute moveTo command with options!'
        )
    }

    @test()
    protected static async moveToWaitsAfterExecutingCommand() {
        const t0 = Date.now()
        await this.moveToRandom(false, true)
        const elapsed = Date.now() - t0

        assert.isTrue(
            elapsed >= this.waitAfterMs,
            `Should have waited at least ${this.waitAfterMs}ms, but only waited ${elapsed}ms!`
        )
    }

    @test()
    protected static async jointsToCommandCallsAxios() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { waitAfterMs, ...options } = await this.jointsToRandom()

        const expected = {
            T: 102,
            ...options,
            hand: this.pi,
            spd: 0,
            acc: 0,
        }

        assert.isEqualDeep(
            this.secondCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: { json: JSON.stringify(expected) },
                },
            },
            'Should execute jointsTo command!'
        )
    }

    @test()
    protected static async jointsToAcceptsOptionalParams() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { waitAfterMs, ...options } = await this.jointsToRandom(true)

        const expected = {
            T: 102,
            ...options,
        }

        assert.isEqualDeep(
            this.secondCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: { json: JSON.stringify(expected) },
                },
            },
            'Should execute jointsTo command with optional params!'
        )
    }

    @test()
    protected static async jointsToPassesOptionsToExecuteCommand() {
        let passedOptions: ExecuteOptions | undefined

        this.instance.executeCommand = async (options: ExecuteOptions) => {
            passedOptions = options
            return {} as AxiosResponse
        }

        const options = this.generateJointsOptions(true)
        await this.instance.jointsTo(options)

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { T, ...rest } = passedOptions ?? {}

        assert.isEqualDeep(
            rest,
            options,
            'Should execute jointsTo command with options!'
        )
    }

    @test()
    protected static async jointsToWaitsAfterExecutingCommand() {
        const t0 = Date.now()
        await this.jointsToRandom(false, true)
        const elapsed = Date.now() - t0

        assert.isTrue(
            elapsed >= this.waitAfterMs,
            `Should have waited at least ${this.waitAfterMs}ms, but only waited ${elapsed}ms!`
        )
    }

    @test()
    protected static async passedOriginSetsNewOrigin() {
        await this.instance.resetToOrigin()

        this.assertResetToOrigin(this.secondCallToGet)
    }

    @test()
    protected static async originCanBeSetOnInstantiation() {
        const origin = this.generateMoveOptions()

        this.instance = await this.WaveshareRoboticArm({
            origin,
        })

        await this.instance.resetToOrigin()

        assert.isEqualDeep(
            this.thirdCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: {
                        json: JSON.stringify({
                            T: 104,
                            ...origin,
                            t: this.pi,
                            spd: 0,
                        }),
                    },
                },
            },
            'Should reset to origin passed on instantiation!'
        )
    }

    @test()
    protected static async originCanBeSetToJointsCommand() {
        const origin = this.generateJointsOptions()

        this.instance = await this.WaveshareRoboticArm({
            origin,
        })

        await this.instance.resetToOrigin()

        assert.isEqualDeep(
            this.thirdCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: {
                        json: JSON.stringify({
                            T: 102,
                            ...origin,
                            hand: this.pi,
                            spd: 0,
                            acc: 0,
                        }),
                    },
                },
            },
            'Should reset to origin passed on instantiation!'
        )
    }

    @test()
    protected static async connectsToWifi() {
        assert.isEqualDeep(
            FakeWifiConnector.callsToConnect[0],
            {
                ssid: 'RoArm-M2',
                password: '12345678',
            },
            'Should connect to wifi with default ssid and no password!'
        )
    }

    @test()
    protected static async disconnectCallsWifiDisconnect() {
        await this.instance.disconnect()

        assert.isEqual(
            FakeWifiConnector.numCallsToDisconnect,
            1,
            'Should call wifi disconnect!'
        )
    }

    private static async executeCommand() {
        const options = {
            T: 1,
            base: 2,
            shoulder: 3,
            elbow: 4,
            hand: 5,
            spd: 6,
            acc: 7,
            waitAfterMs: this.waitAfterMs,
        }

        await this.instance.executeCommand(options)

        return options
    }

    private static async moveTo(options: MoveOptions) {
        await this.instance.moveTo(options)
    }

    private static async moveToRandom(
        includeOptional = false,
        waitAfter = false
    ) {
        const options = this.generateMoveOptions(includeOptional)

        await this.moveTo({
            ...options,
            waitAfterMs: waitAfter ? this.waitAfterMs : 0,
        })

        return options
    }

    private static generateMoveOptions(
        includeOptional = false,
        waitAfter = false
    ) {
        const base = {
            x: Math.random(),
            y: Math.random(),
            z: Math.random(),
        }

        const options = includeOptional
            ? {
                  ...base,
                  t: Math.random(),
                  spd: Math.random(),
                  waitAfterMs: waitAfter ? this.waitAfterMs : 0,
              }
            : base

        return options as MoveOptions
    }

    private static async jointsToRandom(
        includeOptional = false,
        waitAfter = false
    ) {
        const options = this.generateJointsOptions(includeOptional)

        await this.instance.jointsTo({
            ...options,
            waitAfterMs: waitAfter ? this.waitAfterMs : 0,
        })

        return options
    }

    private static generateJointsOptions(
        includeOptional = false,
        waitAfter = false
    ) {
        const base = {
            base: Math.random(),
            shoulder: Math.random(),
            elbow: Math.random(),
        }

        const options = includeOptional
            ? {
                  ...base,
                  hand: Math.random(),
                  spd: Math.random(),
                  acc: Math.random(),
                  waitAfterMs: waitAfter ? this.waitAfterMs : 0,
              }
            : base

        return options as JointsOptions
    }

    private static assertResetToOrigin(callToGet = this.secondCallToGet) {
        assert.isEqualDeep(
            callToGet,
            {
                url: this.jsUrl,
                config: {
                    params: {
                        json: JSON.stringify(this.resetToOriginCommand),
                    },
                },
            },
            'Should reset to origin!'
        )
    }

    private static setFakeAxios() {
        WaveshareRoboticArm.axios = new FakeAxios() as typeof axios
        FakeAxios.resetTestDouble()
    }

    private static setFakeWifiConnector() {
        AutoWifiConnector.Class = FakeWifiConnector
    }

    private static get firstCallToGet() {
        return FakeAxios.callsToGet[0]
    }

    private static get secondCallToGet() {
        return FakeAxios.callsToGet[1]
    }

    private static get thirdCallToGet() {
        return FakeAxios.callsToGet[2]
    }

    private static readonly ipAddress = '192.168.4.1'
    private static readonly baseUrl = `http://${this.ipAddress}`
    private static readonly jsUrl = `${this.baseUrl}/js`
    private static readonly defaultTimeoutMs = Math.random()
    private static readonly waitAfterMs = 5

    private static resetToOriginCommand: ExecuteOptions = {
        T: 102,
        base: 0,
        shoulder: 0,
        elbow: 0,
        hand: 3.1415926,
        spd: 0,
        acc: 0,
    }

    private static WaveshareRoboticArm(options?: RoboticArmOptions) {
        return WaveshareRoboticArm.Create({
            timeoutMs: this.defaultTimeoutMs,
            ...options,
        })
    }
}
