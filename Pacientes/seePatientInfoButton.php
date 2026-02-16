<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="patientInfoButtonRoot"></div>
    </div>
</div>

<script type="module">
    import {
        SeePatientInfoButton
    } from './react-dist/patients/SeePatientInfoButton.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(SeePatientInfoButton, "patientInfoButtonRoot");
</script>

<?php include "../footer.php"; ?>