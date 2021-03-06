package com.google.sps.servlets;

import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/login-status")
public class Login extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    response.setContentType("application/json");

    String page = request.getParameter("page");

    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      String logoutUrl = userService.createLogoutURL("/" + page + ".html");
      Gson gson = new GsonBuilder().setPrettyPrinting().create();
      String userInfo = gson.toJson(new UserInfo(true, logoutUrl));
      response.getWriter().println(userInfo);
    } else {
      String loginUrl = userService.createLoginURL("/" + page + ".html");
      Gson gson = new GsonBuilder().setPrettyPrinting().create();
      String userInfo = gson.toJson(new UserInfo(false, loginUrl));
      response.getWriter().println(userInfo);
    }
  }
}