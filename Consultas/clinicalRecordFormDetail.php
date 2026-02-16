<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="">
        <div id="reactForm"></div>
    </div>
</div>

<script type="module">
    import { renderApp } from "./services/react/app-renderer.js"
    import { ClinicalRecordDynamicFormContainer } from "./react-dist/clinical-records/containers/ClinicalRecordDynamicFormContainer.js"

    renderApp(ClinicalRecordDynamicFormContainer, "reactForm");
</script>

<?php
include "../footer.php";