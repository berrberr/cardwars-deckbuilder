<% if(image && name) { %>
  <div class="hero-image">
    <img src="assets/img/heroes/<%- image %>" alt="<%- name %>">
  </div>
<% } else { %>
  <h2>No hero selected! Select one below.</h2>
<% } %>
<button id="editHeroBtn" class="btn btn-default" data-toggle="collapse" data-target="#changeHero">
  Edit Hero
</button>
<div id="changeHero" class="collapse">
  <div id="edit-heroes" class="panel-body hero-image-container">
  </div>
</div>
