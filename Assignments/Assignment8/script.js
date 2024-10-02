const imagesArray = [
    {src: 'images/birthday.jpg', title: 'Birthday', desc: "Let's celebrate!"},
    {src: 'images/clown.jpg', title: 'Clown', desc: "It's party time!"},
    {src: 'images/rain.jpg', title: 'Rain', desc: "I think it’s time to bring your umbrella."},
    {src: 'images/read.jpg', title: 'Read', desc: "Time to read and relax."},
    {src: 'images/shovel.jpg', title: 'Shovel', desc: "Ready to dig and work!"},
    {src: 'images/work.jpg', title: 'Work', desc: "Let's get things done."}
];

const loadImages = () => {
    const gallery = document.getElementById('image-gallery');
    imagesArray.forEach(image => {
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.title;
        img.addEventListener('click', () => displayInfo(image.title, image.desc));
        gallery.appendChild(img);
    });
};

const displayInfo = (title, desc) => {
    document.getElementById('image-title').innerText = title;
    document.getElementById('image-desc').innerText = desc;
};

window.onload = () => loadImages();
