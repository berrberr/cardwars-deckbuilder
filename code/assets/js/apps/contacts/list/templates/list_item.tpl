<td><%- firstName %></td>
<td><%- lastName %></td>
<td>
  <a href="#contacts/<%- id %>" class="btn btn-info js-show">
    <i class="glyphicon glyphicon-eye-open"></i>
    Show
  </a>
  <a href="#contacts/<%- id %>/edit" class="btn btn-info js-edit">
    <i class="glyphicon glyphicon-pencil"></i>
    Edit
  </a>
  <button class="btn btn-danger js-delete">
    <i class="glyphicon glyphicon-remove"></i>
    Delete
  </button>
</td>
