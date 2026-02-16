<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div id="formBuilderRoot"></div>
</div>

<script type="module">
    import {
        FormBuilder
    } from './react-dist/form-builder/components/FormBuilder.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(FormBuilder, 'formBuilderRoot');
</script>

<?php include "../footer.php"; ?>