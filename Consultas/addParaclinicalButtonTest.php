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
        AddParaclinicalButton
    } from './react-dist/clinical-records/AddParaclinicalButton.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(AddParaclinicalButton, 'appointmentModalRoot');
</script>

<?php include "../footer.php"; ?>