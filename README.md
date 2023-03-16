# oebb-monitor


This Homeassistant ÖBB monitor shows you the live departure times of the public transportation system from your desired train, tram or bus station in Austria. You can also select a destination station to only see the connections you need.

![image](https://user-images.githubusercontent.com/71500391/218267029-6c6f41e5-1109-4f6f-8117-bfa696efd8d4.png)

 This ÖBB monitor is designed to be used in [Homeassistant](https://www.home-assistant.io/) but it's not restricted to Homeassistant.
 
## 1 Overview
This ÖBB monitor is basically a webpage which fetches data from [Scotty](https://fahrplan.oebb.at/bin/query.exe/en?) and displays it nicely.
After cloning this repository into Homeassistant the webpage can easily be displayed using the **Webpage card** in the Homeassistant Dashboard.

In order to fetch the data from Scotty you will need to have a CORS server running. This CORS server will be run by node.js using a terminal.
 
 ## 2 Installation
  
To use the oebb-monitor you need to have access to a terminal on your Homeassistant.
If you have not already, install a terminal add-on via the Homeassistant [Add-on store](https://my.home-assistant.io/redirect/supervisor).
 
### 2.1 Clonig repository & installing node.js
Using the Terminal, execute the followig commands.
 
1. Clone the repository into **config/www/**
```
cd ~/config/www && git clone https://github.com/Dave2ooo/oebb-monitor.git
```
2. Inside the server folder, install Node.js
```
cd ~/config/www/oebb-monitor/server && apk add nodejs npm
```
3. Install npm
```
npm install
```
You can ignore the error message

![npm_install_error](https://user-images.githubusercontent.com/71500391/225109773-18129feb-f28e-4fc5-86ed-525e10ae612a.jpg)

and continue with the next step.

4. Run the cors-server
```
node cors-server.js
```
The terminal should now show
```
Running CORS Anywhere on 0.0.0.0:8080
```
This CORS server must be running all the time in order to retrieve data from Scotty.
  
5. Finally, open the **script.js** file inside the **config/www/oebb-monitor** folder and change the value of the **hass_ip** parameter to your Homeassistant servers IP address.
 _I use the **Visual Studio Code** add-on to edit files._
 
I recommend setting the IP address to static on your router, so that the IP address never changes.
 
![script_js_IP_v2](https://user-images.githubusercontent.com/71500391/223068480-a72d2336-bff0-4eda-849a-cc47b628cf65.png)

### 2.2 Getting ÖBB station ID
To get the monitor to only show connections from your desired station you need to get the respective station ID.
 
  1. Open [Scotty](https://fahrplan.oebb.at/bin/stboard.exe/en?newrequest=yes&)
  2. Click on **Station information**
  3. Enter the name of your station and click **Display information**
  4. Click on **View <HTML> sourcecode**
  5. Copy the **evaId** number
 
  ![Scotty](https://user-images.githubusercontent.com/71500391/222954215-68fa832d-d0da-4dcb-8d3e-ba73a69d0a26.png)

### 2.3 Adding Webpage card
 Now that you have your desired ÖBB station ID you can finally go ahead and create a card on your Homeassistant Dashboard.
  
  1. Go to **Overview** and create a new **Webpage** card.
  2. In the **URL** field enter the following and replace the **departure_station** parameter with the ID of your desired station (evaId).
  ```
  /local/Scotty/index.html?departure_station=1234567
  ```

The ÖBB monitor should now display the upcoming departures from your public transport station. 

You can add as many monitors as you like by adding new webpage cards and changing the URL parameters.

### 2.4 Personalize your Monitor
 You can modify the OBB monitor by adding parameters to the URL in the Webpage card.
  e.g. 
  
  ```
  /local/oebb-monitor/index.html?departure_station=1290401&destination_station=1292101&products_filter=1011111111011&num_journeys=7&additional_time=5&update_interval=60
  ```
 
  ### 2.5 Parameters
#### departure_station (required)
  ID of the departure station. [Getting ÖBB station ID](#Getting-ÖBB-station-ID)
#### destination_station
  ID of the destination station. If provided, the monitor only shows connections from your departure station to your destination station. [Getting ÖBB station ID](#Getting-ÖBB-station-ID)
 #### hass_ip
 IP address of your Homeassistant. This parameter can also be stated in the **script.js** file.
#### products_filter (better not touch this)
  filtering the mean of transportation (Train, Bus,...)
#### num_journeys
  number of connections to show (default: 6)
#### additional_time
  lead time in minutes (default: 0)
#### update_interval
  Updates the data every X second(s) (default: 30)
#### display_clock
 if "true", displays the current time
 
 
 ## 3 Troubleshoot
If you make any changes to
 * index.html
 * style.css
 * script.js
 
 you will need to clear your browsers cache so that the webpage card uses the updated files.
 In Google Chrome only this [Add-on](https://chrome.google.com/webstore/detail/clear-site-data/aihgofjefdlhpnmeakpnjjeajofpcbhj) worked for me.
 
