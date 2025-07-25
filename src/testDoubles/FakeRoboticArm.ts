import { AxiosResponse } from 'axios'
import {
    ExecutableCommand,
    ExecuteOptions,
    MoveCommand,
    RoboticArm,
    RoboticArmOptions,
} from '../modules/WaveshareRoboticArm'

export default class FakeRoboticArm implements RoboticArm {
    public static callsToConstructor: RoboticArmOptions[] = []
    public static callsToExecuteCommand: RoboticArmMoveToCall[] = []
    public static callsToMoveTo: MoveCommand[] = []
    public static numCallsToResetToVertical = 0

    public constructor(options?: RoboticArmOptions) {
        FakeRoboticArm.callsToConstructor.push(options ?? {})
        return new FakeRoboticArm()
    }

    public async executeCommand(
        cmd: ExecutableCommand,
        options?: ExecuteOptions
    ) {
        FakeRoboticArm.callsToExecuteCommand.push({ cmd, options })
        return {} as Promise<AxiosResponse>
    }

    public async moveTo(cmd: MoveCommand) {
        FakeRoboticArm.callsToMoveTo.push(cmd)
        return {} as Promise<AxiosResponse>
    }

    public async resetToVertical() {
        FakeRoboticArm.numCallsToResetToVertical++
        return {} as Promise<AxiosResponse>
    }
}

export interface RoboticArmMoveToCall {
    cmd: ExecutableCommand
    options?: ExecuteOptions
}
