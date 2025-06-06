// global vars
let closeModalBtn;
let modalContainer;
let backDrop;

let currentImageIndex = 0;
let currentDataIndex = 0;

// for the three images
let experienceGrid;

// interval
let slideInterval;

const experienceData = [
        {
            title: "Timeless <br>Elegance",
            imageUrl: [
                "/img/modal-feature-images/modal/Timeless1.jpg",
                "/img/modal-feature-images/modal/Timeless2.jpg",
                "/img/modal-feature-images/modal/Timeless3.jpg"
            ],
            description: `Step into an atmosphere where every detail speaks luxury.  
            At Imperial Grand, dining is more than a meal — it's an immersive experience in comfort and refinement.
            <br><br>Surrounded by rich textures, warm lighting, and timeless design, you'll find yourself savoring not just the cuisine, but the moment itself.`
        },
        {
            title: "Celebrations <br>Redefined",
            imageUrl: [

            ],
            description: `Celebrate your milestones in grandeur. Our private event spaces are tailored to host everything from intimate gatherings to extravagant soirées.
            <br><br>Enjoy curated menus, customizable layouts, and a dedicated team ensuring your event is nothing short of perfection.`
        },
        {
            title: "Chef’s <br>Signature Tasting",
            imageUrl: [
                "/img/modal-feature-images/modal/Authentic1.jpg",
                "/img/modal-feature-images/modal/Authentic2.jpg",
                "/img/modal-feature-images/modal/Authentic3.jpg"
            ],
            description: `Embark on a culinary journey guided by the imagination of our executive chef. Each dish in our tasting menu tells a story through flavor, technique, and presentation.
            <br><br>Seasonal ingredients and innovative flair come together to surprise and delight even the most refined palates.`
        }
    ];

document.addEventListener("DOMContentLoaded", function(){
    initGlobalVar();
    initModalContent();
    initThreeCardImages();
});


function initGlobalVar(){
    backDrop = document.getElementById("modal-backdrop");
    modalContainer = document.getElementById("experience-modal");
    closeModalBtn = document.querySelector(".close-modal-btn");
    experienceGrid = document.querySelector(".experience-grid");
}

function initModalContent(){
    closeModalBtn.addEventListener("click", ()=>{
        modalContainer.classList.remove("show");
        modalContainer.classList.add("hidden");
        backDrop.classList.add("hidden");
        clearInterval(slideInterval);
    });

    modalContainer.addEventListener("animationend", ()=>{
        if(modalContainer.classList.contains("hidden")){
            modalContainer.style.display = "none";
        }
    });

    backDrop.addEventListener("click", ()=>{
        modalContainer.classList.remove("show");
        modalContainer.classList.add("hidden");
        backDrop.classList.add("hidden");
        clearInterval(slideInterval);
    });
}

// find the id of one of the three images so modal will show (more details)
function initThreeCardImages(){
    experienceGrid.addEventListener("click", (e) => {
        const clickedCard = e.target.closest(".experience-image");
        if(!clickedCard) return
        const cardId = clickedCard.id;
        console.log("User clicked:", cardId);

        switch(cardId){
            case "portrait":
                showModalData(0);
                break;
            case "image-1":
                showModalData(1);
                break;
            case "image-2":
                showModalData(2);
                break;
        }
    });
}

function showModalData(index){
    const data = experienceData[index];
    const imageSize = data.imageUrl.length;

    currentDataIndex = index;
    console.log(data.title);

    document.querySelector(".modal-title").innerHTML = data.title;
    document.querySelector(".modal-description").innerHTML = data.description;
    document.querySelector(".modal-image").src = data.imageUrl[0];

    // add little circles/dots
    createDots(imageSize)

    slideInterval = setInterval(()=>{
        currentImageIndex = (currentImageIndex + 1) % data.imageUrl.length;
        updateImage(data);
    }, 2000);

    showModalUI();    
}

function createDots(size){
    const dotDiv = document.querySelector(".dot-container");

    dotDiv.innerHTML = ``;

    for(let i = 0; i < size; i++){
        const spanDot = document.createElement("span");
        spanDot.classList.add("dot");
        if(i === 0){
            spanDot.classList.add("active");
        }
        dotDiv.appendChild(spanDot);
    }
}

function updateImage(){
    const data = experienceData[currentDataIndex];

    document.querySelector(".modal-image").src = data.imageUrl[currentImageIndex];

    const dots = document.querySelectorAll(".dot");

    dots.forEach(dot => dot.classList.remove("active"));

    if(dots[currentImageIndex]){
        dots[currentImageIndex].classList.add("active");
    }
}

function showModalUI(){
    modalContainer.style.display = "block"
    modalContainer.classList.add("show");
    modalContainer.classList.remove("hidden");
    backDrop.classList.add("show")
    backDrop.classList.remove("hidden");
}

function removeModalUI(){
    modalContainer.classList.remove("show");
    modalContainer.classList.add("hidden");
    backDrop.classList.add("hidden");
}