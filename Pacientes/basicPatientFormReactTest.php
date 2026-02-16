<?php
include "../menu.php";
include "../header.php";
?>

<div class="content mt-3">
    <div class="container-small mt-3">
        <div id="basicPatientFormRoot"></div>
    </div>
</div>

<script type="module">
    import {
        BasicPatientForm
    } from './react-dist/patients/BasicPatientForm.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(BasicPatientForm, "basicPatientFormRoot");
</script>

<?php include "../footer.php"; ?>