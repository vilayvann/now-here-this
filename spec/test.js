var request = require("request");
var app = require("../javascript/index.js");

var base_url = "http://localhost:8080/";

describe("Back End Test", function(){
  describe("GET /", function(){
    it("returns status code 200", function(done){
      request.get(base_url, function(err, res, body) {
        expect(res.statusCode).toBe(200);
        app.closeServer();
        done();
      });
    });
  });
});