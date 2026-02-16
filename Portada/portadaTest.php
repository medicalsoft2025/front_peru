<?php
include_once("../basicMenu.php");
?>
<div id="landingHome"></div>
<script type="module">
  import {
    LandingApp
  } from '../react-dist/landingWeb/LandingApp.js';
  import { renderApp } from "./services/react/app-renderer.js";

  renderApp(LandingApp, 'landingHome');
</script>

<?php include_once("../basicFooter.php"); ?>