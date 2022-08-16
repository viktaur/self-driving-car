"use strict";
const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];
animate();
function animate() {
    // update every car on traffic
    for (let i = 0; i < traffic.length; i++) {
        // since we don't want dummy cars to hit and damage each other, we won't pass traffic as an argument
        traffic[i].update(road.borders, []);
    }
    // update the main car passing the possible obstacles (road borders and other cars)
    car.update(road.borders, traffic);
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    // draw every car on traffic in red
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    // draw the main car in blue
    car.draw(carCtx, "blue");
    carCtx.restore();
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate);
}
