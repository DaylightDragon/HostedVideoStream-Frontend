# Hosting an own video stream (Frontend app)

## Description
This is a project for those who want to just stream their screen to their friends with their usual OBS settings straight from OBS itself. This also has a password/token protection.  
You need to specify tn in the [Docker & server part](https://github.com/DaylightDragon/HostedVideoStream-Docker) in `nginx.conf` at the line:
```
if ($http_authorization != "YOUR_SECRET_TOKEN") {
```

Where you can put absolutely any character combination as a token. It serves as some basic protection from random people, so you can be sure the stream isn't being watched by random web scanner bots (idk) or someone who just knows your IP and the port. Additionally you can change the port in the `compose.yml` file in the `Docker repository`.  

### Ports to open on your router

You only need to open the Frontend's port, which is 5220 by default

### Usage

You have the player in the center of the page and a **button on top-right**.  
To enter the token, you need to:  
1. Click the button  
2. Paste the token in  
3. Save the changes  
4. Reload the page  

## Installation

(You can change .bat files to .sh files and remove the "@echo off" in the beginning for linux support)  

Install all dependencies:  
```sh
npm install
```

## Dev environment with Hot-Reload for Development

Launch the dev environment:  
```sh
npm run dev
```

## Running in container

1. Deploy the Frontend image:  
```sh
.\deployScript.bat
```

2. Follow the instructions in [Docker & server part](https://github.com/DaylightDragon/HostedVideoStream-Docker)    

## Important note
There is unique info in both repositories, so read through both of them to not have questions.  
