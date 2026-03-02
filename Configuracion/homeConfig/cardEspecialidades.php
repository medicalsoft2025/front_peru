<?php
include "../../menu.php";
include "../../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="configUsuarios">Usuarios</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Especialidades</li>
            </ol>
        </nav>

        <div id="specialities">
        </div>
    </div>

    <script type="module">
        import SpecialityApp from './react-dist/fe-config/speciality/SpecialityApp.js';
        import { renderApp } from './services/react/app-renderer.js';

        renderApp(SpecialityApp, 'specialities');
    </script>
</div>

<?php
include "../../footer.php";
?>