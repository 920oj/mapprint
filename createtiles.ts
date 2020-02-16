const axios = require('axios');
const fs = require('fs');
const shell = require('shelljs')

const TARGET_DIR = './dist/data/';
const CONFIG_DIR = './assets/config/'
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, {recursive: true});
}

const list = require(`${CONFIG_DIR}list.json`)
list.map((name) => {
  console.log(`loading ${CONFIG_DIR}${name}`)
  const config = require(`${CONFIG_DIR}${name}`)
  config.sources.forEach((source) => {
    if (!fs.existsSync(`${TARGET_DIR}${config.map_id}`)) {
      fs.mkdirSync(`${TARGET_DIR}${config.map_id}`, {recursive: true});
    }
    console.log(`downloading ${source.url}...`)
    axios.get(source.url).then((response) => {
      const file_path = `${TARGET_DIR}${config.map_id}/${source.id}.${source.type}`
      fs.writeFile(file_path, response.data, (err) => {
        // 書き出しに失敗した場合
        if(err){
          console.log("Downloading kml file failed" + err)
          throw err
        }
        // 書き出しに成功した場合
        else{
          console.log(`Downloaded ${source.id}.${source.type}`)
          console.log(`./create_tiles.sh ${file_path}`)
          shell.exec(`./create_tiles.sh ${file_path}`)
          // shell.exec(`./convert_to_tiles.sh ${file_path}`)
        }
      })
    })
  })
})