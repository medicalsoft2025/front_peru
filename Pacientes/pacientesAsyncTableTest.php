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
        PatientAsyncTable
    } from './react-dist/patients/PatientAsyncTable.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PatientAsyncTable, "appointmentModalRoot");
</script>

<?php include "../footer.php"; ?>