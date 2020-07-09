// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;

@WebServlet("/comments")
public class DataServlet extends HttpServlet {

  public synchronized boolean isValidCaptcha(String secretKey,
                                             String response) {
    try {
      String url = "https://www.google.com/recaptcha/api/siteverify",
             params = "secret=" + secretKey + "&response=" + response;

      HttpURLConnection http =
          (HttpURLConnection) new URL(url).openConnection();
      http.setDoOutput(true);
      http.setRequestMethod("POST");
      http.setRequestProperty(
          "Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      OutputStream out = http.getOutputStream();
      out.write(params.getBytes("UTF-8"));
      out.flush();
      out.close();

      InputStream in = http.getInputStream();
      BufferedReader br =
          new BufferedReader(new InputStreamReader(in, "UTF-8"));

      StringBuilder sb = new StringBuilder();
      int cp;
      while ((cp = br.read()) != -1) {
        sb.append((char)cp);
      }
      JSONObject json = new JSONObject(sb.toString());
      in.close();

      return json.getBoolean("success");
    } catch (Exception e) {
      System.out.println("Error verifying reCAPTCHA");
    }
    return false;
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    UserService userService = UserServiceFactory.getUserService();

    String name = request.getParameter("name");
    String comment = request.getParameter("comment");
    String uid = userService.getCurrentUser().getUserId();
    String token = request.getParameter("g-recaptcha-response");

    Query query = new Query("Secret");

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery secret = datastore.prepare(query);

    String secretKey = (String)secret.asSingleEntity().getProperty("value");

    if (!isValidCaptcha(secretKey, token) || !userService.isUserLoggedIn()) {
      response.sendRedirect("/comments.html");
      return;
    }

    LocalDateTime now = LocalDateTime.now();
    String nowString = now.toString();
    DateTimeFormatter date = DateTimeFormatter.ofPattern("d MMMM yyyy");
    DateTimeFormatter time = DateTimeFormatter.ofPattern("H:mm:ss a");
    String formatDate = now.format(date);
    String formatTime = now.format(time);

    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("name", name);
    commentEntity.setProperty("comment", comment);
    commentEntity.setProperty("uid", uid);
    commentEntity.setProperty("date", formatDate);
    commentEntity.setProperty("time", formatTime);
    commentEntity.setProperty("iso8601", nowString);

    datastore.put(commentEntity);

    response.sendRedirect("/comments.html");
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    response.setContentType("application/json");

    UserService userService = UserServiceFactory.getUserService();
    String uid = userService.getCurrentUser().getUserId();

    if (!userService.isUserLoggedIn()) {
      response.sendRedirect("/comments.html");
      return;
    }

    String numComments = request.getParameter("numComments");
    String sortType = request.getParameter("sortType");
    String forProfileString = request.getParameter("profile");
    int nComments = 10;
    boolean forProfile = false;

    if (sortType == null) {
      sortType = "dsc";
    }

    if (numComments == null) {
      numComments = "10";
    }

    if (!numComments.equals("All")) {
      try {
        nComments = Integer.parseInt(numComments);
      } catch (Exception e) {
        System.out.println("Error parsing argument to integer");
      }
    }

    if (forProfileString == null) {
      forProfileString = "false";
    }

    try {
      forProfile = Boolean.parseBoolean(forProfileString);
    } catch (Exception e) {
      System.out.println("Error parsing argument to boolean");
    }

    Query query = new Query("Comment").addSort(
        "iso8601", sortType.equals("asc") ? SortDirection.ASCENDING
                                          : SortDirection.DESCENDING);

    if (forProfile) {
      Filter propertyFilter =
          new FilterPredicate("uid", FilterOperator.EQUAL, uid);

      query.setFilter(propertyFilter);
    }

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery storedComments = datastore.prepare(query);

    ArrayList<Comment> comments = new ArrayList<Comment>();
    int maxComments = 0;
    for (Entity entity : storedComments.asIterable()) {
      String name = (String)entity.getProperty("name");
      String comment = (String)entity.getProperty("comment");
      String date = (String)entity.getProperty("date");
      String time = (String)entity.getProperty("time");

      maxComments++;
      comments.add(new Comment(name, comment, date, time, null));
      if (!numComments.equals("All") && maxComments >= nComments) {
        break;
      }
    }

    Gson gson = new GsonBuilder().setPrettyPrinting().create();
    String jsonComments = gson.toJson(comments);
    response.getWriter().println(jsonComments);
  }
}
