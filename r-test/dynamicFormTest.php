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
        UserForm
    } from './react-dist/dynamic-form/demos/forms/UserForm.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(UserForm, 'appointmentModalRoot');
</script>

<?php include "../footer.php"; ?>