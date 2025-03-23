# Hosting an own video stream (Frontend app)

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
