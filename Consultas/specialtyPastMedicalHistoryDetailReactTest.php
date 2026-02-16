<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="specialtyPastMedicalHistoryDetailRoot"></div>
    </div>
</div>

<script type="module">
    import {
        SpecialtyPastMedicalHistoryDetail
    } from './react-dist/past-medical-history/SpecialtyPastMedicalHistoryDetail.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(SpecialtyPastMedicalHistoryDetail, "specialtyPastMedicalHistoryDetailRoot");
</script>

<?php include "../footer.php"; ?>