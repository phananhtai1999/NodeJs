class Car {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }
    getName = () => this.name
    
    getColor = () => { return this.color; }
}

const Test = new Car("Test", "Blue");
console.log(Test.getName());