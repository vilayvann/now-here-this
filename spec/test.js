var request = require("request");
var app = require("../index.js");
var sleep = require("sleep");

var base_url = "http://localhost:8080/";

describe("Back End Test", function(){
  describe("GET", function(){
    it("/ returns status code 200", function(done){
      request.get(base_url, function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
    it("/overview returns status code 200", function(done){
      request.get(base_url + "overview.html", function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
    it("/staff returns status code 200", function(done){
      request.get(base_url + "staff.html", function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
    it("/archive returns status code 200", function(done){
      request.get(base_url + "archive.html", function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
    it("/issues returns status code 200", function(done){
      request.get(base_url + "issues.html", function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
    it("/contact returns status code 200", function(done){
      request.get(base_url + "contact.html", function(err, res, body) {
        expect(res.statusCode).toBe(200);
        done();
      });
    });
  });
});