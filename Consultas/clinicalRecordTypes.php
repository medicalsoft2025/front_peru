<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="clinicalRecordTypesRoot"></div>
    </div>
</div>

<script type="module">
    import {
        ClinicalRecordTypes
    } from './react-dist/clinical-record-types/components/ClinicalRecordTypes.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(ClinicalRecordTypes, 'clinicalRecordTypesRoot');
</script>

<?php include "../footer.php"; ?>