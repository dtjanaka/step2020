package com.google.sps.servlets;

class Comment {
  String name;
  String comment;
  String date;
  String time;
  String uid;

  public Comment(String name, String comment, String date, String time, String uid) {
    this.name = name;
    this.comment = comment;
    this.uid = uid;
    this.date = date;
    this.time = time;
  }
}