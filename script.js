let usuario={}
let cita={}

function mostrarPantalla(id){

document.querySelectorAll(".pantalla").forEach(p=>{
p.classList.remove("visible")
})

document.getElementById(id).classList.add("visible")

}

function login(){

let tel=document.getElementById("loginTel").value

if(tel===""){
alert("Ingresa teléfono")
return
}

usuario.telefono=tel

mostrarPantalla("principal")

cargarCitas()

}

function toggleCortes(cb){

document.getElementById("menuCortes").style.display=
cb.checked?"block":"none"

}

function guardarServicios(){

let servicios=[]

let check=document.querySelectorAll("#servicios input[type=checkbox]:checked")

if(check.length==0){
alert("Selecciona servicio")
return
}

check.forEach(s=>{

if(s.value==="Corte de cabello"){

let tipo=document.querySelector("input[name=tipoCorte]:checked")

if(!tipo){
alert("Selecciona tipo de corte")
return
}

servicios.push("Corte ("+tipo.value+")")

}else{

servicios.push(s.value)

}

})

cita.servicios=servicios

generarFechas()

mostrarPantalla("fecha")

}

function generarFechas(){

let select=document.getElementById("selectFecha")

select.innerHTML=""

let hoy=new Date()

for(let i=0;i<14;i++){

let f=new Date()

f.setDate(hoy.getDate()+i)

if(f.getDay()!=2){

let str=f.toISOString().split("T")[0]

select.innerHTML+=`<option value="${str}">${str}</option>`

}

}

}

function guardarFecha(){

cita.fecha=document.getElementById("selectFecha").value

generarHoras()

mostrarPantalla("hora")

}

function generarHoras(){

let select=document.getElementById("selectHora")

select.innerHTML=""

for(let h=8;h<=20;h++){

select.innerHTML+=`<option value="${h}:00">${h}:00</option>`

}

}

function guardarHora(){

cita.hora=document.getElementById("selectHora").value

mostrarPantalla("datos")

}

function guardarDatos(){

cita.nombre=document.getElementById("nombre").value
cita.telefono=document.getElementById("telefono").value

document.getElementById("detalleCita").innerHTML=`

<div class="cita-card">

<p><b>Nombre:</b> ${cita.nombre}</p>

<p><b>Teléfono:</b> ${cita.telefono}</p>

<p><b>Servicios:</b> ${cita.servicios.join(", ")}</p>

<p><b>Fecha:</b> ${cita.fecha}</p>

<p><b>Hora:</b> ${cita.hora}</p>

</div>

`

mostrarPantalla("resumen")

}

function confirmarCita(){

alert("Cita confirmada")

if(!usuario.citas)usuario.citas=[]

usuario.citas.push({...cita})

mostrarPantalla("principal")

cargarCitas()

}

function cargarCitas(){

let div=document.getElementById("misCitas")

div.innerHTML=""

if(usuario.citas){

usuario.citas.forEach((c,i)=>{

div.innerHTML+=`

<div class="cita-card">

<p><b>${c.fecha}</b> ${c.hora}</p>

<p>${c.servicios.join(", ")}</p>

<button class="btn" onclick="cancelarCita(${i})">
Cancelar
</button>

</div>

`

})

}

}

function cancelarCita(i){

let hoy=new Date()

let fecha=new Date(usuario.citas[i].fecha)

let diff=(fecha-hoy)/(1000*60*60*24)

if(diff>=2){

usuario.citas.splice(i,1)

cargarCitas()

alert("Cita cancelada")

}else{

alert("Solo puedes cancelar 2 días antes")

}

}
