// lib/casino/RoulettePhysics.js
const WHEEL_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30,
    8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7,
    28, 12, 35, 3, 26
];

class RoulettePhysics {
    constructor() {
        this.minDuration = 3800; 
        this.maxDuration = 4800;
    }

    generateFrames(targetNumber) {
        const duration = this.minDuration + Math.random() * (this.maxDuration - this.minDuration);
        const totalFrames = Math.floor(duration / 80); 
        const frames = [];

        let angle = Math.random() * Math.PI * 4;
        let velocity = 0.35;

        const targetAngle = this.getTargetAngle(targetNumber);

        for (let i = 0; i < totalFrames; i++) {
            const progress = i / totalFrames;
            velocity *= (0.955 - progress * 0.28);
            angle += velocity;

            if (progress > 0.7) {
                velocity += Math.sin(i * 1.4) * 0.018;
            }

            frames.push({
                wheelRotation: angle,
                ballAngle: angle * -1.8,
            });
        }

        frames[frames.length - 1].wheelRotation = targetAngle;
        return frames;
    }

    getTargetAngle(number) {
        const index = WHEEL_NUMBERS.indexOf(number);
        if (index === -1) return 0;
        return - (index * (Math.PI * 2) / 37) + (Math.PI / 2);
    }
}

module.exports = RoulettePhysics;