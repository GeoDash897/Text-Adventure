"use strict"

/*
  For some reason, QuestJS 1.3 has this quirk where examine function runs once when game starts and desc function runs twice!
  Order:
  Description of Room
  Description of Items
  Description of Room
  Keep that in mind!
*/

createItem("player", PLAYER(), {
  loc:"rm_TeleStationInside",
  synonyms:['me', 'myself', 'player'],
  examine: function() {
    let temp = "You look down at yourself, seeing two arms on the sides of your vision...|After realizing that you look a bit"
    + "...{i:strange}...staring down at your arms, you stop in an attempt to look more normal.";
    msg(temp);
  }
})

createRoom("rm_TeleStationInside", {
  headingAlias: "???",
  discoveredButton: false,
  state:0,
  descs:[
    "You open up your eyes, dazed and confused about your current surroundings.|After rubbing the fuzziness out "
      + "of your vision, you realize that you are in ",
      "You are in "
  ],
  desc: function() {
    let start = "{cycleEnd:rm_TeleStationInside:descs:state}";
    let middle = "some kind of enclosed gold metal tube. There is a glass barrier in front of you, too dirty to see the adjacent room beyond "
    + "outside of various colored blurs, but just enough so that some light can filter through the space.|"
    + "You can't make out much of the tube in this lighting environment, but you can see two orb-like structures "
    +"connected by wires toward the bottom left and right corners of your vision respectively.";
    if(w.rm_TeleStationInside.discoveredButton) {
      middle += " Alongside this, there is a small control panel to the left of the barrier.";
    }
    return start+middle; //Need to return string so that it can be formatted in room Template function
  },
  smash: function(options) {
    options.char.moveChar(new Exit("rm_TeleStationOutside", {dir:'out', origin:options.char.loc}));
  }
})

createItem("stationGlass", {
  loc: "rm_TeleStationInside",
  alias: "glass barrier",
  synonyms: ["glass"],
  scenery: true,
  state:-1,
  descs:[
    "A some-what solid barrier of very old, dilapidated glass with two walls on either side.|"+
    "At one time, it would have allowed a person to view the outside of the capsule. " +
    "Due to the neglect of time however, there are various stains and cracks that now cover the glass, making it hard to see anything "+
    "beyond...| However, through this more intensive search, you are able to see a small control "+
    "panel to the left of the glass barrier that you did not make out earlier.",
    "You try once more to see through the dirty glass pane with all of your might, but you only achieve a minor headache in the process."
  ],
  examine: function() {
    if(this.state === 0) {
      this.scenery = false;
      w.rm_TeleStationInside.discoveredButton = true;
      w.stationPanel.scenery = false;
    }
    msg("{cycleEnd:stationGlass:descs:state}");
    //Everytime this is called, it increases state by 1; so when examine is initially run when game starts, state goes from -1 to 0
  },
  smash: function(options) {
    log("Smash!");
    options.char.moveChar(new Exit("rm_TeleStationOutside", {dir:'out', origin:options.char.loc}));
  }
})

createItem("stationPanel", {
  loc: "rm_TeleStationInside",
  alias: "panel",
  synonyms: ["capsule panel"],
  scenery: true,
  examine: "Panel Testing!"
})

createItem("stationButton", COMPONENT("stationPanel"),  {
  alias: "button",
  synonyms: ["panel button"],
  scenery: true,
  examine: "Button Testing!"
})

createRoom("rm_TeleStationOutside", {
  headingAlias: "Terminal 5",
  alias: "Terminal 5",
  desc: "Test description!"
})

createItem("teleStationAlpha", {
  loc: "rm_TeleStationOutside",
  alias: "Teleportation Station",
  synonyms: ["station", "teleporter", "teleportation machine"],
  glassState: -1,
  glassDescriptions: [
    "the glass plane you just shattered",
    "a worn glass pane" 
  ],
  //Figure out way to include the condition if the player had already examined at least one of the three orbs in the capsule
  examine: function() {
    let examineStr = "A capsule like-structure stands in front of you, slightly overshadowing you in its presence. Its cold, unforgiving bronze " +
    "exterior gleams dully in the low light, trying to shine against the surrounding area to no avail. Two slightly darker fins "+
    "extend outwards from the sides of the tube down to the floor, like-wise to the ones on a rocket. There are some markings on "+
    "the fins themselves, but it is hard for you to make them out without further examination.|Facing you are the remains of "+
    "{cycleEnd:teleStationAlpha:glassDescriptions:glassState}."+
    "Inside the tube, you can slightly make out three orb-like structures- one toward the top of the tube, and two toward the bottom left and right corners respectively."+
    "|Above the glass pane lies a broken sign, irregularly flickering \"TELEPORTATION STATION\" into the space with a faint hum of electricity.";
    msg(examineStr);
  }
})

createItem("teleStationFin", {
  loc: "rm_TeleStationOutside",
  alias: "fin",
  examine: "With calculated purpose, you navigate your gaze over to one of the fins extending outwards from the tube. "+
  "Its darker, more metallic bronze coloring helps to make the fin stand out from the rest of the capsule, "+
  "but not in a way that seems out of place, even with its corroded texture.|An weathered engraving of a kneeling unicorn mare "+
  "smiles back at you, seemingly combating against the flecks of diseased green of the fin with her sparks of magic. The figure reminds you "+
  "faintly of someone, but you can't seem to put your finger on it...maybe a famous movie star perhaps?"
})