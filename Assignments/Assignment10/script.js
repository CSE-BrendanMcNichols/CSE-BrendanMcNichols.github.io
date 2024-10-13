const fetchIceCreamData = async () => {
    try {
        const response = await fetch('https://portiaportia.github.io/json/ice-creams.json');
        const data = await response.json();
        displayIceCreams(data);
    } catch (error) {
        console.error('Error fetching the ice cream data:', error);
    }
};

const displayIceCreams = (iceCreams) => {
    const container = document.querySelector('.ice-cream-container');

    iceCreams.forEach(iceCream => {
        if (iceCream.image.includes('-2')) {
            return;
        }

        const iceCreamDiv = document.createElement('div');
        iceCreamDiv.classList.add('ice-cream-item');
        const img = document.createElement('img');
        img.src = `https://portiaportia.github.io/json/images/ice-creams/${iceCream.image}`;
        img.alt = iceCream.name;
        iceCreamDiv.appendChild(img);
        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.textContent = iceCream.name;
        iceCreamDiv.appendChild(overlay);
        container.appendChild(iceCreamDiv);
    });
};

document.addEventListener('DOMContentLoaded', fetchIceCreamData);
