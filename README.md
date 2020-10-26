## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

export MONGO_PATH=/usr/local/mongodb
export PATH=$PATH:$MONGO_PATH/bin
mongod --dbpath /Users/jiangqian/data 


let a = document.getElementsByClassName('fl-table')[0].getElementsByTagName('tr')
for(let i=0;i<a.length;i++){
  let con = a[i].children[0].innerHTML
  a[i].children[0].innerHTML = "<a href='http://" + con + " ' target='blank'>" + 'http://' + con +  "</a>"
}