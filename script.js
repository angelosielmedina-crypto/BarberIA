let usuario = {};
let cita = {};

// Mostrar pantallas con transición
function mostrarPantalla(id){
  document.querySelectorAll('.pantalla').forEach(p=>{
    p.classList.remove('visible');
  });
  setTimeout(()=> {
    document.getElementById(id).classList.add('visible');
  }, 100);
}

// Inicio de sesión
function login(){
  usuario.telefono = document.getElementById('loginTel').value;
  mostrarPantalla('principal');
  cargarCitas();
}

// Mostrar menú de cortes si se selecciona "Corte de cabello"
function toggleCortes(checkbox){
  document.getElementById('menuCortes').style.display = checkbox.checked ? 'block' : 'none';
}

// Guardar servicios seleccionados
function guardarServicios(){
  let servicios = [];
  document.querySelectorAll('#servicios input[type=checkbox]:checked').forEach(s=>{
    if(s.value === "Corte de cabello"){
      let tipo = document.getElementById('tipoCorte').value;
      servicios.push(`${s.value} (${tipo})`);
    } else {
      servicios.push(s.value);
    }
  });
  cita.servicios = servicios;
  generarFechas();
  mostrarPantalla('fecha');
}

// Generar fechas (2 semanas, sin martes)
function generarFechas(){
  let select = document.getElementById('selectFecha');
  select.innerHTML = "";
  let hoy = new Date();
  for(let i=0;i<14;i++){
    let fecha = new Date(hoy);
    fecha.setDate(hoy.getDate()+i);
    if(fecha.getDay()!=2){ // no martes
      let fStr = fecha.toISOString().split('T')[0];
      select.innerHTML += `<option value="${fStr}">${fStr}</option>`;
    }
  }
}

// Guardar fecha seleccionada
function guardarFecha(){
  cita.fecha = document.getElementById('selectFecha').value;
  generarHoras();
  mostrarPantalla('hora');
}

// Generar horas disponibles
function generarHoras(){
  let select = document.getElementById('selectHora');
  select.innerHTML = "";
  for(let h=8;h<=20;h++){
    select.innerHTML += `<option value="${h}:00">${h}:00</option>`;
  }
}

// Guardar hora seleccionada
function guardarHora(){
  cita.hora = document.getElementById('selectHora').value;
  mostrarPantalla('datos');
}

// Guardar datos personales
function guardarDatos(){
  cita.nombre = document.getElementById('nombre').value;
  cita.telefono = document.getElementById('telefono').value;
  document.getElementById('detalleCita').innerHTML = `
    <div class="cita-card">
      <p><b>Nombre:</b> ${cita.nombre}</p>
      <p><b>Teléfono:</b> ${cita.telefono}</p>
      <p><b>Servicios:</b> ${cita.servicios.join(', ')}</p>
      <p><b>Fecha:</b> ${cita.fecha}</p>
      <p><b>Hora:</b> ${cita.hora}</p>
    </div>
  `;
  mostrarPantalla('resumen');
}

// Confirmar cita
function confirmarCita(){
  alert("Cita confirmada. Se enviará un recordatorio al número registrado.");
  if(!usuario.citas) usuario.citas=[];
  usuario.citas.push({...cita});
  mostrarPantalla('principal');
  cargarCitas();
}

// Cargar citas del usuario
function cargarCitas(){
  let div = document.getElementById('misCitas');
  div.innerHTML="";
  if(usuario.citas){
    usuario.citas.forEach((c,i)=>{
      div.innerHTML += `
        <div class="cita-card">
          <p><b>${c.fecha}</b> - ${c.hora}</p>
          <p>${c.servicios.join(', ')}</p>
          <button class="btn" onclick="cancelarCita(${i})">Cancelar</button>
        </div>
      `;
    });
  }
}

// Cancelar cita (solo hasta 2 días antes)
function cancelarCita(i){
  let hoy = new Date();
  let fechaCita = new Date(usuario.citas[i].fecha);
  let diff = (fechaCita - hoy)/(1000*60*60*24);
  if(diff>=2){
    usuario.citas.splice(i,1);
    cargarCitas();
    alert("Cita cancelada, espacio liberado.");
  } else {
    alert("Solo puedes cancelar o reagendar hasta 2 días antes.");
  }
}