<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appointmentModalRoot"></div>
        <button id="btnTest">Test</button>
    </div>
</div>

<script type="module">
    import React from "react";
    import {
        SendClinicalRecordMessagesHookWrapper
    } from './react-dist/wrappers/SendMessagesWrapper.js';
    import { renderApp } from "./services/react/app-renderer.js";

    const sendClinicalRecordMessagesHookWrapperRef = React.createRef();

    renderApp(SendClinicalRecordMessagesHookWrapper, "appointmentModalRoot", {
        clinicalRecordId: 58,
        ref: sendClinicalRecordMessagesHookWrapperRef
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('btnTest').addEventListener('click', () => {
            sendClinicalRecordMessagesHookWrapperRef.current.sendClinicalRecordMessages();
        });
    });
</script>

<?php include "../footer.php"; ?>