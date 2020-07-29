package com.google.sps.servlets;

class Comment {
  String name;
  String comment;
  String utc;
  String uid;

  public Comment(String name, String comment, String utc, String uid) {
    this.name = name;
    this.comment = comment;
    this.uid = uid;
    this.utc = utc;
  }
}