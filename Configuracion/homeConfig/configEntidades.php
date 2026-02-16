<?php
include "../../menu.php";
include "../../header.php";
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
                <li class="breadcrumb-item"><a href="homeConfiguracion">Configuracion</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Entidades</li>
            </ol>
        </nav>
        <div class="main-content">
            <div class="component-container">
                <h2>Configuración de Entidades</h2>
                <div id="EntitiesConfig"></div>
            </div>
        </div>
    </div>
</div>
<script type="module">
    import { EntitiesConfig } from './react-dist/config/entities/EntitiesConfig.js';
    import { renderApp } from './services/react/app-renderer.js';

    renderApp(EntitiesConfig, 'EntitiesConfig');
</script>
<?php
include "../../footer.php";
?>