const fruits = ["banana", "strawberry", "mango", 2];
let index = 0;

setInterval(()=>{
    console.log(fruits[index]);
    index = (index + 1) % fruits.length;
}, 1000);