# oebb-monitor WIP
![image](https://user-images.githubusercontent.com/71500391/218267029-6c6f41e5-1109-4f6f-8117-bfa696efd8d4.png)


<details><summary>Installation</summary>
<p>
  
To use the oebb-monitor you need to have access to a terminal on the Homeassistant.
I recommend using Add-ons from the Hoemassistant Add-on store.

Using the terminal execute the following commands.

1. Navigate to "config/www" 
```
cd ~/config/www
```
2. Clone the repository
```
git clone https://github.com/Dave2ooo/oebb-monitor.git
```
3. Navigate to config/www/oebb-monitor/server
```
cd ~/config/www/oebb-monitor/server
```
4. Install Node.js
```
apk add nodejs npm
```
5. Install npm
```
npm install
```
5. Run the cors-server
```
node cors-server.js
```
The terminal should now show
```
Running CORS Anywhere on 0.0.0.0:8080
```
  
6. Finally, open the **script.js** file and change the value of the **hass_ip** parameter to your Homeassistant servers IP address.
_I use the **Visual Studio Code** add-on to edit files._

![image](https://user-images.githubusercontent.com/71500391/218267834-9eddbd79-67c8-496b-bb82-22b27ef2032e.png)


</p>
</details>


<details><summary>Getting ÖBB station ID</summary>
<p>
  
  To get the monitor to show only connections from your desired station you need to get the respective station ID.
  1. Open https://fahrplan.oebb.at/bin/query.exe/en?
  2. Click on **Station information**
  3. Serach for your station and click **Display information**
  4. Click on **View <HTML> sourcecode**
  5. Copy **evaId** number
  ![image](https://user-images.githubusercontent.com/71500391/218268878-24756c72-f5a8-4138-8413-6330f2b967b5.png)

  
</p>
</details>


<details><summary>Usage</summary>
<p>
  
  1. Go to **Overview** and create a new **Webpage** card.
  2. In the **URL** field enter the following and replace the **departure_station** parameter with the ID of your desired station.
  ```
  /local/Scotty/index.html?departure_station=1234567
  ```
  
  
</p>
</details>


<details><summary>Settings</summary>
<p>
You can modify the OBB monitor by adding parameters to the URL in the Webpage card.
  e.g. 
  
  ```
  /local/oebb-monitor/index.html?departure_station=1290401&destination_station=1292101&products_filter=1011111111011&num_journeys=7&additional_time=5&update_interval=60
  ```
  
#### departure_station (required)
  ID of the departure station. This ID must be provided.
#### destination_station
  ID of the destination station
#### products_filter
  filtering the mean of transportation (Train, Bus,...)
#### num_journeys
  number of connections to show (default: 6)
#### additional_time
  lead time in minutes (default: 0)
#### update_interval
  Updates the data every X second(s) (default: 30)
  
  
</p>
</details>
