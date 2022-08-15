type SensorTouch = {
    x: Point["x"];
    y: Point["y"];
    offset: number
};

class Sensor {

    car: Car;
    rayCount: number;
    rayLength: number;
    raySpread: number;

    rays: Point[][];
    readings: SensorTouch[];

    constructor(car: Car) {
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;

        // consists of tuples of points [start, end]
        this.rays = [];

        this.readings = [];
    }

    update(roadBorders: Point[][], traffic: Car[]) {
        this.#castRays();
        this.readings = [];

        for (let i = 0; i < this.rays.length; i++) {
            const reading: SensorTouch | null | undefined = this.#getReading(this.rays[i], roadBorders, traffic);
            if (reading) {
                this.readings.push();
            }
        }
    }

    #getReading(ray: Point[], roadBorders: Point[][], traffic: Car[]): SensorTouch | null | undefined {
        let touches = [];

        // touch road border
        for (let i=0; i<roadBorders.length; i++) {
            const touch: SensorTouch | null = getIntersection(
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );
            if (touch) {
                touches.push(touch);
            }
        }

        // touch other car
        for(let i=0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j=0; j < poly.length; j++){
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j+1) % poly.length]
                );
                if (value) {
                    touches.push(value);
                }
            }
        }

        if (touches.length==0) {
            return null;
        } else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset == minOffset);
        }
    }

    #castRays() {
        this.rays = [];

        // for every ray
        for (let i=0; i<this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                this.rayCount == 1 ? 0.5 : i/(this.rayCount - 1)
            ) + this.car.angle;

            const start = {
                x: this.car.x,
                y: this.car.y
            }

            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            }

            this.rays.push([start, end]);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {

        for (let i=0; i<this.rayCount; i++) {

            let end: Point = this.rays[i][1];

            // if there is an obstacle, set it as the end of the ray
            if (this.readings[i]) {
                end = { x: this.readings[i].x, y: this.readings[i].y };
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();


            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}
