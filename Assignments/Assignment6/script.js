function choosePicture(size) {
    const imgElement = document.getElementById("chosen-image");
    let imageUrl = "";

    if (size === "small") {
        imageUrl = "https://picsum.photos/200/200";
    } else if (size === "medium") {
        imageUrl = "https://picsum.photos/300/300";
    } else if (size === "large") {
        imageUrl = "https://picsum.photos/400/400";
    }

    imgElement.src = imageUrl;
    imgElement.style.display = "block";
}

function showExercise(exerciseNumber) {
    document.getElementById('exercise1').style.display = 'none';
    document.getElementById('exercise2').style.display = 'none';

    if (exerciseNumber === 1) {
        document.getElementById('exercise1').style.display = 'block';
    } else if (exerciseNumber === 2) {
        document.getElementById('exercise2').style.display = 'block';
    }
}

function updateBackgroundColor() {
    const sliderValue = document.getElementById("color-slider").value;
    const container = document.getElementById("color-slider-container");
    const message = document.getElementById("color-message");

    const color = `rgb(${sliderValue}, 0, 0)`;
    container.style.backgroundColor = color;

    if (sliderValue < 85) {
        message.textContent = "Chill";
    } else if (sliderValue < 170) {
        message.textContent = "Getting Warmer";
    } else {
        message.textContent = "Hot!";
    }
}

document.querySelector('.menu-toggle').addEventListener('click', function() {
    const menuItems = document.getElementById('menu-items');
    const menuArrow = document.getElementById('menu-arrow');
    
    if (menuItems.style.display === 'block') {
        menuItems.style.display = 'none';
        menuArrow.textContent = '▼';
    } else {
        menuItems.style.display = 'block';
        menuArrow.textContent = '▲';
    }
});
