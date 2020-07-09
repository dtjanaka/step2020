package com.google.sps.servlets;

class UserInfo {
  boolean loggedIn;
  String url;
  String email;

  public UserInfo(boolean loggedIn, String url, String email) {
    this.loggedIn = loggedIn;
    this.url = url;
    this.email = email;
  }
}