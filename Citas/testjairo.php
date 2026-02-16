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
        JairoTest
    } from './react-dist/test/JairoTest.js';
    import {
        renderApp
    } from "./services/react/app-renderer.js";

    renderApp(JairoTest, "appointmentModalRoot");
</script>

<?php include "../footer.php"; ?>