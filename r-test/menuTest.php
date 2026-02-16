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
        MenusApp
    } from './react-dist/menus/components/MenusApp.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(MenusApp, 'appointmentModalRoot');
</script>

<?php include "../footer.php"; ?>