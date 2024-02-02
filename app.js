const express = require('express');
const path = require('path');
const sqlite3 = require("sqlite3");
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = new sqlite3.Database('./Cars.db',sqlite3.OPEN_READWRITE, (err)=>{
  if (err) return console.error(err.message);

  console.log("Uspjesno povezana baza")
})

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

db.run(`
CREATE TABLE IF NOT EXISTS cars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT,
  model TEXT,
  power TEXT,
  drive TEXT,
  engine TEXT,
  weight TEXT,
  registration TEXT UNIQUE
)`,
(err)=>{
  if(err) console.error(err.message);
  console.log("Tablica uspjesno kreirana")
})

app.get("/",(req,res)=>{
  db.all('SELECT * FROM Cars', (err, cars)=>{
    if (err) console.error(err.message);
    res.render("index",{cars})
  })
    
})

app.get("/addCar",(req,res)=>{
    res.render("addCar")
})

app.post("/addCar",(req,res)=>{
  const { brand, model, power, drive, engine, weight, registration } = req.body;
  const query = `
      INSERT INTO cars (brand, model, power, drive, engine, weight, registration)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  db.run(query,[brand, model, power, drive, engine, weight, registration],(err)=>{
    if(err) console.error(err.message);
    console.log("Auto dodan u bazu")
    res.redirect('/');
  })

})

app.delete("/deleteCar/:id",(req,res)=>{
let carId = req.params.id;

db.run(`DELETE FROM cars WHERE id=?`,[carId],(err)=>{
  if(err){
    console.error(err.message);
    return res.status(500).json({error: 'Internal server error'})
  }
  console.log("Auto upjesno izbrisan")
  res.json({ success: true });
})

})

app.get('/getCars', (req, res) => {
  db.all('SELECT * FROM cars', (err, cars) => {
      if (err) {
          console.error('Greška pri dohvaćanju podataka iz baze:', err.message);
          return res.status(500).send('Internal Server Error');
      }

      res.json({ cars }); 
  });
});


app.put("/updateCar/:id",(req,res)=>{
  let carId = req.params.id;
  const updatedCarData = req.body;

  db.run(`UPDATE cars SET brand =?, model =?, power=?, drive=?, engine=?, weight=?, registration=? WHERE id =?`,
  [
    updatedCarData.brand,
    updatedCarData.model,
    updatedCarData.power,
    updatedCarData.drive,
    updatedCarData.engine,
    updatedCarData.weight,
    updatedCarData.registration,
    carId
  ], function(err){
  if (err) {return console.error(err.message)}
  console.log(`Row(s) updated: ${this.changes}`);
  res.send(`Row(s) updated: ${this.changes}`);
}
  )
})



//ERROR Site

app.use((req, res) => {
    res.status(404);
  });

//POKRETANJE SERVERA
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});