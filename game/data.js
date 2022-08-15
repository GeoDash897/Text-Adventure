"use strict"

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
  desc: function() {
    let start = "{once:You open up your eyes, dazed and confused about your current surroundings.|After rubbing the fuzziness out "
    + "of your vision, you realize that you are in :You are in }";
    let middle = "some kind of enclosed gold metal tube. There is a glass barrier in front of you, too dirty to see the adjacent room beyond "
    + "outside of various colored blurs, but just enough so that some light can filter through the space.|"
    + "You can't make out much of the tube in this lighting environment, but you can see two orb-like structures "
    +"connected by wires toward the bottom left and right corners of your vision respectively.";
    return start+middle; //Need to return string so that it can be formatted in room Template function
  },
})
