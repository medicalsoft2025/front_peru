<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
    </div>
</div>

<script type="module">
    import {
        EnvironmentalApp
    } from './react-dist/environmental/components/EnvironmentalApp.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(EnvironmentalApp, 'appointmentModalRoot');
</script>

<?php include "../footer.php"; ?>