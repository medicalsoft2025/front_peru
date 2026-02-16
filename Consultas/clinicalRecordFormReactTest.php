<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
    </div>
</div>

<script type="module">
    import {
        ClinicalRecordDynamicForm
    } from './react-dist/clinical-records/components/ClinicalRecordDynamicForm.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(ClinicalRecordDynamicForm, "appointmentModalRoot", {
        dynamicFormId: "1"
    });
</script>

<?php include "../footer.php"; ?>