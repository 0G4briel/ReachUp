// Verifica se o localstorage está vazio e insere dados nele.
if(localStorage.getItem('jsonmodel') == null)
{
   localStorage.setItem('jsonmodel','{"version":0.1,"shopping":"Praiamar Shopping","address":"R. Alexandre Martins, 80 - Aparecida, Santos - SP, 11025-202","metersByUnity":1,"widthUnits":52,"heightUnits":52,"triBeaconsPerFloor":3,"floors":[{"locates":[{"beacons":[{"uuid":"f7826da6-4fa2-4e98-8024-bc5b71e0893e","position":{"x":2,"y":3,"floor":0}}],"id":0,"position":{"x0":0,"y0":0,"x":5,"y":5,"floor":0}}],"halls":[[]],"triBeacons":[{"uuid":"","position":{"x":6,"y":6,"floor":0}}]},{"locates":[{"beacons":[{"uuid":"f7826da6-4fa2-4e98-8024-bc5b71e0893e","position":{"x":12,"y":3,"floor":0}}],"id":0,"position":{"x0":0,"y0":0,"x":24,"y":24,"floor":0}}],"halls":[[]],"triBeacons":[{"uuid":"","position":{"x":10,"y":10,"floor":0}}]},{"locates":[{"beacons":[{"uuid":"f7826da6-4fa2-4e98-8024-bc5b71e0893e","position":{"x":15,"y":7,"floor":0}}],"id":0,"position":{"x0":3,"y0":3,"x":9,"y":9,"floor":0}}],"halls":[[]],"triBeacons":[{"uuid":"","position":{"x":21,"y":21,"floor":0}}]},{"locates":[{"beacons":[{"uuid":"f7826da6-4fa2-4e98-8024-bc5b71e0893e","position":{"x":30,"y":9,"floor":0}}],"id":0,"position":{"x0":2,"y0":2,"x":3,"y":3,"floor":0}}],"halls":[[]],"triBeacons":[{"uuid":"","position":{"x":30,"y":30,"floor":0}}]}]}');
   clear();
}

//Váriaveis globais
var inDevelopment = true;

var colors = {
    hallColor: "#e3ff12",
    beaconColor: "#42ddf5",
    triBeaconColor: "#bd0000",
    IlocalColor: "#25a149",
    ElocalColor: "#03290e"
}

var setDrawExecutions = 0,
    currentFloor = 0,
    pendingAdditions = 0;

function setCurrentFloor(floor){ currentFloor = floor; }

function getCurrentFloor(){ return currentFloor; }

var mapJson = getJson(),
    mapWidth = mapJson.widthUnits,
    mapHeight = mapJson.heightUnits;

document.documentElement.style.setProperty('--squarePerRow', getWidthUnits());

function updateWidthUnits(value){
   document.documentElement.style.setProperty('--squarePerRow', value);
   mapWidth = value;
   //Alterar no json
   clear();
   mapJson = getJson();
   renderMap();
}

var triBeaconsLimit = mapJson.triBeaconsPerFloor;

function getTriBeaconsLimit(){ return triBeaconsLimit; }

function getWidthUnits(){ return mapWidth; }

function getHeightUnits(){ return mapHeight; }

function getMetersByUnity(){ return mapJson.metersByUnity; }

var numbersOfRoutes = 0,
    squaresCount = 0,
    firstRender = true;

//Arrays globais que contém objetos do mapa
var map = [],
    Ilocalmap = [],
    Elocalmap = [],
    beaconmap = [],
    localPositions = [],
    triBeaconmap = [],
    mapMarks = [];

function setMapLength(){
  mapMarks = new Array(mapWidth);
  for (var i = 0; i < mapMarks.length; i++) {
    mapMarks[i] = new Array(mapHeight);
  }
}

//Função que renderiza o mapa
function renderMap(){
    for (let y = 0; y < mapWidth; y++) {
       for (let x = 0; x < mapHeight; x++) {
            var square = document.createElement('div');
            square.setAttribute('class','square');
            square.setAttribute('id',x+","+y);
            $("#mapContainer").append(square);
       }
    }    
    hatchMap();
}

