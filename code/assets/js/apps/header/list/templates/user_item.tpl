<% if(typeof username !== "undefined" && username) { %>
  <a href="#user/<%- username %>"><%- username %></a>
<% } else { %>
  <a href="#login">Login</a>
<% } %>
