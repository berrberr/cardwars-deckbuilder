<form>
  <div class="form-group">
    <label for="contact-firstName">
    First name:</label>
    <input id="contact-firstName" name="firstName"
    type="text" value="<%- firstName %>" class="form-control"/>
  </div>
  <div class="form-group">
    <label for="contact-lastName">
    Last name:</label>
    <input id="contact-lastName" name="lastName"
    type="text" value="<%- lastName %>" class="form-control"/>
  </div>
  <div class="form-group">
    <label for="contact-phoneNumber">
    Phone number:</label>
    <input id="contact-phoneNumber" name="phoneNumber"
    type="text" value="<%- phoneNumber %>" class="form-control"/>
  </div>
  <button class="btn btn-default js-submit">Save</button>
</form>
