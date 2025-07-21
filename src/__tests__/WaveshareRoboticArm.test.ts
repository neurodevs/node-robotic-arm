import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import WaveshareRoboticArm, { RoboticArm } from '../modules/WaveshareRoboticArm'

export default class WaveshareRoboticArmTest extends AbstractSpruceTest {
    private static instance: RoboticArm

    protected static async beforeEach() {
        await super.beforeEach()

        this.instance = this.WaveshareRoboticArm()
    }

    @test()
    protected static async createsWaveshareRoboticArmInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    private static WaveshareRoboticArm() {
        return WaveshareRoboticArm.Create()
    }
}