//Função que faz o desenho inicial do mapa
function hatchMap(){
    numbersOfRoutes = mapJson.floors[currentFloor].halls.length;
    log("ROUTES: " + numbersOfRoutes);
    //draw halls
    for (let i = 0; i < numbersOfRoutes; i++) {
            mapJson.floors[currentFloor].halls[i].forEach(element => {
            log(element);
                drawHalls(document.getElementById(element["x"]+","+element["y"]+""))

            });
    }

    //draw Ilocates
   
    mapJson.floors[currentFloor].locates.forEach(element => {
      drawILocates(document.getElementById(element.position["x0"]+","+element.position["y0"]+""));
    });

    //draw Elocates

    mapJson.floors[currentFloor].locates.forEach(element => {

        drawELocates(document.getElementById(element.position["x"]+","+element.position["y"]+""));
    });


    //draw beacons
  
    mapJson.floors[currentFloor].locates.forEach(element => {
        element.beacons.forEach(elementBeacon => {
            log(elementBeacon);
            try{
                 drawBeacons(document.getElementById(elementBeacon.position.x+","+elementBeacon.position.y+","+elementBeacon.uuid+""));
            }
            catch{
                log("error");
                log(elementBeacon);
            }
        })
    });
  

    // draw tri-beacons
    mapJson.floors[currentFloor].triBeacons.forEach(triBeacon => {
        drawTriBeacons(document.getElementById(triBeacon.position.x+","+triBeacon.position.y+","+triBeacon.uuid+""));
    });

    setDrawExecutions++;
}
//Função de log
function log(m){
    inDevelopment == true ? console.log(m) : null;
}


//Função que desenha na div passada pelo parâmetro
function draw(obj){
    let  cbHall = $("#cbHall").prop("checked");
    let  cbBeacon = $("#cbBeacon").prop("checked");
    let  cbTriBeacon = $("#cbTriBeacon").prop("checked");
    let  cbILocal = $("#cbILocal").prop("checked");
    let  cbELocal = $("#cbELocal").prop("checked");

    cbHall == true ? setDraw(colors.hallColor, obj, 'h') :
    cbBeacon == true ? setDraw(colors.beaconColor, obj, 'b') : 
    cbTriBeacon == true ? setDraw(colors.triBeaconColor, obj, 'tb') :
    cbILocal == true ? setDraw(colors.IlocalColor, obj, 'il') :
    cbELocal == true ? setDraw(colors.ElocalColor, obj,'el'): null;
  
}


//Função que seta o obj que será desenhado, neste caso é o "Hall"
function drawHalls(obj){
    setDraw(colors.hallColor, obj, 'h');
}

//Função que seta o obj que será desenhado, neste caso é a "posição inicial do Local"
function drawILocates(obj){
    setDraw(colors.IlocalColor, obj,'il');
}

//Função que seta o obj que será desenhado, neste caso é a "posição final do Local"
function drawELocates(obj){
    setDraw(colors.ElocalColor, obj,'el');
}

//Função que seta o obj que será desenhado, neste caso é o "beacon do local"
function drawBeacons(obj){
    setDraw(colors.beaconColor, obj,'b');
}

//Função que seta o obj que será desenhado, neste caso é o "beacon trilateral"
function drawTriBeacons(obj){
    setDraw(colors.triBeaconColor, obj,'tb');
}

//Faz o desenho propriamento dito e guarda nos arrays
function setDraw(color, obj, id){
    log(obj);
    var x = obj.id.split(',')[0];
    var y = obj.id.split(',')[1];
    if ((id == 'b' || id == 'tb') && setDrawExecutions == 0){
    var uuidExistingBeacon = obj.id.split(',')[2];
    }

        if(mapMarks[x][y] == null){
            mapMarks[x][y] = id;
            log(id);
            switch (id) {
                case 'h':
                    map.push({"x":parseInt(x), "y":parseInt(y)});
                    break;
                case 'il':
                    Ilocalmap.push({"x0":parseInt(x), "y0":parseInt(y), "floor": parseInt(currentFloor)});
                    break;
                case 'el':
                    Elocalmap.push({"x":parseInt(x), "y":parseInt(y), "floor": parseInt(currentFloor)});
                    break;
                case 'b':
                    var uuidNewBeacon = "";
                    if (setDrawExecutions > 0){
                    uuidNewBeacon = document.getElementById('uuid').value;
                    if (uuidNewBeacon == ""){
                        uuidNewBeacon = generateUUID();
                    }
                    beaconmap.push({
                        uuid: uuidNewBeacon,
                        position: {
                            "x":parseInt(x), "y":parseInt(y), "floor": parseInt(currentFloor)
                        }
                    });
                  }
                  else {
                    beaconmap.push({
                        uuid: uuidExistingBeacon,
                        position: {
                            "x":parseInt(x), "y":parseInt(y), "floor": parseInt(currentFloor)
                        }
                    });
                  }
                  break;
                case 'tb':
                    var uuidNewBeacon = "";
                    if (setDrawExecutions > 0){
                    uuidNewBeacon = document.getElementById('uuid').value;
                    if (uuidNewBeacon == ""){
                        uuidNewBeacon = generateUUID();
                    }
                    triBeaconmap.push({
                        uuid: uuidNewBeacon,
                        position: {
                            "x":parseInt(x), "y":parseInt(y), "floor": parseInt(currentFloor)
                        }
                    });
                  }
                  else {
                    triBeaconmap.push({
                        uuid: uuidExistingBeacon,
                        position: {
                            "x":parseInt(x), "y":parseInt(y), "floor": parseInt(currentFloor)
                        }
                    });
                  }
                    break;
    
                default:
                    break;
            }
            $(obj).css("background-color",color);
            //pendingAdditions++;
        }
    }

