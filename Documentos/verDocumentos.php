<?php
include "../menu.php";
include "../header.php";
?>


<div class="main-content">
    <div class="component-container">
        <div id="asignar-consentimiento"></div>
    </div>
</div>

<?php
include "./modalDocumento.php";
?>

<script type="module">
    // import {
    //     patientService
    // } from "../../services/api/index.js";

    // const patientId = new URLSearchParams(window.location.search).get('patient_id');
    // const patientPromise = patientService.get(patientId);

    // const [patient] = await Promise.all([patientPromise]);

    // document.querySelectorAll('.patientName').forEach(element => {
    //     element.textContent = `${patient.first_name} ${patient.last_name}`;
    //     if (element.tagName === 'A') {
    //         element.href = `verPaciente?id=${patient.id}`
    //     }
    // })
    import AsignarConsentimiento from '../../react-dist/config/asignar-consentimiento/AsignarConsentimiento.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(AsignarConsentimiento, "asignar-consentimiento");
</script>
<?php
include "../footer.php";
?>