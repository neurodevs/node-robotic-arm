import WaveshareRoboticArm from '../modules/WaveshareRoboticArm'

async function main() {
    const instance = await WaveshareRoboticArm.Create()

    const pi = 3.1415926

    await instance.executeCommand({
        T: 102,
        base: pi,
        shoulder: pi / 4,
        elbow: pi / 4,
        hand: pi,
        spd: 0,
        acc: 0,
    })
}

main().catch((error) => {
    console.error('Error in main:', error)
    process.exit(1)
})
