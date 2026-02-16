<?php
include "../../menu.php";
include "../../header.php";
?>


<?php
include "../menu.php";
include "../header.php";


?>

<div class="componente">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="homeContabilidad">Contabilidad</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Comprobantes Contables</li>
            </ol>
        </nav>
        <div class="container">
            <div id="ComprobantesContables"></div>
        </div>
    </div>
</div>

<script type="module">
    import {
        AccountingVouchers
    } from './react-dist/billing/reports/AccountingVouchers.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(AccountingVouchers, "ComprobantesContables");
</script>



<?php include "../footer.php"; ?>

<?php
include "../../footer.php";
?>