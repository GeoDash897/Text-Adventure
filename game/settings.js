"use strict"

settings.title = "Las Pegasus Island"
settings.author = "GeoDash"
settings.version = "0.1"
settings.thanks = []
settings.warnings = "No warnings have been set for this game."
settings.playMode = "dev"
//td = html tag for column tr = html tag for row
//By default, the status UI text is part of a table row already (child of tr)
settings.status = [
    function() { return "<td>Equipped in hands:</td><td>" + player.hands[0]+ "<br><br>"+player.hands[1]+"</td>" }
  ]
