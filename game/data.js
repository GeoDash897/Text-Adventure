"use strict"

createItem("player", PLAYER(), {
  loc:"teleStationInside",
  synonyms:['me', 'myself', 'player'],
  examine: function() {
    let temp = "You look down at yourself, seeing two arms on the sides of your vision...|After realizing that you look a bit"
    + "...{i:strange}...staring down at your arms, you stop in an attempt to look more normal.";
    msg(temp);
  },
  hands: [null, null],
  isInHands: function(item) {
    for(let i = 0; i < this.hands.length; i++) {
      if(this.hands[i] === item) {
        return true;
      }
    }
    return false;
  },
  getFreeSpace: function() {
    let amount = 0;
    for(let i = 0; i < this.hands.length; i++) {
      if(this.hands[i] === null) {
        amount++;
      }
    }
    return amount;
  },
  removeItemFromHands: function(item) {
    for(let i = 0; i < this.hands.length; i++) {
      if(this.hands[i] === item) {
        this.hands[i] = null;
      }
    }
  }
})

createRoom("teleStationInside", {
  headingAlias: "???",
  discoveredButton: false,
  desc: function() {
    let start = "{once:You open up your eyes, dazed and confused about your current surroundings.|After rubbing the fuzziness out "
    + "of your vision, you realize that you are in :You are in }";
    let middle = "some kind of enclosed gold metal tube. There is a glass barrier in front of you, too dirty to see the adjacent room beyond "
    + "outside of various colored blurs, but just enough so that some light can filter through the space.|"
    + "You can't make out much of the tube in this lighting environment, but you can see two orb-like structures "
    +"connected by wires toward the bottom left and right corners of your vision respectively.";
    if(this.discoveredButton) {
      middle += " Alongside this, there is a small control panel to the left of the barrier.";
    }
    return start+middle; //Need to return string so that it can be formatted in room Template function
  },
})

createItem("stationGlass", {
  loc: "teleStationInside",
  alias: "glass barrier",
  synonyms: ["glass"],
  scenery: true,
  state:0,
  descs:[
    "A some-what solid barrier of very old, dilapidated glass with two walls on either side.|"+
    "At one time, it would have allowed a person to view the outside of the capsule. " +
    "Due to the neglect of time however, there are various stains and cracks that now cover the glass, making it hard to see anything "+
    "beyond...| However, through this more intensive search, you are able to see a small control "+
    "panel to the left of the glass barrier that you did not make out earlier.",
    "You try once more to see through the dirty glass pane with all of your might, but you only achieve a minor headache in the process.",
  ],
  examine: function() {
    if(this.state === 0) {
      this.scenery = false;
      w.teleStationInside.discoveredButton = true;
    }
    msg("{cycleEnd:stationGlass:descs:state}");
  },
  smash: function(options) {
    options.char.moveChar(new Exit("teleStationOutside", {dir:'out', origin:options.char.loc}));
  }
})

createItem("stationButton", {
  loc: "teleStationInside",
  alias: "button",
  synonyms: ["station button"],
  scenery: true,
})

createRoom("teleStationOutside", {
  headingAlias: "Terminal 5",
  alias: "Terminal 5"
})

