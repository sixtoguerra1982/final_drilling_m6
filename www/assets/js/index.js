window.addEventListener('load',
    function () {
        setTimeout(async () => {

            let initialPost = document.getElementById("initial-post-it");
            initialPost.style.display = "none";

            let data = await chargeAnime();
            drawPostIt(data);
        }, 500);
    }, false);

function chargeAnime() {
    return new Promise((resolve,reject) => {
        try {
            fetch("/api/v1/anime")
            .then(response => response.json())
            .then(data => resolve(data));    
        } catch (error) {
            reject(error);
        }
        
    });
}

function drawPostIt(data) {
    const main = document.getElementById("main");
    let keys = Object.keys(data);
    for (let k of keys) {
        // console.log(data[k]) `${}`
        let draw = `
        <div class="container-inner">
            <div class="sticky-container">
                <div class="sticky-outer">
                    <div class="sticky">
                        <svg width="0" height="0">
                            <defs>
                                <clipPath id="stickyClip" clipPathUnits="objectBoundingBox">
                                    <path
                                        d="M 0 0 Q 0 0.69, 0.03 0.96 0.03 0.96, 1 0.96 Q 0.96 0.69, 0.96 0 0.96 0, 0 0"
                                        stroke-linejoin="round" stroke-linecap="square" />
                                </clipPath>
                            </defs>
                        </svg>
                        <div class="sticky-content">
                            ${JSON.stringify(data[k],null,2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        main.innerHTML += draw
    }
}