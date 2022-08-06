class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders) {
        this.#move();
        this.sensor.update(roadBorders);
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

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();

        ctx.restore();

        this.sensor.draw(ctx);
    }
}