/**
 * TM352 24J TMA Q2, code
 *
 * Change log:
 * 18/01/2024 Autumn Thomson Intial version 
 * 25/09/2024 Autumn Thomson Added comments about uri of photo, made sure an error is thrown if the services is not set up correctly.
 * 22/11/2024 Autumn Thomson Fixed comment about how to find the USERID
 * 
 * This is the code to connect to the taxi service API provided seprately.
 * 
 * The following routes are supported:
 * GET /photo
 * GET /photo/<ID>
 * POST /photo
 * POST /photo/comment/<ID>
 * POST /photo/vote/<ID>
 * POST /photo/users
 * 
 **/

// Modify the following line to replace USERID with your userid.
// To find the USERID, look at your termonal prompt when you run the service.
// For example if it is ou@jupyter-1234:~$ then the USERID is 1234
const apibase = "https://ocl-jhub-tm352.open.ac.uk/user/4835/proxy/3000/photo/";

// Warn if the USERID is not set
if (apibase.includes("USERID")) {
  throw("You need to set the USERID in the PhotoService.ts file");
}

// For local install try
//const apibase = "http://localhost:3000/photo/";

export class Photo {
    user: string = "";
    id: string = "";
    votes: number = 0;
    location: string = "";
    uri: string = "";
    comments: string[] = [];

    constructor(user:string, id:string, location:string, uri:string, votes: number, comments: string[]) {  // Constructor
        this.user = user;
        this.id = id;
        this.location = location;
        this.uri = uri;
        this.comments = comments;
        this.votes = votes;
    }

    /**
     * Turns this photo into a JSON string.
     * 
     * @return         a JSON string representing this photo
     */
    stringify():string {
        return JSON.stringify(this);
  }
}


/** 
 * Gets a list of all the photos in the service.
 * 
 * error handling: throws an error if the service returns an error
 * 
 * @param userid  the user id 
 * @returns       ther server response
 */
export async function getPhotos(userid:string):Promise<any> {
  const response = await fetch(apibase+"?userid="+userid);
  const json = await response.json();
  const data = checkResponse(json); 

  // parse the json data into a list of photos
  const photos:Photo[] = [];
  for (const item of data) {
    const photo = new Photo(item.user, item.id, item.location, item.uri, item.votes, item.comments);
    photos.push(photo);
  }

  return photos;
}

/**
 * Gets a photo from the service.
 * 
 * error handling: throws an error if the service returns an error
 * 
 * @param userid  the user id 
 * @param id      the id of the photo to get
 * @returns       ther server response
 */
export async function getPhoto(userid:string, id:string):Promise<any> {
  const response = await fetch(apibase+id);
  const json = await response.json();
  const data =  checkResponse(json);

  // parse the json data into a photo
  const photo = new Photo(data.user, data.id, data.location, data.uri, data.votes, data.comments);
  return photo;
}

/**
 * Adds a photo to the service.
 * 
 * error handling: throws an error if the service returns an error
 * 
 * @param userid  the user id 
 * @param photo   the photo to add (as a uri string)
 * @param location the location of the photo
 * @returns       ther server response
 */
export async function addPhoto(userid:string, uri:string, location:string):Promise<any> {
    //check if the image is a base64 string
    if (uri.startsWith("data:image")) {
  
      //Call the service
      const response = await fetch(apibase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"userid":userid, "uri":uri, "location":location}) 
      });
    
      //check for errors
      if (!response.ok) {
        const message = "An error has occured"+ response.status;
        throw(message);
      }
      const json = await response.json();
      //return the response
      return checkResponse(json);
    }
    else {
      /* this error is likely to be shown if you use a mobile app */
      throw("PhotoService.ts: Only base64 encoded images are supported");
    }
  }

/**
 * Allows a userid to be registered with the service. This is required before any other
 * operations can be performed.
 * 
 * error handling: throws an error if the service returns an error
 * 
 * @param userid  the user id to register
 * @returns       ther server response
 */
export async function registerUser(userid:string):Promise<any> {
  const response = await fetch(apibase+"users", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"userid":userid}) 
  });

  if (!response.ok) {
    const message = "An error has occured"+ response.status;
    throw(message);
  }
  const json = await response.json();
  return checkResponse(json); 
}

/** 
 * Adds a comment to a photo.
 *  
 * error handling: throws an error if the service returns an error
 * 
 * @param userid  the user id
 * @param id      the id of the photo to comment on
 * @param comment the comment to add
 * @returns       ther server response
 */
export async function addComment(userid:string, id:string, comment:string):Promise<any> {
  const response = await fetch(apibase+"comment/"+id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"userid":userid, "comment":comment}) 
  });

  if (!response.ok) {
    const message = "An error has occured"+ response.status;
    throw(message);
  }
  const json = await response.json();
  return checkResponse(json);
}

/** 
 * Adds a vote to a photo.
 * 
 * error handling: throws an error if the service returns an error
 * 
 * @param userid  the user id
 * @param id      the id of the photo to vote on
 * @returns       ther server response
 * 
 */
export async function addVote(userid:string, id:string):Promise<any> {
  const response = await fetch(apibase+"vote/"+id, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"userid":userid}) 
  });

  if (!response.ok) {
    const message = "An error has occured"+ response.status;
    throw(message);
  }
  const json = await response.json();
  return checkResponse(json);
}

/**
 * Checks the JSON response for errors and handles them
 *
 * @param  response  the JSON object recived from the service
 * @return processes response
 */
function checkResponse(response:any):any {
  if (response.status!="success") {
    throw(response.message);
  }
  else if (response.data) {
    return response.data;
  }
  else {
    return response;
  }
}