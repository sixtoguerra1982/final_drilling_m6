window.addEventListener('load',
    function () {
        setTimeout(async () => {

            let initialPost = document.getElementById("initial-post-it");
            initialPost.style.display = "none";

            let data = await chargeAnime();
            drawPostIt(data);


            let btnNew = document.getElementById("btn_new");
            btnNew.addEventListener('click', (event) => {
                event.preventDefault();
                newForm(event);
            })

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
};

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
        main.innerHTML += draw;
    };
};


function newForm(event) {
    
    const modals = document.querySelectorAll(".modal");
    const modalCloseButtons = document.querySelectorAll(".modal-close");
    
    toggleModal(event.currentTarget.getAttribute("data-modal-target"));
    
    modalCloseButtons.forEach(elem => {
      elem.addEventListener("click", event => toggleModal(event.currentTarget.closest(".modal").id));
    });
    modals.forEach(elem => {
      elem.addEventListener("click", event => {
        if(event.currentTarget === event.target) toggleModal(event.currentTarget.id);
      });
    });  
}

// Close Modal with "Esc"...
document.addEventListener("keydown", event => {
  if(event.keyCode === 27 && document.querySelector(".modal.modal-show")) {
    toggleModal(document.querySelector(".modal.modal-show").id);
  }
});

function toggleModal(modalId) {
  const modal = document.getElementById(modalId);

  if(getComputedStyle(modal).display==="flex") { // alternatively: if(modal.classList.contains("modal-show"))
    modal.classList.add("modal-hide");
    setTimeout(() => {
      document.body.style.overflow = "initial";
      modal.classList.remove("modal-show", "modal-hide");
      modal.style.display = "none";      
    }, 200);
  }
  else {
    document.body.style.overflow = "hidden";
    modal.style.display = "flex";
    modal.classList.add("modal-show");
  }
}

function guardarComic() {
    // Obtener los valores del formulario
    let nombre = document.getElementById("nombre").value;
    let genero = document.getElementById("genero").value;
    let anio = document.getElementById("anio").value;
    let autor = document.getElementById("autor").value;

    let comic = {
        nombre: nombre,
        genero: genero,
        año: anio,
        autor: autor
    };
    // Realizar la solicitud POST con Fetch
    fetch("/api/v1/anime", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(comic)
    })
    .then(response => response.json())
    .then(data => {

        alert("Cómic guardado correctamente:\n\nNombre: " + comic.nombre + "\nGénero: " + comic.genero + "\nAño: " + comic.año + "\nAutor: " + comic.autor);
        toggleModal(document.querySelector(".modal.modal-show").id);

        let obj = {
            "1": comic
        };

        drawPostIt(obj);

        document.getElementById("comicForm").reset();

        console.log(data);
    })
    .catch(error => {
        console.error("Error al realizar la solicitud:", error);
    });
    
    // Devolver false para evitar que el formulario se envíe al servidor
    return false;
}