console.log("Task 1\n");
let a = 5;
let b =6;

console.log(a+b);
console.log(a-b);
console.log(a*b);
console.log(a/b);

console.log("\nTask 2\n");
let firstName = "Daryna";
let lastName = "Martyniuk";
let fullName = firstName + " " + lastName;

console.log("Hello, " + fullName);

console.log("\nTask3\n");
let age =18;

if(age >=18){
    console.log("Доступ дозволено!");
} else {
    console.log("Доступ заборонено!");
}

console.log("\nTask4\n");
for(let i = 1; i <= 10; i++) {
    console.log(`${i}`);
}

console.log("\nTask5\n");
function square(number) {
    return number * number;
}
console.log(square(5));

console.log("\nTask6\n");
let fruits = ["apple", "banana", "pear"];
console.log(fruits);
fruits.push("mango");
console.log(fruits);