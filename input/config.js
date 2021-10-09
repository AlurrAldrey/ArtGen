const fs = require("fs");
const width = 2480;
const height = 3508;
const backgroundFolder = "background2480x3508";
const characterFolder = "monos2480x3508";
const dir = __dirname;

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare"},
    { key: "_sr", val: "super rare"},

]

const addRarity = (_str) => {
    let itemRarity;
    rarity.forEach((r) => {
        if (_str.includes(r.key)) {
            itemRarity = r.val;
        }
    });
    return itemRarity
}

const cleanName = (_str) => {
    let name = _str.slice(0, -4);
    rarity.forEach((r) => {
        name= name.replace(r.key, "");
    });
    return name;
}

const getElements = (path) => {
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i, index) => {
            return {
                id: index + 1,
                name: cleanName(i),
                fileName: i,
                rarity: addRarity(i),
            };
        });
}

const layers = [{
    id: 1,
    name:"background",
    location: `${dir}/background2480x3508/`,
    elements: getElements(`${dir}/background2480x3508/`), 
    position: {x: 0, y: 0},
    size: {width: width, height: height}
},
{
    id: 2,
    name:"monos",
    location: `${dir}/monos2480x3508/`,
    elements: getElements(`${dir}/monos2480x3508/`), 
    position: {x: 0, y: 0},
    size: {width: width, height: height}
}];

module.exports = { layers, width, height };