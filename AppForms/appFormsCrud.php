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
        AppFormsCrud
    } from './react-dist/app-forms/components/AppFormsCrud.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(AppFormsCrud, 'appFormsRoot');
</script>

<?php include "../footer.php"; ?>