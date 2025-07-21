import WaveshareRoboticArm from '../modules/WaveshareRoboticArm'

async function main() {
    const instance = await WaveshareRoboticArm.Create()
    await instance.resetToVertical()
}

main().catch((error) => {
    console.error('Error in main:', error)
    process.exit(1)
})
