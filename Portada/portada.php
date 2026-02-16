<?php
include "../menu.php";
include "../header.php";

$baner = "";
?>

<div class="componete">
  <div class="">
    <div class="col-12 col-xxl-12">
      <!-- Contenedor Principal para el Dashboard React -->
      <div id="react-dashboard-root"></div>
    </div>
  </div>
</div>

<script type="module">
  import Dashboard from './react-dist/dashboard/Dashboard.js';
  import { renderApp } from "./services/react/app-renderer.js";

  renderApp(Dashboard, 'react-dashboard-root');
</script>

<?php
include "../footer.php";
// include "./modalEventos.php"; // No longer needed as we use React Dialog
?>