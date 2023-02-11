# oebb-monitor

To use the oebb-monitor you need to have access to a terminal on the Homeassistant.
I recommend using Add-ons from the Hoemassistant Add-on store.

Using the terminal execute the following commands.

Navigate to "config/www" 
```
cd ~/config/www
```
and clone the repository
```
git clone https://github.com/Dave2ooo/oebb-monitor.git
```
Now, navigate to config/www/oebb-monitor/server
```
cd ~/config/www/oebb-monitor/server
```
Install Node.js
```
apk add nodejs npm
```

Install npm
```
npm install
```
Finally, run the cors-server
```
node cors-server.js
```
The terminal should now show
```
Running CORS Anywhere on 0.0.0.0:8080
```
