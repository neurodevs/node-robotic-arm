import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import axios from 'axios'
import WaveshareRoboticArm, {
    ExecutableCommand,
    RoboticArm,
    RoboticArmOptions,
} from '../modules/WaveshareRoboticArm'
import FakeAxios from '../testDoubles/FakeAxios'

export default class WaveshareRoboticArmTest extends AbstractSpruceTest {
    private static instance: RoboticArm

    protected static async beforeAll() {
        await super.beforeAll()

        assert.isEqual(
            WaveshareRoboticArm.waitAfterMs,
            2000,
            'Should have default waitAfterMs of 5000ms!'
        )
    }

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeAxios()

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
            5000,
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
    protected static async hasMethodResetToVertical() {
        await this.instance.resetToVertical()
        this.assertResetToVertical()
    }

    @test()
    protected static async hasMethodExecuteCommand() {
        const cmd = await this.executeCommand()

        assert.isEqualDeep(
            this.secondCallToGet,
            {
                url: this.jsUrl,
                config: {
                    params: { json: JSON.stringify(cmd) },
                },
            },
            'Should execute command!'
        )
    }

    @test()
    protected static async executeCommandReturnsToVerticalAtEnd() {
        await this.executeCommand()
        this.assertResetToVertical(this.thirdCallToGet)
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
    protected static async executeCommandHasShouldResetFlag() {
        await this.executeCommand(false)

        const length = FakeAxios.callsToGet.length

        assert.isTrue(
            length == 2,
            `Should have called axios twice, yet was ${length}!`
        )
    }

    private static async executeCommand(shouldReset = true) {
        const cmd = {
            T: 1,
            base: 2,
            shoulder: 3,
            elbow: 4,
            hand: 5,
            spd: 6,
            acc: 7,
        }

        await this.instance.executeCommand(cmd, shouldReset)

        return cmd
    }

    private static assertResetToVertical(callToGet = this.secondCallToGet) {
        assert.isEqualDeep(
            callToGet,
            {
                url: this.jsUrl,
                config: {
                    params: {
                        json: JSON.stringify(this.resetToVerticalCommand),
                    },
                },
            },
            'Should reset to vertical!'
        )
    }

    private static setFakeAxios() {
        WaveshareRoboticArm.axios = new FakeAxios() as typeof axios
        FakeAxios.resetTestDouble()
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

    private static readonly waitAfterMs = 2

    private static resetToVerticalCommand: ExecutableCommand = {
        T: 102,
        base: 0,
        shoulder: 0,
        elbow: 0,
        hand: 3.1415926,
        spd: 0,
        acc: 0,
    }

    private static WaveshareRoboticArm(options?: RoboticArmOptions) {
        WaveshareRoboticArm.waitAfterMs = this.waitAfterMs
        return WaveshareRoboticArm.Create(options)
    }
}
