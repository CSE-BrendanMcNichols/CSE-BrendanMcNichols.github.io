class Planet {
    constructor(name, diameter, distanceFromSun, moons, fact, image, orbitalPeriod) {
        this.name = name;
        this.diameter = diameter;
        this.distanceFromSun = distanceFromSun;
        this.moons = moons;
        this.fact = fact;
        this.image = image;
        this.orbitalPeriod = orbitalPeriod;
    }

    getSection() {
        return `
            <div class="planet-box" onclick="showDetails('${this.name}')">
                <h3>${this.name}</h3>
                <img src="images/${this.image}" alt="${this.name}">
            </div>
        `;
    }

    getExpandedSection() {
        return `
            <p><strong>Diameter:</strong> ${this.diameter}</p>
            <p><strong>Distance from Sun:</strong> ${this.distanceFromSun} million km</p>
            <p><strong>Moons:</strong> ${this.moons}</p>
            <p><strong>Orbital Period:</strong> ${this.orbitalPeriod} Earth days</p>
            <p><strong>Fun Fact:</strong> ${this.fact}</p>
        `;
    }
}

const planets = [
    new Planet("Mercury", "4,880 km", "57.9", "0", "Mercury is the smallest planet.", "mercury.jpeg", 88),
    new Planet("Venus", "12,104 km", "108.2", "0", "Venus has the hottest surface temperatures.", "venus.jpg", 225),
    new Planet("Earth", "12,742 km", "149.6", "1", "Earth is the only planet known to support life.", "earth.jpg", 365),
    new Planet("Mars", "6,779 km", "227.9", "2", "Mars has the largest volcano in the solar system.", "mars.jpeg", 687),
    new Planet("Jupiter", "139,820 km", "778.5", "79", "Jupiter is the largest planet in the solar system.", "jupiter.jpg", 4,333),
    new Planet("Saturn", "116,460 km", "1,429", "83", "Saturn has the most spectacular rings.", "saturn.jpg", 10,759),
    new Planet("Uranus", "50,724 km", "2,871", "27", "Uranus rotates on its side.", "uranus.jpg", 30,687),
    new Planet("Neptune", "49,244 km", "4,495", "14", "Neptune has the fastest winds in the solar system.", "neptune.jpg", 60,190)
];


function displayPlanets() {
    const planetContainer = document.getElementById("planetContainer");
    planets.forEach(planet => {
        planetContainer.innerHTML += planet.getSection();
    });
}

function showDetails(planetName) {
    const planet = planets.find(p => p.name === planetName);
    document.getElementById('modalTitle').innerText = planet.name;
    document.getElementById('modalContent').innerHTML = `
        <img src="images/${planet.image}" alt="${planet.name}" style="width: 200px; float: left; margin-right: 20px;">
        ${planet.getExpandedSection()}
    `;
    document.getElementById('planetModal').style.display = 'block';
}

displayPlanets();
