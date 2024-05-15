document.addEventListener("DOMContentLoaded", function() {
    const backgrounds = [
        "images/backgrounds/background10.png",
        "images/backgrounds/background11.png",
        "images/backgrounds/battle_city.png",
        "images/backgrounds/or_as_beach_.png",
        "images/backgrounds/battle_city.png",
        "images/backgrounds/wifi.jpg"
    ];

    const changeBackgroundBtn = document.getElementById("changeBackgroundBtn");

    changeBackgroundBtn.addEventListener("click", function() {
        // Randomly select a background image from the backgrounds array
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        const selectedBackground = backgrounds[randomIndex];

        // Update the background image of the body
        document.body.style.backgroundImage = `url('${selectedBackground}')`;
    });
});
