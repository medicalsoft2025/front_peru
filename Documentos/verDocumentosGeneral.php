<?php
include "../menu.php";
include "../header.php";
?>


<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="home">Home</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Consentimientos
                </li>
            </ol>
        </nav>
        <div class="container">

            <div id="signature-table-general"></div>
        </div>
    </div>
</div>

<script type="module">
    import {
        SignatureTableGeneral
    } from '../../react-dist/config/asignar-consentimiento/components/SignatureTableGeneral.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(SignatureTableGeneral, "signature-table-general");
</script>
<?php
include "../footer.php";
?>