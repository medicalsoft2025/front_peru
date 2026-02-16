<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeContabilidad">Pacientes</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Telemedicina</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="TelemedicinaMain"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import {
        TelemedicinaMain
    } from './react-dist/telemedicine/TelemedicinaMain.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(TelemedicinaMain, 'TelemedicinaMain');
</script>
<?php
include "../footer.php";
?>