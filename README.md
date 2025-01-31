# MultiScript Language
A language made to be able to be compiled to many other langauges.
## Tutorial

### Creating a variable
To create a variable you can enter
```
var int x;
```
This declares a variable named x of type int.
To give it a value you can do.
```
x = 10;
```

### Printing
To print a variable you can do
```
var string message = "Hello World";
print message;
```
or to print a new line also you can do
```
var string message = "Hello World";
println message;
```

### Functions
To create a function you can do.
```
func int add(int a, int b){
  return a + b;
}
```

### Language specific code
If you want to write native code to a language you can do.
```
@target("python") print("Hello World!", end = "");
```

### Macros
Macros allow you to insert code instead of calling a method.
They can be created by doing.
```
macro example{
  //Example code
  println "Exaple Macro";
}
```
You can call one by doing
```
#example
```

## Story

### The Initial Version
This project started as me wanting to make a interpreted language that could be run in the web written in javascript. As I went along in implementing it I decided it might be nice if it could compile to javascript. After I had implemented objects and arrays, and adding more types, I decided that is was not working and I need to restructure.

### The Second Version
When I started the rewrite it in type script after I had started I realized I wanted it to be able to compile to multiple languages. When I finished implementing the base Structure I realized maintaining the ability to be interpreted was a major slow down and I need to pick what I priotized in the project. And I decided that the ablity to compile to multiple languages was my priority. As I went along developing I realized I was going to need to be able to add custom code to fix diffrences between langugages so I made the CustomImplementsations Feature.

### The Planned Future
I am planning to take a break again for a little bit then get back to adding the planned features. I realized while writing this that else statements dont work so that is going to be my prority. Probably For loop, Arrays, Structs, and Fix the Error Handling.

## Examples

### Hello World!
```
println "Hello World!";
```

### If statements
```
var int a = 3;
var int b = 4;
if (a < b) {
  println a*b;
}
```

### Count down using while statement
```
var int a = 10;
while (a>0){
  a = 10;
  a = a - 1;
}
```

## Use it for yourself

### How to run
```bash
git clone https://github.com/avidraccoon/MultiScript.git
cd MultiScript
npm install
npm start
``` 

### How to edit
```bash
git clone https://github.com/avidraccoon/MultiScript.git
cd MultiScript
npm install
npm start
```
In another tab still in the MultiScript directory run
```bash
tsc --watch
```

### Notes
If you want feel free to add on or to create a suggestion in an issue.
