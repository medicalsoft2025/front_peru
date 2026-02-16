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
        AppointmentFormModal
    } from './react-dist/appointments/AppointmentFormModal.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(AppointmentFormModal, "appointmentModalRoot", {
        isOpen: true,
        onClose: () => { }
    });
</script>

<?php include "../footer.php"; ?>