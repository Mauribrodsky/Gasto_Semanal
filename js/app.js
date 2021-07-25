//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//Clases
class Presupuesto{
  constructor(presupuesto){
      this.presupuesto = Number(presupuesto);
      this.restante = Number(presupuesto);
      this.gastos = [];
  }

  nuevoGasto(gasto){
      this.gastos = [...this.gastos, gasto];
      this.calcularRestante();

  }

  calcularRestante(){
      const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
      this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id){
      this.gastos = this.gastos.filter(gasto => gasto.id !== id);
      this.calcularRestante();
  }
}

class UI{
  insertarPresupuesto(cantidad){
      //Extraemos el valor
      const{ presupuesto, restante } = cantidad;

      //Lo agregamos al HTML
      document.querySelector('#total').textContent = presupuesto;
      document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo){
      //Creamos un div
      const divMensaje = document.createElement('div');
      divMensaje.classList.add('text-center', 'alert');

      if(tipo === 'error'){
          divMensaje.classList.add('alert-danger');
      }else{
          divMensaje.classList.add('alert-success');
      }
      //Mensaje de error
      divMensaje.textContent = mensaje

      //Lo agregamos al HTML
      document.querySelector('.primario').insertBefore(divMensaje, formulario);

      //Quitamos el texto del HTML
      setTimeout(() => {
          divMensaje.remove();
      },3000);
  }

  mostrarGastos(gastos){

    this.limpiarHTML();//Elimina el HTML previo
      
    //Iteramos sobre los gastos
    gastos.forEach(gasto => {
        const {cantidad, nombre, id} = gasto;//DESTRUCTURING

        //Creamos un "LI"
        const nuevoGasto = document.createElement('li');
        nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
        nuevoGasto.dataset.id = id;

        
        //Agregamos el HTML del gasto
        nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span`;

        //Creamos boton para borrar el gasto
        const btnBorrar = document.createElement('button');
        btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
        btnBorrar.innerHTML = '&times;'
        btnBorrar.onclick = () => {
            eliminarGasto(id);
        }
        nuevoGasto.appendChild(btnBorrar);

        //Lo agregamos al HTML
        gastoListado.appendChild(nuevoGasto);
    })
  }
  limpiarHTML(){
      while(gastoListado.firstChild){
          gastoListado.removeChild(gastoListado.firstChild);
      }
  }
  actualizarRestante(restante){
      document.querySelector('#restante').textContent = restante;
  }
  comprobarPresupuesto(presupuestoObj){
      const{presupuesto, restante} = presupuestoObj;
      const restanteDiv = document.querySelector('.restante');

      //Comprueba el 25%
      if((presupuesto / 4) > restante){
          restanteDiv.classList.remove('alert-success', 'alert-warning');
          restanteDiv.classList.add('alert-danger');
      //Comprueba el 50%    
      }else if((presupuesto / 2) > restante){
          restanteDiv.classList.remove('alert-success');
          restanteDiv.classList.add('alert-warning');
      }else{
          restanteDiv.classList.remove('alert-danger', 'alert-warning');
          restanteDiv.classList.add('alert-success');
      }
      //Si el total es 0 o negativo
      if(restante <= 0){
          ui.imprimirAlerta("El presupuesto se ha agotado", 'error');

          formulario.querySelector('button[type="submit"]').disabled = true;
      }
  }
}

//Instanciamos UI
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Introduce tu presupuesto");

    //console.log(Number(presupestoUsuario));

    if(presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Añadimos gastos
function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar
    if(nombre === "" || cantidad === ""){
        ui.imprimirAlerta("Ambos campos son obligatorios", 'error');
        return;
    }else if( cantidad <= 0 || isNaN(cantidad)){
       ui.imprimirAlerta("Cantidad no válidad", 'error');
       return;
    }

    //Generamos un objeto con el gasto
    const gasto = {nombre, cantidad, id:Date.now()}//Esto une NOMBRE y CANTIDAD a GASTO

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Mensaje que avisa que está todo correcto
    ui.imprimirAlerta("Gasto agregado correctamente");

    //Imprimimos los gastos
    const {gastos, restante} = presupuesto;//Hacemos DESTRUCTURING de "presupuesto"
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reiniciamos el formulario
    formulario.reset();
}

function eliminarGasto(id){
    //Elimina los gastos del objeto
    presupuesto.eliminarGasto(id);
    
    //Elimina os gastos del HTML
    const {gastos, restante} = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}