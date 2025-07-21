import WaveshareRoboticArm from '../modules/WaveshareRoboticArm'

async function main() {
    const instance = await WaveshareRoboticArm.Create()

    await instance.executeCommand({
        T: 102,
        base: 0,
        shoulder: 3.1415926 / 4,
        elbow: 3.1415926 / 4,
        hand: 3.1415926,
        spd: 0,
        acc: 0,
    })
}

main().catch((error) => {
    console.error('Error in main:', error)
    process.exit(1)
})
