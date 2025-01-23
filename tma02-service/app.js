"use strict";
/**
 * Express.js implementation of the TMA photosharing API. This is a prototype
 * implementation with a number of limiations. It is enough to demonstrate that
 * a client works.
 *
 * To install:
 * npm install
 *
 * This server can be started from the installed directory with:
 * npm run dev
 *
 * The following routes are supported:
 * GET /photo
 * GET /photo/<ID>
 * POST /photo
 * POST /photo/comment/<ID>
 * POST /photo/vote/<ID>
 * POST /photo/users
 *
 * Change log:
 * Version 1.0, 18 January 2024, A Thomson, Intial version
 * Version 1.1, 25 January 2024, A Thomson, Changes for TMA02 24J
 *
 * Packages:
 * npm i -D typescript @types/express @types/node
 * npm install -D concurrently nodemon
 *
 * Project intialisation tasks:
 * npx tsc --init
 */
const express = require('express');
const cors = require('cors');
/**
 * Used to represent an photo. This is a simple class that just stores the
 * data. It does not do any checking of the data.
 */
class Photo {
    constructor(user, id, location, uri) {
        this.user = "";
        this.id = "";
        this.votes = 0;
        this.location = "";
        this.uri = "";
        this.comments = [];
        this.user = user;
        this.id = id;
        this.location = location;
        this.uri = uri;
    }
    /**
     * Turns this photo into a JSON string.
     *
     * @return         a JSON string representing this photo
     */
    stringify() {
        return JSON.stringify(this);
    }
}
// Create the express app
const app = express();
app.use(cors());
//The limit here allows images to be uploaded which would otherwise be too big
// for the default limit.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
// Set up the routes
const base = "/photo/";
const port = 3000;
app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
});
// The data is stored in an array of Order objects
let photos = [];
let photoCount = 0;
let photoIDCounter = 0;
let users = [];
/**
 * The handler for the GET /photo route.
 *
 * @param request   the request object
 * @param response  the response object
 */
app.get(base, (request, response) => {
    if (request.query.userid === undefined || request.query.userid === "" || !isUserRegistered(request.query.userid)) {
        response.send("{\"status\" : \"error\",\"message\" : \"User not registered\"}");
    }
    else {
        response.send(getImp(""));
    }
});
/**
 * The handler for the GET /photo/<ID> route.
 *
 * @param request   the request object.
 * @param response  the response object
 */
app.get(base + ":id", (request, response) => {
    if (request.query.userid === undefined || request.query.userid === "" || !isUserRegistered(request.query.userid)) {
        response.send("{\"status\" : \"error\",\"message\" : \"User not registered\"}");
    }
    else {
        response.send(getImp(request.params.id.toString()));
    }
});
/**
 * The handler for the POST /photo route.
 *
 * @param request   the request object
 * @param response  the response object
 */
app.post(base, (request, response) => {
    if (request.body.userid === undefined || request.body.userid === "" || !isUserRegistered(request.body.userid)) {
        response.send("{\"status\" : \"error\",\"message\" : \"User not registered\"}");
    }
    else {
        response.send(postImp(request.body.userid, request.body.location, request.body.uri));
    }
});
/**
 * The handler for the POST /comment/<ID> route.
 *
 * @param request   the request object
 * @param response  the response object
 */
app.post(base + "comment/:id", (request, response) => {
    if (request.body.userid === undefined || request.body.userid === "" || !isUserRegistered(request.body.userid)) {
        response.send("{\"status\" : \"error\",\"message\" : \"User not registered\"}");
    }
    else {
        response.send(postCommentImp(request.params.id.toString(), request.body.userid + ": " + request.body.comment));
    }
});
/**
 * The handler for the POST /vote/<ID> route.
 *
 * @param request   the request object
 * @param response  the response object
 */
app.post(base + "vote/:id", (request, response) => {
    if (request.body.userid === undefined || request.body.userid === "" || !isUserRegistered(request.body.userid)) {
        response.send("{\"status\" : \"error\",\"message\" : \"User not registered\"}");
    }
    else {
        response.send(postVoteImp(request.params.id.toString()));
    }
});
/**
 * The handler for the POST /users route.
 *
 * @param request   the request object
 * @param response  the response object
 */
