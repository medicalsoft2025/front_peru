<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="patientsTableReact"></div>
    </div>
</div>

<script type="module">
    import {
        PatientTablePage
    } from './react-dist/patients/pages/PatientTablePage.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PatientTablePage, "patientsTableReact");
</script>

<?php include "../footer.php"; ?>