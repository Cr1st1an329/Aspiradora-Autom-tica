import './style.css'
import 'tw-elements'
import ImaBasura from './IMG/Basura.png'
import ImgAspi from './IMG/Aspiradora.png'
import { Coordinates } from './entities/Coordinates'
import { Sector } from './entities/Sector'

document.querySelector('#app').innerHTML = `
<div class="flex flex-col items-center justify-between min-h-screen bg-gray-200">
    <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm mt-8">
    <form id="formSim">
      <div class="form-group mb-6">
        <input id="txtAttempt" type="number" class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Intentos de aspirar" >
      </div>
      <div class="form-group mb-6">
        <input id="txtQuantity" type="number" class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Numero de basura" >
      </div>
      <button id="btnRun" type="submit" class="w-full px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transitioncleaner duration-150 ease-in-out">Iniciar simulacion</button>
      <div>
        <h2 class="try-title">Intentos de aspirar: <span id="cleanTry">0</span></h2>
      </div>
      </form>
    </div>
  <div class="simulation">
    <div class="main">

      <div id="sideA" class="location">
        <div class="trash-wrapper">
          <img id="CuadranteA-1" class="img img-trash" src="${ImaBasura}" />
        </div>
        <div class="trash-wrapper">
          <img id="CuadranteA-2" class="img img-trash" src="${ImaBasura}" />
        </div>
        <div class="trash-wrapper">
          <img id="CuadranteA-3" class="img img-trash" src="${ImaBasura}" />
        </div>
        <div class="trash-wrapper">
          <img id="CuadranteA-4" class="img img-trash" src="${ImaBasura}" />
        </div>
      </div>

      <div class="location-mid">
        <img id="vaccum" class="img img-vaccum" src="${ImgAspi}" />
      </div>
      
      <div id="sideB" class="location">
        <div class="trash-wrapper">
          <img id="CuadranteB-1" class="img img-trash" src="${ImaBasura}" />
        </div>
        <div class="trash-wrapper">
          <img id="CuadranteB-2" class="img img-trash" src="${ImaBasura}" />
        </div>
        <div class="trash-wrapper">
          <img id="CuadranteB-3" class="img img-trash" src="${ImaBasura}" />
        </div>

        <div class="trash-wrapper">
          <img id="CuadranteB-4" class="img img-trash" src="${ImaBasura}" />
        </div>
      </div>
    </div>
  </div>
  
</div>
`
// Agregar un evento de escucha al formulario para el evento 'submit'
const formSim = document.getElementById('formSim')

formSim.addEventListener('submit', event => {
  event.preventDefault()
  start()
})

// Definición de la posición inicial de la aspiradora y su estado
const vaccum = [
  new Coordinates(
    document.getElementById('vaccum').offsetLeft,
    document.getElementById('vaccum').offsetTop),
  0
]
// Declaración de variables globales
var attemptCounter = 0 //Esta variable se utiliza para llevar la cuenta de los intentos de limpieza realizados durante la simulación.
var trash = 0 //Se utiliza para llevar un registro del número de basuras presentes en el área de simulación en un momento dado.
var state = false //Es una bandera booleana que indica el estado de un sector en la simulación. Si el estado es true
var tiempo = undefined //Esta variable almacena el tiempo de espera antes de que se cree una nueva basura en la simulación. Se genera aleatoriamente entre 3 y 5 segundos.

const board = [{
  // Sectores en el lado A
  sector: [
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteA-1").offsetParent.offsetLeft + document.getElementById("CuadranteA-1").offsetLeft - 15,
        document.getElementById("CuadranteA-1").offsetParent.offsetTop + document.getElementById("CuadranteA-1").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteA-1")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteA-2").offsetParent.offsetLeft + document.getElementById("CuadranteA-2").offsetLeft - 15,
        document.getElementById("CuadranteA-2").offsetParent.offsetTop + document.getElementById("CuadranteA-2").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteA-2")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteA-3").offsetParent.offsetLeft + document.getElementById("CuadranteA-3").offsetLeft - 15,
        document.getElementById("CuadranteA-3").offsetParent.offsetTop + document.getElementById("CuadranteA-3").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteA-3")),
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteA-4").offsetParent.offsetLeft + document.getElementById("CuadranteA-4").offsetLeft - 15,
        document.getElementById("CuadranteA-4").offsetParent.offsetTop + document.getElementById("CuadranteA-4").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteA-4")
    )
  ],
  state: false
}, {
  // Sectores en el lado B
  sector: [
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteB-1").offsetParent.offsetLeft + document.getElementById("CuadranteB-1").offsetLeft - 15,
        document.getElementById("CuadranteB-1").offsetParent.offsetTop + document.getElementById("CuadranteB-1").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteB-1")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteB-2").offsetParent.offsetLeft + document.getElementById("CuadranteB-2").offsetLeft - 15,
        document.getElementById("CuadranteB-2").offsetParent.offsetTop + document.getElementById("CuadranteB-2").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteB-2")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteB-3").offsetParent.offsetLeft + document.getElementById("CuadranteB-3").offsetLeft - 15,
        document.getElementById("CuadranteB-3").offsetParent.offsetTop + document.getElementById("CuadranteB-3").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteB-3")
    ),
    new Sector(
      new Coordinates(
        document.getElementById("CuadranteB-4").offsetParent.offsetLeft + document.getElementById("CuadranteB-4").offsetLeft - 15,
        document.getElementById("CuadranteB-4").offsetParent.offsetTop + document.getElementById("CuadranteB-4").offsetTop - 10
      ),
      false,
      document.getElementById("CuadranteB-4")
    )
  ],
  state: false
}]
// Función para pausar la ejecución por un tiempo determinado
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
 // Mover la aspiradora hacia la izquierda