//Limpa tudo
function clearDraw(){
    map =[];
    setDrawExecutions = 0;
    $(".square").css("background-color","transparent");
    log("!MAP CLEANED!");
}

//Adiciona os corredores no json
function addHallToJson(){
 
    if(!isEmpty(map)){
        mapJson.floors[currentFloor].halls.push(map);
        
        setJson(JSON.stringify(mapJson));
        clearArrays();
    }

}

//Adiciona os locais no json
function addLocaltoJson(){
    if (beaconmap.length != Ilocalmap.length){
        alert('Algum(ns) local(is) está(ão) sem beacon definido, ou o contrário!');
        return;
    }

    for (let b = 0; b < beaconmap.length; b++) {
            if (Elocalmap[b] == null){
                Elocalmap[b].x = Ilocalmap.x0;
                Elocalmap[b].y = Ilocalmap.y0;
            }
            mapJson.floors[currentFloor].locates.push({
                beacons: {
                    uuid: beaconmap[b].uuid,
                    position:{
                        x: beaconmap[b].position.x,
                        y: beaconmap[b].position.y
                    },
                },
                    id: 0,
                    position: {
                        x0:Ilocalmap[b].x0,
                        y0:Ilocalmap[b].y0,
                        x: Elocalmap[b].x,
                        y: Elocalmap[b].y
                    }
                }
            );
        }
    /*for (let b = 0; b < beaconmap.length; b++) {
        for (let i = 0; i < Ilocalmap.length; i++) {
            if (Elocalmap[i] == null){
                Elocalmap[i].x = Ilocalmap.x0;
                Elocalmap[i].y = Ilocalmap.y0;
            }
            mapJson.floors[currentFloor].locates.push({
                beacons: {
                    uuid: beaconmap[b].uuid,
                    position:{
                        x: beaconmap[b].position.x,
                        y: beaconmap[b].position.y
                    },
                },
                    id: 0,
                    position: {
                        x0:Ilocalmap[i].x0,
                        y0:Ilocalmap[i].y0,
                        x: Elocalmap[i].x,
                        y: Elocalmap[i].y
                    }
                }
            );
        }
    }*/
    setJson(JSON.stringify(mapJson));
    clearArrays();
}

//Adiciona os tri-beacons no json
function addTriBeacontoJson(){
    if (triBeaconmap.length > triBeaconsLimit){
      alert('Há mais tri-beacons que o limite por andar! Se quiser adicionar mesmo essa quantidade, altere o limite no map.json');
      return;
    }
    for (let tb = 0; tb < triBeaconmap.length; tb++) {
        mapJson.floors[currentFloor].triBeacons.push({
            uuid: triBeaconmap[tb].uuid,
            position:{
                x: triBeaconmap[tb].position.x,
                y: triBeaconmap[tb].position.y
            },
        });
     }
    setJson(JSON.stringify(mapJson));
    clearArrays();
}

//Adiciona todas as novas mudanças no mapa
function addAlltoJson(){
   addHallToJson();
   addLocaltoJson();
   addTriBeacontoJson();
}

//Limpa arrays
function clearArrays(){
   map = [];
   Ilocalmap = [];
   Elocalmap = [];
   beaconmap = [];
   triBeaconmap = [];
}

//Pega o json
function getJson(){
    return JSON.parse(localStorage.getItem("json"));
}

//Define valor no json
function setJson(val){
    localStorage.setItem("json",val);
}

//Limpa json do localstorage
function clear(){
    localStorage.setItem("json",
        localStorage.getItem("jsonmodel")
    );

    setMapLength();
    clearDraw();
}

//Verifica se existe valor
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

//Gera UUID aleatoriamente
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16); 
    });
  }
  