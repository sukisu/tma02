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
declare const express: any;
declare const cors: any;
/**
 * Used to represent an photo. This is a simple class that just stores the
 * data. It does not do any checking of the data.
 */
declare class Photo {
    user: string;
    id: string;
    votes: number;
    location: string;
    uri: string;
    comments: string[];
    constructor(user: string, id: string, location: string, uri: string);
    /**
     * Turns this photo into a JSON string.
     *
     * @return         a JSON string representing this photo
     */
    stringify(): string;
}
declare const app: any;
declare const base = "/photo/";
declare const port = 3000;
declare let photos: Photo[];
declare let photoCount: number;
declare let photoIDCounter: number;
declare let users: string[];
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
declare function getImp(id: string): string;
/**
 * The implementation of the POST /photo route. This will add a new photo
 * to the database.
 *
 * @param userid    the user making the request
 * @param location  the location of the photo
 * @param photo     the photo itself
 * @returns         a JSON string representing the photo
 */
declare function postImp(userid: string, location: string, photo: string): string;
/**
 * The implementation of the POST /comment route. This will add a comment
 * to the photo with the given ID.
 *
 * @param id        the id of the photo to comment on
 * @param comment   the comment
 * @returns         a JSON string representing the photo
 */
declare function postCommentImp(id: string, comment: string): string;
/**
 * The implementation of the POST /vote route. This will add a vote
 * to the photo with the given ID.
 *
 * @param id        the id of the photo to vote on
 * @param vote      the vote
 * @returns         a JSON string representing the photo
 */
declare function postVoteImp(id: string): string;
/**
 * Check if a user is registered
 *
 * @param userid the userid to check
 * @returns true if the user is registered
 */
declare function isUserRegistered(userid: string): boolean;
/**
 * Implementation of the POST /users route. This will register a user
 *
 * If the user is already registered then an error is returned.
 *
 * @param userid the userid to register
 * @returns a JSON string representing the result
 */
declare function userImp(userid: string): string;
//# sourceMappingURL=app.d.ts.map