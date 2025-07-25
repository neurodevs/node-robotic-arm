import { AxiosResponse } from 'axios'
import {
    ExecutableCommand,
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

    public async executeCommand(cmd: ExecutableCommand, shouldReset = true) {
        FakeRoboticArm.callsToExecuteCommand.push({ cmd, shouldReset })

        if (shouldReset) {
            await this.resetToVertical()
        }

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
    shouldReset: boolean
}
