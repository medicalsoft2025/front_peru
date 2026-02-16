<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="specialtyPastMedicalHistoryFormRoot"></div>
    </div>
</div>

<script type="module">
    import {
        SpecialtyPastMedicalHistoryForm
    } from './react-dist/past-medical-history/SpecialtyPastMedicalHistoryForm.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(SpecialtyPastMedicalHistoryForm, "specialtyPastMedicalHistoryFormRoot");
</script>

<?php include "../footer.php"; ?>