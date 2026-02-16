<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="componente">
    <div class="content">

        <div id="report-commissions"></div>

    </div>
</div>

<script type="module">
    import {
        Commissions
    } from './react-dist/reports/Commissions.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(Commissions, 'report-commissions');
</script>

<?php
include "../../footer.php";
?>