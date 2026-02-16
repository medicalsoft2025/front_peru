<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="clinicalRecordSectionsRoot"></div>
    </div>
</div>

<script type="module">
    import {
        ClinicalRecordSections
    } from './react-dist/clinical-record-sections/components/ClinicalRecordSections.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(ClinicalRecordSections, 'clinicalRecordSectionsRoot', {
        clinicalRecordTypeId: new URLSearchParams(window.location.search).get('clinicalRecordTypeId'),
    });
</script>

<?php include "../footer.php"; ?>