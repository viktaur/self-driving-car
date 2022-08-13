const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)
];

animate();

function animate() {
    // update every car on traffic
    for (let i=0; i < traffic.length; i++) {
        traffic[i].update(road.borders);
    }

    // update the main car
    car.update(road.borders);

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);

    // draw every car on traffic
    for(let i=0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
    }

    // draw the main car
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}