app.post(base + "users", (request, response) => {
    response.send(userImp(request.body.userid));
});
/**
 * The implementation of the GET /photo route. This will return a list of
 * all the photos in the database.
 *
 * If the optional ID parameter is provided then only the photo with that ID
 * will be returned.
 *
 * @param userid  the user making the request
 * @param id      the id of the photo to return (optional)
 * @returns       a JSON string representing the photo(s)
 */
function getImp(id) {
    console.log("Request to GET photo: " + id);
    let response = "";
    let result = [];
    photos.forEach(function (photo) {
        if (photo != null && (id === "" || photo.id === id)) {
            result.push(photo);
        }
        ;
    });
    if (result.length > 0) {
        response = "{ \"status\": \"success\", \"data\": " + JSON.stringify(result) + "}";
    }
    else {
        response = "{\"status\" : \"error\",\"message\" : \"No matching records\"}";
    }
    console.log("Response from GET photo: " + response);
    return response;
}
/**
 * The implementation of the POST /photo route. This will add a new photo
 * to the database.
 *
 * @param userid    the user making the request
 * @param location  the location of the photo
 * @param photo     the photo itself
 * @returns         a JSON string representing the photo
 */
function postImp(userid, location, photo) {
    console.log("Request to POST photo: " + userid + ", " + location + ", " + photo);
    const response = "{\"status\" : \"success\", \"data\": {\"id\": \"" + photoIDCounter + "\"}}";
    photos.push(new Photo(userid, photoIDCounter.toString(), location, photo));
    photoCount++;
    photoIDCounter++;
    console.log("Response from POST photo: " + response);
    return response;
}
/**
 * The implementation of the POST /comment route. This will add a comment
 * to the photo with the given ID.
 *
 * @param id        the id of the photo to comment on
 * @param comment   the comment
 * @returns         a JSON string representing the photo
 */
function postCommentImp(id, comment) {
    console.log("Request to POST comment: " + id + ", " + comment);
    let found = false;
    photos.forEach(function (photo) {
        if (photo != null && photo.id === id) {
            found = true;
            photo.comments.push(comment);
        }
        ;
    });
    let response = "";
    if (found) {
        response = "{\"status\" : \"success\"}";
    }
    else {
        response = "{\"status\" : \"error\",\"message\" : \"No matching records\"}";
    }
    console.log("Response from POST comment: " + response);
    return response;
}
/**
 * The implementation of the POST /vote route. This will add a vote
 * to the photo with the given ID.
 *
 * @param id        the id of the photo to vote on
 * @param vote      the vote
 * @returns         a JSON string representing the photo
 */
function postVoteImp(id) {
    console.log("Request to POST vote: " + id);
    let found = false;
    photos.forEach(function (photo) {
        if (photo != null && photo.id === id) {
            found = true;
            photo.votes += 1;
        }
        ;
    });
    let response = "";
    if (found) {
        response = "{\"status\" : \"success\"}";
    }
    else {
        response = "{\"status\" : \"error\",\"message\" : \"No matching records\"}";
    }
    console.log("Response from POST vote: " + response);
    return response;
}
/**
 * Check if a user is registered
 *
 * @param userid the userid to check
 * @returns true if the user is registered
 */
function isUserRegistered(userid) {
    let found = false;
    users.forEach(function (user) {
        if (user != null && user === userid) {
            found = true;
        }
        ;
    });
    return found;
}
/**
 * Implementation of the POST /users route. This will register a user
 *
 * If the user is already registered then an error is returned.
 *
 * @param userid the userid to register
 * @returns a JSON string representing the result
 */
function userImp(userid) {
    console.log("Request to users: " + userid);
    let found = false;
    users.forEach(function (user) {
        if (user != null && user === userid) {
            found = true;
        }
        ;
    });
    let response = "";
    if (found) {
        response = "{\"status\" : \"error\", \"message\" : \"User already registered\"}";
    }
    else {
        users.push(userid);
        response = "{\"status\" : \"success\"}";
    }
    console.log("Response from users: " + response);
    return response;
}
