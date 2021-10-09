const fs = require("fs");
const myArgs = process.argv.slice(2);
const { createCanvas, loadImage } = require("canvas");
const { createContext } = require("vm");
const { layers, width, height } = require("./input/config.js");

const edition = myArgs.length > 0 ? Number(myArgs[0]) : 1;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

var metadata = [];
var attributes = [];
var hash = [];
var decodedHash = [];

const saveLayer = (_canvas, _edition) => {
    fs.writeFileSync(`./output/${_edition}.png`, _canvas.toBuffer("image/png"));
}

const addMetadata = (_edition) => {
    let dateTime = Date.now();
    let tempMetadata = {
        hash: hash.join(""),
        decodedHash: decodedHash,
        edition: _edition,
        date: dateTime,
        atributes: attributes
    };
    metadata.push(tempMetadata);
    attributes = [];
    hash = [];
    decodedHash = [];
};

const addAtributes = (_element, _layer) => {
    let tempAttr = {
        id: _element.id,
        layer: _layer.name,
        rarity: _element.rarity
    }
    attributes.push(tempAttr);
    hash.push(_layer.id);
    hash.push(_layer.id);
    decodedHash.push({[_layer.id]: _element.id})

}

const drawLayer = async (_layer, _edition) =>{
    //gives a random element from the array of elements of the current layer
    let element = _layer.elements[Math.floor(Math.random() * _layer.elements.length)];
    // addAtributes(element, _layer);
    const image = await loadImage(`${_layer.location}${element.fileName}`);
    ctx.drawImage(
        image, 
        _layer.position.x, 
        _layer.position.y, 
        _layer.size.width, 
        _layer.size.height);
    saveLayer(canvas, _edition);
};

async function myFunction() {

    for(let i = 1; i <= edition; i++){
        layers.forEach(layer => {
            drawLayer(layer, i);
        });
        // addMetadata(i);
        console.log("Creating edition " + i);
    }
  }


fs.readFile("./output/_metadata.json", (err,data) => {
    if(err) throw err;
    fs.writeFileSync("./output/_metadata.json", JSON.stringify(metadata));
});

myFunction();