import WaveshareRoboticArm from '../modules/WaveshareRoboticArm'

async function main() {
    const instance = await WaveshareRoboticArm.Create()

    await instance.moveTo({ x: 200, y: -300, z: -50, spd: 0.3 })
    await instance.moveTo({ x: 200, y: -300, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: -280, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: -280, z: -50, spd: 0.1 })
    await instance.moveTo({ x: 200, y: -300, z: -50, spd: 0.1 })

    await instance.moveTo({ x: 200, y: 300, z: -50, spd: 0.3 })
    await instance.moveTo({ x: 200, y: 300, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: 280, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: 280, z: -50, spd: 0.1 })
    await instance.moveTo({ x: 200, y: 300, z: -50, spd: 0.1 })

    await instance.moveTo({ x: 200, y: -300, z: -50, spd: 0.3 })
    await instance.moveTo({ x: 200, y: -300, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: -280, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: -280, z: -50, spd: 0.1 })
    await instance.moveTo({ x: 200, y: -300, z: -50, spd: 0.1 })

    await instance.moveTo({ x: 200, y: 300, z: -50, spd: 0.3 })
    await instance.moveTo({ x: 200, y: 300, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: 280, z: -110, spd: 0.1 })
    await instance.moveTo({ x: 250, y: 280, z: -50, spd: 0.1 })
    await instance.moveTo({ x: 200, y: 300, z: -50, spd: 0.1 })
}

main().catch((error) => {
    console.error('Error in main:', error)
    process.exit(1)
})
