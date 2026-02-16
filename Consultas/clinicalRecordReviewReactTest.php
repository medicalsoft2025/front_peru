<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="clinicalRecordReviewRoot"></div>
    </div>
</div>

<script type="module">
    import {
        ClinicalRecordReview
    } from './react-dist/clinical-records/ClinicalRecordReview.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(ClinicalRecordReview, 'clinicalRecordReviewRoot');
</script>

<?php include "../footer.php"; ?>