//Creating a custom template- remember this is a function!
const EQUIPPABLE = function() {
  const res = Object.assign({}, TAKEABLE_DICTIONARY); //Using TAKEABLE_DICTIONARY as starting point for template object creation
  res.equipped = false;
  res.handCount = 1;
  res.handName = "None";
  res.equipMsg = "You equip this item in your hands.";
  res.equipFailMsg = "You can't equip this item as you don't have enough empty hands to hold it!";
  res.unequipMsg = "You remove this item from your hand(s) and put it back into your inventory."
  res.afterCreationTakeable = res.afterCreation;//afterCreation function of TAKEABLE_DICTIONARY (Takeable Template)
  res.afterCreation = function(o) {//function called when item is first created (like constructor)
    o.afterCreationTakeable(o);//Run to construct properties of TAKEABLE_DICTIONARY
    //function that adds verbs to dropdown list depending on context
    o.verbFunctions.push(function(o, verbList) {
      if(o.equipped) {
        verbList.push("Unequip");
      }
      else {
        verbList.push("Equip");
      }
    })
  }
  res.drop = function() {
    if(this.equipped) {
      w.player.removeItemFromHands(this);
      this.equipped = false;
      this.handName = "None";
    }
    const options = {char:w.player, item:this} //move item back into the environment
    this.moveToFrom(options, "loc", "char")
    msg("You drop "+lang.getName(this, {article:DEFINITE})+".");
  }
  res.equip = function() {
      let object = this;
      const options = {char:w.player, item:this} 
      const menuOptions = [
        {
          alias:"Left",//does not like the word left, might be reserved
          properNoun:true,
          positionToAdd: 0
        },
        {
          alias:"Right",//does not like the word left, might be reserved
          properNoun:true,
          positionToAdd: 1
        }
      ]
      if(w.player.isInHands(this)) {
        msg("You are already holding this item in your hand(s)!");
        return;
      }
      //Can't be equipped
      if(this.handCount > w.player.getFreeSpace()) {
        msg(this.equipFailMsg);
      }
      else {
        //When two hands are empty
        if(w.player.getFreeSpace() === 2) {
          if(this.handCount === 2) {         
            if(!this.isAtLoc(w.player)) {          
              this.moveToFrom(options, "char", "loc")
            }  
            for(let i = 0; i < w.player.hands.length; i++) {
              w.player.hands[i] = this;
            }           
            this.equipped = true;   
            this.handName = "both";
            msg(this.equipMsg);
          }
          else if(this.handCount === 1) {
            //Had to use drop down as text input caused a delay between code execution
            showDropDown("In which hand would you like to equip this item?", menuOptions, function(result) {
              if(!object.isAtLoc(w.player)) {//Can't use this in scope of function = returns undefined
                object.moveToFrom(options, "char", "loc")
              }
              w.player.hands[result.positionToAdd] = object;
              object.equipped = true;
              object.handName = result.alias.toLowerCase();
              let temp = object.equipMsg.replaceAll("[hands]", object.handName);
              msg(temp);
            })
          }        
        }
        else if(w.player.getFreeSpace() === 1) {
          if(!this.isAtLoc(w.player)) {          
            this.moveToFrom(options, "char", "loc")
          }
          let freeSpace = 0;
          //Find empty space and set it to the item
          for(let i = 0; i < w.player.hands.length; i++) {
            if(w.player.hands[i] === null) {
              freeSpace = i;
            }
          }
          w.player.hands[freeSpace] = this;
          this.equipped = true;
          this.handName = menuOptions[freeSpace].alias.toLowerCase();
          let temp = this.equipMsg.replaceAll("[hands]", "remaining");
          msg(temp);
        }
      }
    }
  res.unequip = function() {
    if(this.isAtLoc(w.player) && !this.equipped) {
      msg("This item is already unequipped and in your inventory!")
    }
    else if(!this.isAtLoc(w.player) && !this.equipped) {
      msg("You can't equip this item as it is not in your inventory!")
    }
    else {
      w.player.removeItemFromHands(this);
      this.equipped = false;
      let temp = this.unequipMsg.replaceAll("[hands]", this.handName);
      msg(temp)
    }
  }
  return res;
}

createItem("test", EQUIPPABLE(), {
  loc: "teleStationInside",
  alias: "Test",
  handCount: 1,
})

createItem("test2", EQUIPPABLE(), {
  loc: "teleStationInside",
  alias: "gun",
  handCount: 1,
  equipMsg: "With a flick of your wrist, you equip the gun into your [hands] hand.",
  unequipMsg: "You remove the gun from your [hands] hand and put it back into your inventory."
})