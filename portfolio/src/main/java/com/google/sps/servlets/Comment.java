package com.google.sps.servlets;

class Comment {
  String name;
  String comment;
  String date;
  String time;

  public Comment(String name, String comment, String date, String time) {
    this.name = name;
    this.comment = comment;
    this.date = date;
    this.time = time;
  }
}