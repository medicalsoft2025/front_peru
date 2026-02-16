<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <div id="appFormsRoot"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        AppForms
    } from './react-dist/app-forms/components/AppForms.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(AppForms, 'appFormsRoot');
</script>

<?php include "../footer.php"; ?>