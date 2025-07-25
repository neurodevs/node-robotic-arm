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
        const { shouldReset = true } = options ?? {}

        FakeRoboticArm.callsToExecuteCommand.push({ cmd, options })

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
    options?: ExecuteOptions
}
