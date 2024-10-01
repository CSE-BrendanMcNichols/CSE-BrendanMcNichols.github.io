document.getElementById('drawButton').addEventListener('click', () => {
    const numStars = parseInt(document.getElementById('numStars').value);
    const canvas = document.getElementById('starCanvas');
    const errorMessage = document.getElementById('error-message');
    const starMessage = document.getElementById('star-message');

    canvas.innerHTML = '';
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    starMessage.textContent = '';

    if (isNaN(numStars) || numStars <= 0) {
        errorMessage.textContent = '* Invalid Input';
        errorMessage.style.display = 'inline';
        return;
    }

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const starLeft = Math.random() * (canvasWidth - 10);
        const starTop = Math.random() * (canvasHeight - 10);

        star.style.left = `${starLeft}px`;
        star.style.top = `${starTop}px`;
        
        const starNumber = i + 1;
        star.addEventListener('click', () => {
            starMessage.textContent = `You clicked on Star #${starNumber}`;
            starMessage.style.display = 'block';
        });

        canvas.appendChild(star);
    }
});
