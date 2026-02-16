<div id="userRoleAppReact"></div>

<script type="module">
  import {
    UserRoleApp
  } from './react-dist/user-roles/UserRoleApp.js';
  import { renderApp } from './services/react/app-renderer.js';

  renderApp(UserRoleApp, 'userRoleAppReact');
</script>