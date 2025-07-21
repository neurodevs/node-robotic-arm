import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import axios from 'axios'
import WaveshareRoboticArm, {
    RoboticArm,
    RoboticArmOptions,
} from '../modules/WaveshareRoboticArm'
import FakeAxios from '../testDoubles/FakeAxios'

export default class WaveshareRoboticArmTest extends AbstractSpruceTest {
    private static instance: RoboticArm

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeAxios()

        this.instance = this.WaveshareRoboticArm()
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

    private static readonly ipAddress = '192.168.4.1'
    private static readonly baseUrl = `http://${this.ipAddress}`

    private static WaveshareRoboticArm(options?: RoboticArmOptions) {
        return WaveshareRoboticArm.Create(options)
    }
}
