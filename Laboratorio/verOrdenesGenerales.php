<?php
include "../menu.php";
include "../header.php";
?>

<style>
    .container-small {
        max-width: 100% !important;
        width: 100%;
        padding: 0;
        margin: 0;
    }
</style>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Laboratorio</li>
            </ol>
        </nav>

        <div id="examsGeneralAppReact"></div>

    </div>
    <?php include "../footer.php"; ?>
</div>

<script type="module">
    import ExamGeneralApp from './react-dist/exams/ExamGeneralApp.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(ExamGeneralApp, "examsGeneralAppReact");
</script>