<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="homeConfiguracion">Configuración</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Configuracion Empresa</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <div id="company-crud-react"></div>
            </div>
        </div>
    </div>
</div>

<script type="module">
    import {
        CompaniesCrud
    } from './react-dist/config/companies-crud/CompaniesCrud.js';
    import { renderApp } from "../services/react/app-renderer.js";

    renderApp(CompaniesCrud, "company-crud-react");
</script>

<?php
include "../../footer.php";
?>