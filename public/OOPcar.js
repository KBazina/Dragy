let allCars=[]
fetch('/getCars')
    .then(response => response.json())
    .then(data => {
        const cars = data.cars;
        cars.forEach((car) => {
  
            let CAR = {
                id:car.id,
                brand:`${car.brand}`,
                model:`${car.model}`,
                power:`${car.power}`,
                drive:`${car.drive}`,
                weight:`${car.weight}`,
                engine:`${car.engine}`,
                registration:`${car.registration}`
            }
            allCars.push(CAR)
        });
    })
    .catch(error => console.error('Greška pri dohvaćanju podataka:', error));


//ZA BRISANJE AUTA
let Btns = document.querySelectorAll(".DelBtn")

Btns.forEach((btn)=>{
    btn.addEventListener("click",()=>{
        let id = btn.getAttribute("id")
        fetch(`/deleteCar/${parseInt(id)}`,{method:"DELETE"},
        )
        .then((response) => response.json())
        .then(()=>{
        
            location.reload();
        })
        .catch((error)=>{
            console.error("Greška prilikom brisanja automobia",error)
        })
    })
})
// ZA TRKANJE
let intervalId;
let RaceBtns = document.querySelectorAll(".RaceBtn")
let RaceArray = []
RaceBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        btn.style.backgroundColor = "darkgreen";
        btn.innerText="RACING"
        btn.style.cursor = 'not-allowed';
        btn.disabled = true;
        let TargetCar = (allCars.find(CAR => CAR.id === parseInt(btn.getAttribute("id"))))
        RaceArray.push(TargetCar);
    let brojac=1
    let circle2=document.querySelector('.circle2')
    let circle1=document.querySelector('.circle1')
    let circle3=document.querySelector('.circle3')
        if(RaceArray.length===1){
            document.querySelector("h2").style.textDecoration="underline"
            intervalId = setInterval(() => {
                switch(brojac){
                    case 1:circle1.style.display="inline-block";
                    circle1.style.backgroundColor="red"
                    circle2.style.display="none"
                    circle3.style.display="none"
                    brojac++;
                        break;
                    case 2:circle2.style.display="inline-block"
                    circle2.style.backgroundColor="goldenrod"
                    brojac++;
                        break;
                    case 3:circle3.style.display="inline-block"
                            circle1.style.backgroundColor="green"
                            circle2.style.backgroundColor="green"
                            circle3.style.backgroundColor="green"
                            brojac=1;
                            break;
                }
            }, 1200);
        }
        let RaceUl = document.querySelector(".RaceUl")
        let li = document.createElement("li")
        li.innerHTML = `<img  src="auto_ikona - Copy.png" id="${TargetCar.id}" class="sPic ${TargetCar.id}" alt=""> <b>${TargetCar.brand}</b> ${TargetCar.registration} 
        <button id="${TargetCar.id}" class="RaceDel">VRATI</button>
        <hr/>`
        RaceUl.appendChild(li)
        document.querySelectorAll(".RaceDel").forEach(btn=>{
            btn.addEventListener("click",(event)=>{
                let TargetCarDEL= (RaceArray.find(CAR => CAR.id === parseInt(event.target.id)))
                let parentLi = event.target.closest('li');
                let indexOfCar = RaceArray.indexOf(TargetCarDEL);
                if(TargetCarDEL) RaceArray.splice(indexOfCar, 1);
                parentLi.remove();
                document.querySelectorAll(".RaceBtn").forEach(RcBtn=>{
                    if(RcBtn.id===event.target.id){
                        RcBtn.style.cursor="pointer"
                        RcBtn.disabled = false
                        RcBtn.style.backgroundColor="rgb(120, 158, 43)"
                        RcBtn.innerText="RACE"  
                    }
                }

                )
                if(RaceArray.length===0){clearInterval(intervalId);
                    document.querySelectorAll(".circle").forEach(circle=>{  
                        circle.style.display="none"
                    })
                }
            })
        })
    })
})


