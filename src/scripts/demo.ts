import WaveshareRoboticArm from '../modules/WaveshareRoboticArm'

async function main() {
    const instance = await WaveshareRoboticArm.Create()

    await instance.moveTo({ x: 200, y: 0, z: -50, spd: 0.25 })
    await instance.moveTo({ x: 250, y: 0, z: -50, spd: 0.1 })
    await instance.moveTo({ x: 250, y: 0, z: -40, spd: 0.25 })
    await instance.moveTo({ x: 200, y: 0, z: -45, spd: 0.25 })
}

main().catch((error) => {
    console.error('Error in main:', error)
    process.exit(1)
})
