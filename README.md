This is a fork of 
[cnc.js](https://github.com/cncjs/cncjs)

it adds a widget for probing a grid of points for use with autolevelling.

To enable it, click on Manage Widgets and enable the widget
![Manage Widgets](https://github.com/atmelino/cncjs/blob/master/githubimages/widgetManager.png)

Consecutive probing results can be displayed in a table and saved in a file
<br>
![probing grid](https://github.com/atmelino/cncjs/blob/master/githubimages/probingWidget.png)

This feature can be used with 
[Autoleveller AE](https://www.autoleveller.co.uk/autoleveller-ae-quick-start-guide/)

Work flow:

<ul>
  <li>import your PCB gcode into Autoleveller AE</li>
  <li>generate probing gcode with Probe File Generator</li>
  <li>run probing gcode in cnc.js</li>
  <li>save probing results as Raw Probe File</li>
  <li>load Raw Probe File in Autoleveller AE</li>
  <li>generate autolevelled PCB gcode</li>
  <li>run autolevelled PCB gcode on your PCB in cnc.js</li>
</ul>



<h2>Installation of Node js</h2>
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04
