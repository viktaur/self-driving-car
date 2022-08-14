"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Car_instances, _Car_assessDamage, _Car_createPolygon, _Car_move;
class Car {
    constructor(x, y, width, height, controlType, maxSpeed = 3) {
        _Car_instances.add(this);
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
        if (controlType != "DUMMY") {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(controlType);
    }
    update(roadBorders, traffic) {
        if (!this.damaged) {
            __classPrivateFieldGet(this, _Car_instances, "m", _Car_move).call(this);
            this.polygon = __classPrivateFieldGet(this, _Car_instances, "m", _Car_createPolygon).call(this);
            this.damaged = __classPrivateFieldGet(this, _Car_instances, "m", _Car_assessDamage).call(this, roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
        }
    }
    draw(ctx, colour) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        }
        else {
            ctx.fillStyle = colour;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor) {
            this.sensor.draw(ctx);
        }
    }
}
_Car_instances = new WeakSet(), _Car_assessDamage = function _Car_assessDamage(roadBorders, traffic) {
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
}, _Car_createPolygon = function _Car_createPolygon() {
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
}, _Car_move = function _Car_move() {
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
};
