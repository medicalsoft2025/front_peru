<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="patientEvolutionsRoot"></div>
    </div>
</div>

<script type="module">
    import {
        PatientEvolutions
    } from './react-dist/patient-evolutions/components/PatientEvolutions.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PatientEvolutions, "patientEvolutionsRoot");
</script>

<?php include "../footer.php"; ?>