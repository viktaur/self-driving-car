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
        // since we don't want dummy cars to hit and damage each other, we won't pass traffic as an argument
        traffic[i].update(road.borders, []);
    }

    // update the main car passing the possible obstacles (road borders and other cars)
    car.update(road.borders, traffic);

    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);

    // draw every car on traffic in red
    for(let i=0; i < traffic.length; i++) {
        traffic[i].draw(ctx, "red");
    }

    // draw the main car in blue
    car.draw(ctx, "blue");

    ctx.restore();
    requestAnimationFrame(animate);
}