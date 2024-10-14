const toggleMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.destinations-grid')) {
        loadAllDestinations();
    }
});

const loadAllDestinations = () => {
    fetch('destinations.json')
        .then(response => response.json())
        .then(data => {
            const destinationsGrid = document.querySelector('.destinations-grid');
            if (destinationsGrid) {
                destinationsGrid.innerHTML = '';
                data.forEach(destination => {
                    const destinationCard = document.createElement('a');
                    destinationCard.href = destination.link;
                    destinationCard.classList.add('destination-card');

                    const imageDiv = document.createElement('div');
                    imageDiv.classList.add('destination-placeholder');
                    imageDiv.style.backgroundImage = `url('${destination.img_name}')`;

                    const destinationName = document.createElement('h2');
                    destinationName.textContent = destination.name;

                    const destinationDescription = document.createElement('p');
                    destinationDescription.textContent = destination.description;

                    const activities = document.createElement('p');
                    activities.classList.add('activities');
                    activities.textContent = `Activities: ${destination.activities.join(', ')}`;

                    const bestTime = document.createElement('p');
                    bestTime.textContent = `Best Time to Visit: ${destination.best_time_to_visit}`;

                    const recommendedDuration = document.createElement('p');
                    recommendedDuration.textContent = `Recommended Duration: ${destination.recommended_duration}`;

                    const funFact = document.createElement('p');
                    funFact.textContent = `Fun Fact: ${destination.fun_fact}`;

                    destinationCard.appendChild(imageDiv);
                    destinationCard.appendChild(destinationName);
                    destinationCard.appendChild(destinationDescription);
                    destinationCard.appendChild(activities);
                    destinationCard.appendChild(bestTime);
                    destinationCard.appendChild(recommendedDuration);
                    destinationCard.appendChild(funFact);

                    destinationsGrid.appendChild(destinationCard);
                });
            }
        })
        .catch(error => console.error('Error loading all destinations:', error));
}

