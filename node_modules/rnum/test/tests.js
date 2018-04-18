'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const rnum = require('../src');

describe('Rnum Test Suite', function () {

  for (let i = 0; i < 200; i++) {
    it('should get a random one digit number between 1 and 9', function () {
      expect(rnum(1)).to.be.within(1, 9);
    });
  }

  for (let i = 0; i < 200; i++) {
    it('should get a random two digit number between 10 and 99', function () {
      expect(rnum(2)).to.be.within(10, 99);
    });
  }

  for (let i = 0; i < 200; i++) {
    it('should get a random three digit number between 100 and 999', function () {
      expect(rnum(3)).to.be.within(100, 999);
    });
  }

  for (let i = 0; i < 200; i++) {
    it('should get a random six digit number between 100000 and 999999', function () {
      expect(rnum(6)).to.be.within(100000, 999999);
    });
  }

  it('should throw an error if missing length', function () {
    expect(() => { rnum() }).to.throw(Error);
  });

  it('should always return a number', function () {
    expect((typeof rnum(1) === 'number')).to.eql(true);
    expect((typeof rnum(2) === 'number')).to.eql(true);
    expect((typeof rnum(3) === 'number')).to.eql(true);
    expect((typeof rnum(4) === 'number')).to.eql(true);
    expect((typeof rnum(5) === 'number')).to.eql(true);
    expect((typeof rnum(6) === 'number')).to.eql(true);
    expect((typeof rnum(7) === 'number')).to.eql(true);
    expect((typeof rnum(8) === 'number')).to.eql(true);
    expect((typeof rnum(9) === 'number')).to.eql(true);
    expect((typeof rnum(10) === 'number')).to.eql(true);
  });
});