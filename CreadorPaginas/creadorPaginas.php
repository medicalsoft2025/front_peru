<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div id="creadorPaginasRoot"></div>
</div>

<script type="module">
    import {
        WebCreatorApp
    } from './react-dist/web-creator/WebCreatorApp.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(WebCreatorApp, "creadorPaginasRoot");
</script>

<?php include "../footer.php"; ?>