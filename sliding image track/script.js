const track = document.getElementById("image-track");

window.onmousedown = e => {
    track.dataset.mouseDownAt = e.clientX;  //storing x position of mouse at start
}

window.onmousemove = e => {
    if(track.dataset.mouseDownAt === "0")   return;     //return immediately if mouse is not pressed

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,   //relative position from start
        maxDelta = window.innerWidth / 2;   //max drag achieved by draging half of the screen width

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentage = Math.max(Math.min(parseFloat(track.dataset.prevPercentage) + percentage, 0), -100);     //to continue from where we left off
                                                                                                                //min and max to range from 0 to -100 (remove infinite scroll)
    track.dataset.percentage = nextPercentage;

    // track.style.transform = `translate(${nextPercentage}%, -50%)`;  //track sliding effect
    track.animate({                                                 //for smooth transition
        transform:  `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    for(const image of track.getElementsByClassName("image")) {
        // image.style.objectPosition = `${nextPercentage + 100}% 50%`;     //for image transition
        image.animate({                                                 //for smooth transition
            objectPosition: `${nextPercentage + 100}% center`
        }, {duration: 1200, fill: "forwards"});
    }
}

window.onmouseup = () => {
    track.dataset.mouseDownAt = "0"; //reset to 0 when we release mouse
    track.dataset.prevPercentage = track.dataset.percentage;
}