async function moveToLeft(x) {
  var step = 1
  var xi = document.getElementById('vaccum').offsetLeft
  while (xi > x) {
    xi = xi - step
    document.getElementById('vaccum').style.left = xi + "px"
    await sleep(10)
  }
}
// Mover la aspiradora hacia la derecha
async function moveToRight(x) {
  var step = 1
  var xi = document.getElementById('vaccum').offsetLeft

  while (xi < x) {
    xi = xi + step
    document.getElementById('vaccum').style.left = xi + "px"
    await sleep(10)
  }

}
// Mover la aspiradora hacia abajo
async function moveToDown(y) {

  var step = 1
  var yi = document.getElementById('vaccum').offsetTop
  while (yi < y) {
    yi = yi + step
    document.getElementById('vaccum').style.top = yi + "px"
    await sleep(10)
  }

}
// Mover la aspiradora hacia arriba
async function moveToUp(y) {
  var step = 1
  var yi = document.getElementById('vaccum').offsetTop
  while (yi > y) {
    yi = yi - step
    document.getElementById('vaccum').style.top = yi + "px"
    await sleep(10)
  }

}
// Función para mover la aspiradora a una posición específica
async function movervaccum(indice, sector) {
  // Mover la aspiradora a las coordenadas del sector dado
  const xi = document.getElementById('vaccum').offsetLeft
  const yi = document.getElementById('vaccum').offsetTop
  const x = board[indice].sector[sector].coordinates.x
  const y = board[indice].sector[sector].coordinates.y

  if (xi > x) {
    await moveToLeft(x)
  }
  if (xi < x) {
    await moveToRight(x)
  }
  if (yi < y) {
    await moveToDown(y)
  }
  if (yi > y) {
    await moveToUp(y)
  }

}
// Función para actualizar el estado del sector
function updateStateSector(x) {
  state = false
  board[x].sector.forEach((n, i) => {
    if (n.state) {
      board[x].state = true
      state = true
    }
  })

  if (!state) {
    board[x].state = false
  }

}
// Función para limpiar un sector determinado
async function cleaner(indice, sector) {
  await movervaccum(indice, sector)
  board[indice].sector[sector].state = false
  await updateStateSector(indice)
  await sleep(500)
  board[indice].sector[sector].img.style.visibility = "hidden"
  console.log("sector aspidaro...")
  trash = trash - 1
}
// Función para crear basura en un sector aleatorio
async function creartrash() {
  var indice = Math.floor(Math.random() * (2 - 0) + 0)
  var sector = Math.floor(Math.random() * (4 - 0) + 0)
  var tmp = board[indice].sector[sector]

  if (trash == 8) {
    console.log('error...')
    return
  }

  if (tmp.state == false) {
    tmp.img.style.visibility = true
    tmp.state = true
    tmp.img.style.visibility = "visible"
    updateStateSector(indice)
    return
  }

  creartrash()
}
// Función para llenar el tablero con basura
async function fillInBoard(x) {
  var valori = 1
  while (valori <= x) {
    while (trash == 8) {
      console.log("waite 10s meanwhile the vaccum clean...")
      await sleep(10000)
    }

    await creartrash()

    trash = trash + 1
    valori = valori + 1
    tiempo = (Math.floor(Math.random() * (5 - 3) + 3)) * 1000
    console.log(tiempo)
    await sleep(tiempo)
  }
}
// Función para cambiar de sector (lado A o lado B)
function changeSector() {
  if (vaccum[1] == 1) {
    vaccum[1] = 0
    return
  }
  vaccum[1] = 1
}
// Función principal para iniciar la simulación
function start() {
  document.getElementById("btnRun").disabled = true;

  // Generar números aleatorios para la cantidad de basura y los intentos
  let attempt = Math.floor(Math.random() * 10) + 1;
  let trashCounter = Math.floor(Math.random() * 10) + 1;

  // Mostrar los números aleatorios en los campos de entrada
  document.getElementById("txtAttempt").value = attempt;
  document.getElementById("txtQuantity").value = trashCounter;

  // Deshabilitar los campos de entrada
  document.getElementById("txtAttempt").disabled = true;
  document.getElementById("txtQuantity").disabled = true;

  // Continuar con la simulación
  fillInBoard(trashCounter);
  findAllTrash(attempt);
  document.getElementById("cleanTry").innerHTML = 0;
  attemptCounter = 0;
}
// Función recursiva para encontrar y limpiar toda la basura en los sectores
async function findAllTrash(attempt) {

  var sector = null


  for (var i = 0; i <= 3; i++) {
    if (board[vaccum[1]].sector[i].state) {
      sector = i
      break
    }
  }

  if (sector != null) {
    await cleaner(vaccum[1], sector)
    sector = null
  }

  if (!board[vaccum[1]].state) {
    await changeSector()
  }

  if (trash == 0) {
    await sleep(5000)
    sector = null
    attemptCounter += 1
    console.log(attemptCounter)
    document.getElementById("cleanTry").innerHTML = attemptCounter
  }

  if (attemptCounter >= attempt) {
    alert("Se han limpiado las zonas A y B")
    document.getElementById("btnRun").disabled = false
    return
  }
  
  findAllTrash(attempt)

}