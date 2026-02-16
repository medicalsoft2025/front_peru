<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <a href="patientEvolutionsDos?patient_id=12">Evoluciones React Dos</a>
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