document.querySelector("h2").addEventListener("click",() =>{
    document.querySelectorAll(".RaceBtn").forEach(RcBtn=>{
            RcBtn.style.cursor="pointer"
            RcBtn.disabled = false
            RcBtn.style.backgroundColor="rgb(120, 158, 43)"
            RcBtn.innerText="RACE"     
    })
    document.querySelectorAll(".RaceDel").forEach(btn=>{
        btn.remove()
    })
   
    if(document.querySelector("h2").innerText==="STOP RACING"){
        document.querySelector("h2").innerHTML=`RACE
        <span class="circle circle1"></span>
        <span class="circle circle2"></span>
        <span class="circle circle3"></span>`
        let djeca = document.querySelector('.RaceUl').children
        Array.from(djeca).forEach(li => {
            li.remove();
        });
        RaceArray=[]
    }
    if(RaceArray.length>0){
        document.querySelector("h2").innerText="STOP RACING"
        document.querySelectorAll(".RaceBtn").forEach(btn=>{
            btn.disabled=true
            btn.style.cursor="not-allowed"
        })
    }
    document.querySelector("h2").style.textDecoration="none"
    clearInterval(intervalId);
    document.querySelectorAll(".circle").forEach(circle=>{
        circle.style.display="none"
    })
    let imgs = document.querySelectorAll(".sPic")
    imgs.forEach(img=>{
        let TargetCar = (allCars.find(CAR => CAR.id === parseInt(img.getAttribute("id"))))
        if (TargetCar.drive === "AWD") {
            ET=5.9*(((TargetCar.weight*2.2046)/TargetCar.power)**(1/3))
        }
        else if (TargetCar.drive === "FWD") {
            ET=6.18*(((TargetCar.weight*2.2046)/TargetCar.power)**(1/3))
        }
        else ET=6.29*(((TargetCar.weight*2.2046)/TargetCar.power)**(1/3))
        img.style.transition=`${ET}s ease-in`
        img.classList.add("fRight");
    })
})

// UPDATE

const openModal = (id) =>{
    let modalWindow = document.querySelector(" .popup-modal")
    modalWindow.style.display="block"
    let overlay = document.querySelector(".overlay")
    overlay.style.display="block"
    let TargetCar = (allCars.find(CAR => CAR.id === parseInt(id)))
    let forma = document.querySelector("#carFormUp")
    forma.querySelector("#brand").value = TargetCar.brand;
    forma.querySelector("#model").value = TargetCar.model;
    forma.querySelector("#power").value = TargetCar.power;
    forma.querySelector("#drive").value = TargetCar.drive;
    forma.querySelector("#engine").value = TargetCar.engine;
    forma.querySelector("#weight").value = TargetCar.weight;
    forma.querySelector("#registration").value = TargetCar.registration;

    document.querySelector(".UpCar").setAttribute("id",id)

 }
 const closeModal = () => {
    let modalWindow = document.querySelector(" .popup-modal")
    modalWindow.style.display="none "
    let overlay = document.querySelector(".overlay")
    overlay.style.display="none"
 }

 const SendCarData=() =>{
    let id = document.querySelector(".UpCar").getAttribute("id")
    let forma = document.querySelector("#carFormUp")
    const updatedCarData = {
        brand: forma.querySelector("#brand").value,
        model: forma.querySelector("#model").value,
        power: forma.querySelector("#power").value,
        drive: forma.querySelector("#drive").value,
        engine: forma.querySelector("#engine").value,
        weight: forma.querySelector("#weight").value,
        registration: forma.querySelector("#registration").value
    };
    fetch(`/updateCar/${parseInt(id)}`,{
        method:"PUT",
        headers: {
             'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCarData)
    }).then(response => response.text())
    .then(data=> {
        location.reload()
    }).catch(error=>{
        console.error(error)
    })
}
 