import { AxiosResponse } from 'axios'
import {
    ExecuteOptions,
    JointsOptions,
    MoveOptions,
    RoboticArm,
    RoboticArmOptions,
} from '../modules/WaveshareRoboticArm'

export default class FakeRoboticArm implements RoboticArm {
    public static callsToConstructor: RoboticArmOptions[] = []
    public static callsToExecuteCommand: ExecuteOptions[] = []
    public static callsToJointsTo: JointsOptions[] = []
    public static callsToMoveTo: MoveOptions[] = []
    public static numCallsToResetToVertical = 0

    public constructor(options?: RoboticArmOptions) {
        FakeRoboticArm.callsToConstructor.push(options ?? {})
        return new FakeRoboticArm()
    }

    public async executeCommand(options: ExecuteOptions) {
        FakeRoboticArm.callsToExecuteCommand.push(options)
        return {} as Promise<AxiosResponse>
    }

    public async moveTo(options: MoveOptions) {
        FakeRoboticArm.callsToMoveTo.push(options)
        return {} as Promise<AxiosResponse>
    }

    public async jointsTo(options: JointsOptions) {
        FakeRoboticArm.callsToJointsTo.push(options)
        return {} as Promise<AxiosResponse>
    }

    public async resetToVertical() {
        FakeRoboticArm.numCallsToResetToVertical++
        return {} as Promise<AxiosResponse>
    }

    public static resetTestDouble() {
        this.callsToConstructor = []
        this.callsToExecuteCommand = []
        this.callsToJointsTo = []
        this.callsToMoveTo = []
        this.numCallsToResetToVertical = 0
    }
}
