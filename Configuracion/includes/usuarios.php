<script type="module">
  import {
    UserApp
  } from './react-dist/users/UserApp.js';
  import { renderApp } from './services/react/app-renderer.js';

  renderApp(UserApp, 'userAppReact');
</script>

<div id="userAppReact"></div>