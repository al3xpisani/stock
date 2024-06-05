<div align="center">
    <img src="https://media.licdn.com/dms/image/D4E0BAQETyObSEmZH-A/company-logo_200_200/0/1693956448491/jobsity_llc_logo?e=1723075200&v=beta&t=rGq4fY1cprFyIaSabim0_bgb-QLCbJUk6Es9dXuua1w"/>
</div>

# Node.js Stock

## Description

This project is designed to test your knowledge of back-end web technologies, specifically in Node.js, REST APIs, and decoupled services (microservices).

## Assignment

The goal of this exercise is to create a simple API with Node.js, using or not any framework of your choice, to allow users to query [stock quotes](https://www.investopedia.com/terms/s/stockquote.asp). It is scaffolded with two Express apps, but you can use another backend Node.js framework of your preference.

The project consists of two separate services:

* A user-facing API that will receive requests from registered users asking for quote information.
* An internal stock service that queries external APIs to retrieve the requested quote information.

### API service

* Endpoints in the API service should require authentication (no anonymous requests should be allowed). Each request should be authenticated via Basic Authentication.
  * To register a user the API service must receive a request with an email address, user role and return a randomized password, like this:

    Request example:

    `POST /register`

    ```json
      { "email": "johndoe@contoso.com", "role": "user" }  //role could be user/admin
    ```

    Response example:

    `POST /register`

    ```json
      { "email": "johndoe@contoso.com", "password": "bda5d07453dfde4440803cfcdec48d92" }
    ```
* When a user requests a stock quote (calls the stock endpoint in the api service), if it exists, it should be saved and related to that user in the database.
  * The response returned by the API service should be like this:

    `GET /stock?q=aapl.us`

    ```json
      {
      "name": "APPLE",
      "symbol": "AAPL.US",
      "open": 123.66,
      "high": 123.66,
      "low": 122.49,
      "close": 123
      }
    ```
  * A user can get their history of queries made to the api service by hitting the history endpoint. The endpoint should return the list of entries saved in the database, showing the latest entries first:

    `GET /history`

    ```javascript
    [
        {"date": "2021-04-01T19:20:30Z", "name": "APPLE", "symbol": "AAPL.US", "open": "123.66", "high": 123.66, "low": 122.49, "close": "123"},
        {"date": "2021-03-25T11:10:55Z", "name": "APPLE", "symbol": "AAPL.US", "open": "121.10", "high": 123.66, "low": 122, "close": "122"},
        ...
    ]
    ```
* A super user (and only super users) can hit the stats endpoint, which will return the top 5 most requested stocks:

  (This endpoint will validate the user's role)

  `GET /stats`

  ```json
  [
      {"stock": "aapl.us", "times_requested": 5},
      {"stock": "msft.us", "times_requested": 2},
      ...
  ]
  ```
* All endpoint responses should be in JSON format.

### Stock service

* Assume this is an internal service, so requests to endpoints in this service don't need to be authenticated.
* When a stock request is received, this service should query an external API to get the stock information. 
* The Stock Service will fetch stock data and will get back to api-service.
* The api-service will persist data into firebase and Redis
* You can see a list of available stock codes here: [https://stooq.com/t/?i=518](https://stooq.com/t/?i=518)

## Architecture

![Architecture Diagram](https://git.jobsity.com/jobsity/node-challenge/-/blob/master/architecture.png)

1. A user makes a request asking for Nasdaq's current Stock quote: `GET /stock?q=ndq`
2. The API service calls the stock service to retrieve the requested stock information
3. The stock service delegates the call to the external API, parses the response and returns the information back to the API service.
4. The API service saves the response from the stock service in the database.
5. The data is formatted and returned to the user.

# NodeJs Stock Service

## Author: Alexandre Pisani Antonio

### Project Details

This project is a Node.js stock service that provides stock information through a set of APIs. The service is containerized using Docker.

## Video explaining the code.
- [![Navigating thru the app](https://i.ibb.co/02Wv5tw/image.png)](https://youtu.be/kQSXIfP7Xqw)

### Getting Started

### Important notes:
#### I worked with Google Firebase. You need to create your free account in Google Cloud Platform
#### I hard-coded some credentials and other details for didactic purposes only. It is absolutely not permitted to do this in your day-to-day development tasks.


### Create .env and setup it with the vars below. (For api-service)
```
STOCK_PORT_SERVICE=3002
COLLECTION_NAME=stock
STOCK_BASE_URL=http://nodejs-stockservice
STOCK_PATH=/stock
```

### Create .env and setup it with the vars below. (For stock-service)
```
PORT=3002
STOCK_BASE_URL=https://stooq.com/q/l/?s=
```

#### Setup a google cloud firebase with your own ID in the /src/config/google-firebase-keys-dev.ts
#### You can get your own google firebase credentials right in the GCP

[Google firebase console](https://console.firebase.google.com/u/0/project/zeroqueue-30894/firestore)
![Firebase: stock collection](https://i.ibb.co/m5ZjhfK/image.png)

## Firebase console
### Create your onw google cloud firebase at firebase console and change the information below by your own or concat the developer to send you the data for tests

##### src/config/google-firebase-keys-devs.ts
```
export const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
}
```
[Google firebase console](https://console.firebase.google.com/u/0/project/zeroqueue-30894/firestore)

To run the project, follow these steps:

1. **Navigate to the Root Folder and run docker-compose**:
   
![Open your terminal and navigate to the root folder of the project.](https://i.ibb.co/Jtk4Zzg/image.png)

2. **Build and Run the Docker Containers**:
   Run the following command to build and start the Docker containers:
   ```
    docker-compose up


 - Notice the project will build and show in the terminal two ports 3001 and 3002
 ![Terminal output with both Ports opened](https://i.ibb.co/ds9rLfC/image.png)

3. **Import the rest APIs file into insomnia**:

## API Contract (Front-End team)

[Download Imsomnia](https://insomnia.rest/download)

-   Download the JSON files and import them into Insomnia
    [Download imsomnia json file](https://drive.google.com/file/d/1fWDBp7ShbazTjmm_QDQBxWUg3ONkKZJ5/view?usp=sharing)

-   Drag and drop the downloaded .json file onto the Insomnia UI. The import will be done automatically.

Run the first "token" API, which will return an access token to be used in other CRUD APIs. Authentication has been defined in the headers, but for demonstration purposes, they are hard-coded.

4. **The first API to be executed is the Register to get the Google Cloud generated Token**:

 ![The token generated by Google GCP Firebase api](https://i.ibb.co/ZTvR9xJ/image.png)

5. **Run getStockById rest Api in insomnia**:
 ![getStockById](https://i.ibb.co/wL2pzd5/image.png)
  ##### This moment the response data will be persisted in the Google Firebase GCP
  ##### It also will persist the stock ticket into Redis
 ![Firebase: stock collection](https://i.ibb.co/m5ZjhfK/image.png)

 ![Redis](https://i.ibb.co/tDXrpX5/image.png)

6. **Run getHistory rest Api in insomnia**:
 ![getHistory](https://i.ibb.co/dkWZwrd/image.png)

7. **Run getStats rest Api in insomnia**:
 ![getStats only for admins](https://i.ibb.co/Yt4ChMN/image.png)

8. **At least but the last important thing. The tests**:

##### Go in terminal and : npm run test
 ![tests](https://i.ibb.co/cYf839w/image.png)


 