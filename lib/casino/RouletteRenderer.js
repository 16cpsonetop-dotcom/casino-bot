// lib/casino/RouletteRenderer.js
const { createCanvas } = require('canvas');

const COLORS = {
    RED: '#E74C3C',
    BLACK: '#2C3E50',
    GREEN: '#16A34A',
    GOLD: '#F1C40F',
    DARK_GREEN: '#0B3D2A'
};

const WHEEL_NUMBERS = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];

class RouletteRenderer {
    constructor() {
        this.canvas = createCanvas(900, 900);
        this.ctx = this.canvas.getContext('2d');
        this.cx = 450;
        this.cy = 450;
        this.radius = 355;
    }

    async drawFrame(wheelRotation, ballAngle, highlight = null) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackground();

        ctx.save();
        ctx.translate(this.cx, this.cy);
        ctx.rotate(wheelRotation);

        this.drawWheelBody();
        this.drawPockets();
        this.drawNumbers();
        ctx.restore();

        this.drawBall(ballAngle);

        if (highlight !== null) this.drawHighlight();

        return this.canvas.toBuffer('image/png');
    }

    drawBackground() {
        this.ctx.fillStyle = COLORS.DARK_GREEN;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = COLORS.GOLD;
        this.ctx.lineWidth = 48;
        this.ctx.strokeRect(35, 35, this.canvas.width - 70, this.canvas.height - 70);
    }

    drawWheelBody() {
        const grad = this.ctx.createRadialGradient(-100, -100, 60, 0, 0, this.radius + 50);
        grad.addColorStop(0, '#F0F0F0');
        grad.addColorStop(1, '#34495E');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius + 45, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawPockets() {
        const angleStep = (Math.PI * 2) / 37;
        for (let i = 0; i < 37; i++) {
            const start = i * angleStep - Math.PI / 2;
            const num = WHEEL_NUMBERS[i];
            const isRed = num !== 0 && [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(num);

            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, this.radius, start, start + angleStep);
            this.ctx.fillStyle = num === 0 ? COLORS.GREEN : (isRed ? COLORS.RED : COLORS.BLACK);
            this.ctx.fill();
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }
    }

    drawNumbers() {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 22px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        const angleStep = (Math.PI * 2) / 37;
        for (let i = 0; i < 37; i++) {
            const angle = i * angleStep - Math.PI / 2 + angleStep / 2;
            const x = Math.cos(angle) * (this.radius - 75);
            const y = Math.sin(angle) * (this.radius - 75);
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle + Math.PI / 2);
            this.ctx.fillText(WHEEL_NUMBERS[i].toString(), 0, 0);
            this.ctx.restore();
        }
    }

    drawBall(angle) {
        const x = Math.cos(angle) * (this.radius - 48);
        const y = Math.sin(angle) * (this.radius - 48);

        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.beginPath();
        this.ctx.ellipse(x + 5, y + 5, 20, 12, 0, 0, Math.PI * 2);
        this.ctx.fill();

        const grad = this.ctx.createRadialGradient(x - 7, y - 7, 6, x, y, 19);
        grad.addColorStop(0, '#F8F8F8');
        grad.addColorStop(1, '#555555');
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 19, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawHighlight() {}
}

module.exports = RouletteRenderer;