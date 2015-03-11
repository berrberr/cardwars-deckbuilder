<h1>Login</h1>
<form>
  <div class="form-group">
    <label for="login-username">
    Username:</label>
    <input id="login-username" name="username"
    type="text" class="form-control"/>
  </div>
  <div class="form-group">
    <label for="login-password">
    Password:</label>
    <input id="login-password" name="password"
    type="password" class="form-control"/>
  </div>
  <div id="login-error" class="hidden alert alert-danger">Username or password incorrect, try again.</div>
  <button id="btn-submit" class="btn btn-default">Login</button>
  <button id="btn-signup" class="btn btn-success">Signup</button>
</form>
