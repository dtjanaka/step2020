package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;

@WebServlet("/my-profile")
public class ProfilePage extends HttpServlet {
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    response.setContentType("application/json");

    UserService userService = UserServiceFactory.getUserService();

    if(!userService.isUserLoggedIn()) {
      response.sendRedirect("/profile.html");
      return;
    }

    //int nComments = 10;

    String uid = userService.getCurrentUser().getUserId();

    Filter propertyFilter =
        new FilterPredicate("uid", FilterOperator.EQUAL, uid);

    Query query = new Query("Comment").
        setFilter(propertyFilter).
        addSort("iso8601", Query.SortDirection.DESCENDING);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery storedComments = datastore.prepare(query);

    ArrayList<Comment> comments = new ArrayList<Comment>();
    //int maxComments = 0;
    for (Entity entity : storedComments.asIterable()) {
      String name = (String)entity.getProperty("name");
      String comment = (String)entity.getProperty("comment");
      String date = (String)entity.getProperty("date");
      String time = (String)entity.getProperty("time");

      //maxComments++;
      comments.add(new Comment(name, comment, date, time, null));
      /*if (!numComments.equals("All") && maxComments >= nComments) {
        break;
      }*/
    }

    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    String jsonComments = gson.toJson(comments);
    response.getWriter().println(jsonComments);
  }
}