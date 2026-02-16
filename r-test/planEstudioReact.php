<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="planEstudioRoot"></div>
    </div>
</div>

<script type="module">
    import {
        PlanEstudioWrapper
    } from './react-dist/learning/wrappers/PlanEstudioWrapper.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PlanEstudioWrapper, 'planEstudioRoot');
</script>

<?php include "../footer.php"; ?>