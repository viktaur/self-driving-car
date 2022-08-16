class Car {

    x: number;
    y: number;
    width: number;
    height: number;

    polygon: Point[];

    speed: number;
    acceleration: number;
    maxSpeed: number;
    friction: number;
    angle: number;

    damaged: boolean;

    sensor: Sensor | undefined;
    brain: NeuralNetwork | undefined;
    controls: Controls;

    useBrain: boolean;

    constructor(x: number, y: number, width: number, height: number, controlType: string, maxSpeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;

        this.damaged = false;
        this.polygon = [];

        this.useBrain = controlType == "AI";

        if (controlType == "KEYS") {
            this.sensor = new Sensor(this);
        }

        if (this.useBrain) {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }

        this.controls = new Controls(controlType);
    }

    update(roadBorders: any, traffic: Car[]) {
        if(!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }

        if (this.brain && this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);
            const outputs: number[] = NeuralNetwork.feedForward(offsets, this.brain);
            // console.log(outputs);

            if (this.useBrain) {
                this.controls.forward = outputs[0] == 1 ? true : false;
                this.controls.left = outputs[1] == 1 ? true : false;
                this.controls.right = outputs[2] == 1 ? true : false;
                this.controls.reverse = outputs[3] == 1 ? true : false;
            }
        }
    }

    #assessDamage(roadBorders: Point[][], traffic: Car[]) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }

    #move() {
        // forward acceleration
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }

        // backwards acceleration
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // positive speed limitation
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        // negative speed limitation
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        // friction applied to positive speed
        if (this.speed > 0) {
            this.speed -= this.friction;
        }

        // friction applied to negative speed
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // speed set to 0 if its less than the value of the friction (prevents the car from moving eternally)
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // if the car is moving
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            
            // move to the left
            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }

            // move to the right
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx: CanvasRenderingContext2D, colour: string) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = colour;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y)

        for (let i=1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
        }

        ctx.fill();

        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}