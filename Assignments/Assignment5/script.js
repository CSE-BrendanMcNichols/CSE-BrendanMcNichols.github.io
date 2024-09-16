let count = 0;
const countBox = document.getElementById('countBox');
countBox.addEventListener('click', () => {
    count++;
    countBox.textContent = count;
});

const randomImage = document.getElementById('randomImage');
randomImage.addEventListener('click', () => {
    location.reload();
});

const slider = document.getElementById('slider');
const movableSquare = document.getElementById('movableSquare');
slider.addEventListener('input', (event) => {
    const sliderValue = event.target.value;
    const maxMove = slider.parentElement.clientWidth - movableSquare.clientWidth;
    movableSquare.style.left = `${(sliderValue / 100) * maxMove}px`;
});
