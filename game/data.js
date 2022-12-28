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
  loc:"teleStationInside",
  synonyms:['me', 'myself', 'player'],
  examine: function() {
    let temp = "You look down at yourself, seeing two arms on the sides of your vision...|After realizing that you look a bit"
    + "...{i:strange}...staring down at your arms, you stop in an attempt to look more normal.";
    msg(temp);
  }
})

createRoom("teleStationInside", {
  headingAlias: "???",
  discoveredButton: false,
  state:0,
  descs:[
    "You open up your eyes, dazed and confused about your current surroundings.|After rubbing the fuzziness out "
      + "of your vision, you realize that you are in ",
      "You are in "
  ],
  desc: function() {
    let start = "{cycleEnd:teleStationInside:descs:state}";
    let middle = "some kind of enclosed gold metal tube. There is a glass barrier in front of you, too dirty to see the adjacent room beyond "
    + "outside of various colored blurs, but just enough so that some light can filter through the space.|"
    + "You can't make out much of the tube in this lighting environment, but you can see two orb-like structures "
    +"connected by wires toward the bottom left and right corners of your vision respectively.";
    if(w.teleStationInside.discoveredButton) {
      middle += " Alongside this, there is a small control panel to the left of the barrier.";
    }
    return start+middle; //Need to return string so that it can be formatted in room Template function
  },
  smash: function(options) {
    options.char.moveChar(new Exit("teleStationOutside", {dir:'out', origin:options.char.loc}));
  }
})

createItem("stationGlass", {
  loc: "teleStationInside",
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
      w.teleStationInside.discoveredButton = true;
    }
    msg("{cycleEnd:stationGlass:descs:state}");
    //Everytime this is called, it increases state by 1; so when examine is initially run when game starts, state goes from -1 to 0
  },
  smash: function(options) {
    log("Smash!");
    options.char.moveChar(new Exit("teleStationOutside", {dir:'out', origin:options.char.loc}));
  }
})

createItem("stationButton", {
  loc: "teleStationInside",
  alias: "button",
  synonyms: ["station button"],
  scenery: true,
  examine: "Testing!"
})

createRoom("teleStationOutside", {
  headingAlias: "Terminal 5",
  alias: "Terminal 5",
  desc: "This room is ass"
})