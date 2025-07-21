export default class WaveshareRoboticArm implements RoboticArm {
    public static Class?: RoboticArmConstructor

    protected constructor() {}

    public static Create() {
        return new (this.Class ?? this)()
    }
}

export interface RoboticArm {}

export type RoboticArmConstructor = new () => RoboticArm
