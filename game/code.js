"use strict"

//Amount of elements in object array should equal number of objects being looked for in regex
//number of (.+) - remember this means regex is capturing a group of at least one character
//Example: cat, dog, bird, would be captured by regex 

commands.unshift(new Cmd('Smash', {
    regex:/^(?:break|smash) (.+)$/,
    objects:[
      {scope:parser.isHeld}
    ],
    defmsg:"{nv:item:be:true} not something that you can destroy .",
}))