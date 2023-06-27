const paper = document.querySelector('#paper'),
    pen = paper.getContext("2d");

let soundEnabled = false;
document.onvisibilitychange = () => soundEnabled = false;

const toggles = document.querySelector('#sound-toggle');
const message = document.getElementById("sound-message");

toggles.onclick = () => {
    soundEnabled = !soundEnabled;
    toggles.setAttribute("data-toggled", soundEnabled);
    if(soundEnabled)
        message.style.display = "none";
}

let startTime = new Date().getTime();

const calculateNextImpactTime = (currentImpactTime, velocity) => {
    return currentImpactTime + (Math.PI / velocity) * 1000;
}

const arcs = [
    "#D0E7F5",
    "#D9E7F4",
    "#D6E3F4",
    "#BCDFF5",
    "#B7D9F4",
    "#C3D4F0",
    "#9DC1F3",
    "#9AA9F4",
    "#8D83EF",
    "#AE69F0",
    "#D46FF1",
    "#DB5AE7",
    "#D911DA",
    "#D601CB",
    "#E713BF",
    "#F24CAE",
    "#FB79AB",
    "#FFB6C1",
    "#FED2CF",
    "#FDDFD5",
    "#FEDCD1"
].map((color, index) => {
    const audio = new Audio(`assets/audio/${index+1}.mp3`);   //fetch audio files

    audio.volume = 0.2;

    const oneFullLoop = 2 * Math.PI,
        numberOfLoops = oneFullLoop * (100 - index),
        velocity = numberOfLoops / 600;

    return {
        color,
        audio,
        nextImpactTime: calculateNextImpactTime(startTime, velocity),
        velocity
    }
})

const draw = () => {
    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const currentTime = new Date().getTime(),
        elapsedTime = currentTime - startTime;

    const start = {
        x: paper.width * 0.1,
        y: paper.height * 0.9
    }

    const end = {
        x: paper.width * 0.9,
        y: paper.height * 0.9
    }

    const center = {
        x: paper.width * 0.5,
        y: paper.height * 0.9
    }

    const length = end.x - start.x,
        initialArcRadius = length * 0.05;
    
    const spacing = (length / 2 - initialArcRadius) / arcs.length;  //space between arcs

    pen.strokeStyle = "white";
    pen.lineWidth = 3;

    //base line
    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();

    
    arcs.forEach((arc, index) => {  //for drawing multiple arcs with circles

        //for drawing circles
        const arcRadius = initialArcRadius + (index * spacing),  //incrementing radius for each arcs
            maxAngle = 2 * Math.PI,
            // oneFullLoop = 2 * Math.PI,
            // numberOfLoops = 50 - index,
            // velocity = (oneFullLoop * numberOfLoops) / 900,     //speed for each circle --- 900=15 mins --> circles realign after 900 sec
            distance = Math.PI + (elapsedTime * arc.velocity * 0.001),
            modDistance = distance % maxAngle;  //Keep distance between 1π and 2π
            adjustDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;     //Ping Pong in arc 1π -> 2π -> 1π

        const x = center.x + arcRadius * Math.cos(adjustDistance),
            y = center.y + arcRadius * Math.sin(adjustDistance); //position on a circle

        //draw arc
        pen.beginPath();
        pen.strokeStyle = arc.color;
        pen.arc(center.x, center.y, arcRadius, Math.PI , 2 * Math.PI);
        pen.stroke();
        
        //draw circle
        pen.fillStyle = "white";
        pen.beginPath();
        pen.arc(x, y, length * 0.005, 0 , 2 * Math.PI);
        pen.fill();

        if(currentTime >= arc.nextImpactTime) {
            if(soundEnabled) {
                arc.audio.play();
            }
            arc.nextImpactTime = calculateNextImpactTime(arc.nextImpactTime, arc.velocity);
        }
    })

    //to redraw (uses monitor refresh rate)
    requestAnimationFrame(draw);
}

draw();