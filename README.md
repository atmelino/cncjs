This is a fork of 
[cnc.js](https://github.com/cncjs/cncjs)

it adds a widget for probing a grid of points for use with autolevelling.

To enable it, click on Manage Widgets and enable the widget
![Manage Widgets](https://github.com/atmelino/cncjs/blob/master/githubimages/widgetManager.png)

Consecutive probing results can be displayed in a table and save in a file
![probing grid](https://github.com/atmelino/cncjs/blob/master/githubimages/probingWidget.png)

This feature can be used with 
[Autoleveller AE](https://www.autoleveller.co.uk/autoleveller-ae-quick-start-guide/)

Work flow:

import your PCB gcode into Autoleveller AE
generate probing gcode with Probe File Generator
run probing gcode in cnc.js
save probing results as Raw Probe File
load Raw Probe File in Autoleveller AE
generate autolevelled PCB gcode
run autolevelled PCB gcode on your PCB in cnc.js.

