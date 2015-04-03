<div class="row">
  <% _.each(landscapes, function(landscape, index) { %>
    <div class="col-xs-3">
      <select data-index="<%- index %>" class="js-landscape-select form-control">
        <option value="blueplains" <% if(landscape == "blueplains") { %> 
        selected="selected" <% } %>>Blue Plains</option>
        <option value="cornfield" <% if(landscape == "cornfield") { %> 
        selected="selected" <% } %>>Cornfield</option>
        <option value="nicelands" <% if(landscape == "nicelands") { %> 
        selected="selected" <% } %>>NiceLands</option>
        <option value="sandylands" <% if(landscape == "sandylands") { %> 
        selected="selected" <% } %>>SandyLands</option>
        <option value="uselessswamp" <% if(landscape == "uselessswamp") { %> 
        selected="selected" <% } %>>Useless Swamp</option>
      </select>
    </div>
  <% }) %>
</div>
