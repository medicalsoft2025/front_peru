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
    import ReactDOMClient from "react-dom/client";
    import {
        FinishClinicalRecordModal
    } from './react-dist/clinical-records/FinishClinicalRecordModal.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(FinishClinicalRecordModal, "appointmentModalRoot", {
        appointmentId: "1",
        clinicalRecordType: "historiaEndocrinologia",
        externalDynamicData: {},
        patientId: "1",
        visible: true,
        onClose: () => {
            ReactDOMClient.createRoot(rootElement).unmount();
        }
    });
</script>

<?php include "../footer.php"; ?>