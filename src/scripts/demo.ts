import WaveshareRoboticArm from '../modules/WaveshareRoboticArm'

async function main() {
    const instance = await WaveshareRoboticArm.Create()

    console.log('Waveshare Robotic Arm instance created:', instance)
}

main().catch((error) => {
    console.error('Error in main:', error)
    process.exit(1)
})
