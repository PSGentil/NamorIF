let startTime, endTime, imageSize
let imageLink = "https://source.unsplash.com/random?topics=nature"
let image = new Image()

window.onload = async () => {
    startTime = Date.now()
    image.src = imageLink
};

image.onload = async () => {
    endTime = Date.now()

    await fetch(imageLink).then((response) => {
        imageSize = response.headers.get("content-length")
        calculateSpeed();
    });
};

function calculateSpeed() {
    let timeDuration = (endTime - startTime) / 1000;
    let loadedBits = imageSize * 8;
    let speedInBps = parseInt(loadedBits / timeDuration)

    localStorage.setItem("netSpeed", speedInBps)
}