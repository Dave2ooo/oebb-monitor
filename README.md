# oebb-monitor


This Homeassistant ÖBB monitor shows you the live departure times of the public transportation system from your desired train, tram or bus station in Austria. You can  specify a destination station to only see the connections you need.

![image](https://user-images.githubusercontent.com/71500391/218267029-6c6f41e5-1109-4f6f-8117-bfa696efd8d4.png)

 This ÖBB monitor is designed to be used in [Homeassistant](https://www.home-assistant.io/) but it's not restricted to Homeassistant.
 
## 1 Overview
This ÖBB monitor is basically a webpage which fetches data from [Scotty](https://fahrplan.oebb.at/bin/query.exe/en?) and displays it nicely.
After cloning this repository into Homeassistant, the webpage can easily be displayed using the **Webpage card** in the Homeassistant Dashboard.

In order to fetch the data from Scotty you will need to have a CORS server running. This CORS server will be run by node.js using a terminal.
 
 ## 2 Installing
  
To use the oebb-monitor you need to have access to a terminal on your Homeassistant.
If you have not already, install a terminal add-on via the Homeassistant [Add-on store](https://my.home-assistant.io/redirect/supervisor).
 
### 2.1 Cloning the repository & installing node.js
Using the Terminal, execute the followig commands.
 
#### 1. Clone the repository
```
cd ~/config/www && git clone https://github.com/Dave2ooo/oebb-monitor.git
```
#### 2. Install Node.js
```
cd ~/config/www/oebb-monitor/server && apk add nodejs npm
```
#### 3. Install npm
```
npm install
```
You can ignore the error message

![npm_install_error](https://user-images.githubusercontent.com/71500391/225109773-18129feb-f28e-4fc5-86ed-525e10ae612a.jpg)

and continue with the next step.

#### 4. Run the cors-server
```
node cors-server.js
```
The terminal should now show
```
Running CORS Anywhere on 0.0.0.0:8080
```
This CORS server must be running all the time in order to retrieve data from Scotty.
  
#### 5. Enter Homeassistant IP address
Open the **script.js** file inside the **config/www/oebb-monitor** folder. Change the value of the **hass_ip** parameter to your Homeassistants IP address. (The Homeassistants IP address can be obtained from your router)

_I use the **Visual Studio Code** from the [Add-on store](https://my.home-assistant.io/redirect/supervisor) to edit files._
 
![script_js_IP_v2](https://user-images.githubusercontent.com/71500391/223068480-a72d2336-bff0-4eda-849a-cc47b628cf65.png)

I recommend setting the IP address to static on your router, so that the IP address never changes.

### 2.2 Getting ÖBB station ID
To get the monitor to only show connections from your desired station you need to get the respective station ID.
 
  1. Open [Scotty](https://fahrplan.oebb.at/bin/stboard.exe/en?newrequest=yes&)
  2. Click on **Station information**
  3. Enter the name of your station and click **Display information**
  4. Click on **View \<HTML\> sourcecode**
  5. Copy the **evaId** number.
 
 The **evaID** is the ÖBB station ID. This ID is needed in the next step.
 
  ![Scotty](https://user-images.githubusercontent.com/71500391/222954215-68fa832d-d0da-4dcb-8d3e-ba73a69d0a26.png)

### 2.3 Adding Webpage card
 Now that you have your ÖBB station ID you can finally go ahead and create a card on your Homeassistant Dashboard.
  
  1. Go to **Overview**.
  2. Create a new **Webpage** card.
  3. Enter the following into the **URL** field:
  ```
  /local/oebb-monitor/index.html?departure_station=<YOUR_STATION_ID>
  ```
  4. Replace **<YOUR_STATION_ID>** with the ÖBB station ID from the previous step (evaId).
  5. Click on **Save**.
  
The ÖBB monitor should now display the upcoming departures from your public transport station. 

You can add as many monitors as you like by adding new webpage cards and changing the URL parameters.

### 2.4 Personalize your Monitor
 You can modify the ÖBB monitor by adding parameters to the URL in the Webpage card.
 
 The URL must look like this
 ```
 /local/oebb-monitor/index.html?
<parameterName1>=<parameterValue1>&
<parameterName2>=<parameterValue2>&
...
 ```
 
 The following example URL updates data from Scotty every **60 seconds** and shows you the next **7 connections** from **Wien Hbf** to **Wien Floridsdorf Bahnhof** that departure in after **5 minutes** from now.
  
  ```
  /local/oebb-monitor/index.html?
departure_station=1290401&
destination_station=1292101&
num_journeys=7&
additional_time=5&
update_interval=60
  ```
 These are the parameters you can set.
 
| Parameter | Description |
| --- | --- |
| departure_station (required) | ID of the departure station. [Getting ÖBB station ID](#22-getting-öbb-station-id) |
| destination_station | ID of the destination station. If provided, the monitor only shows connections from your departure station to your destination station. [Getting ÖBB station ID](#22-getting-öbb-station-id) |
| hass_ip | IP address of your Homeassistant. This parameter can also be entered in the **script.js** file as shown in [Enter Homeassistant IP address](#5-enter-homeassistant-ip-address) |
| products_filter | Filtering the means of transportation (Train, Bus,...) |
| num_journeys | Number of connections to show (default: 6) |
| additional_time | Lead time in minutes (default: 0) |
| update_interval | Updates the data every X second(s) (default: 30) |
| display_clock | If "true", displays the current time (default: false) |

<details>
<summary>products_filter explaination</summary>
 The products_filter can be used to filter the means of transportation that the monitor will show.
 
 | products_filter | Description |
 | --- | --- |
|0000000000001 | RGJ |
|0000000000010 | ? |
|0000000000100 | BUS Regional? |
|0000000001000 | Tram |
|0000000010000 | Subway |
|0000000100000 | ? |
|0000001000000 | BUS short distance |
|0000010000000 | S-Bahn |
|0000100000000 | REX |
|0001000000000 | Nightjet / D / EN|
|0010000000000 | IC / EC |
|0100000000000 | ? |
|1000000000000 | RJ / RJX |
 
 You can combine as many filters as you like.
 
 This filter for example, will only show connections by tram or subway.
 ```
 products_filter=0000000011000
 ```
 
</details>
 
 ## 3 Troubleshoot
 ### 3.1 Failed to fetch
 ![image](https://user-images.githubusercontent.com/71500391/226706374-dc9a5a8d-8c8b-440f-bbb3-c394eaf8cf69.png)
 
 This message appears if the webpage is unable to fetch data from Scotty.
 
 Check if the CORS server is running in a terminal. It should say **"Running CORS Anywhere on 0.0.0.0:8080"**.
 
 ### 3.2 Missing departure_station
 ![image](https://user-images.githubusercontent.com/71500391/226706831-26350e41-2c83-42ee-a17b-a262ee8b2923.png)
 
 This message appears if you didn't declare the ID of the departure station. [Get ÖBB station ID](#22-getting-öbb-station-id) and enter it into the URL of the webpage card.
 
 ### 3.3 Editing files
 If you make any changes to **index.html, style.css or script.js** you will need to clear your browsers cache so that the webpage card uses the updated files.
 In Google Chrome only this [Add-on](https://chrome.google.com/webstore/detail/clear-site-data/aihgofjefdlhpnmeakpnjjeajofpcbhj) worked for me.
 
