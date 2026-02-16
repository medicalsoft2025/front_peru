<?php
include "../menu.php";
include "../header.php";

// Datos de ejemplo para evoluciones
$evolucionesData = [
    [
        "titulo" => "Evolución del paciente",
        "Descripcion" => "El paciente presenta mejoría en los síntomas de dolor abdominal.",
        "fecha" => "2024-01-01",
        "Medico" => "Dr. Pérez"
    ],
    [
        "titulo" => "Seguimiento postoperatorio",
        "Descripcion" => "Paciente estable, sin complicaciones postoperatorias.",
        "fecha" => "2024-01-08",
        "Medico" => "Dra. Gómez"
    ]
];

$jsonData = json_encode($evolucionesData);
?>

<script type="module">
    import {
        EvolutionsContent
    } from './react-dist/evolutions/EvolutionsContent.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(EvolutionsContent, "evolution-data-content");
</script>

<style type="text/css">
    /* Estilos existentes (puedes reutilizarlos) */
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
    }

    .timeline {
        list-style: none;
        padding: 0;
        position: relative;
    }

    .timeline-item {
        margin: 20px 0;
        position: relative;
        padding-left: 40px;
    }

    .timeline-item h5 {
        margin-bottom: 5px;
        color: #495057;
    }

    .timeline-item p {
        margin: 0;
    }
</style>

<div class="componete">
    <div class="content">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Evoluciones</li>
            </ol>
        </nav>
        <!-- <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="row align-items-center justify-content-between">
                        <div class="col-md-6"></div>
                        <div class="col-md-6 text-md-end text-start mt-2 mt-md-0">
                            
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-0 g-md-4 g-xl-6 p-5">
                <h2 class="mb-0 patientName">Cargando...</h2>
                <div class="col-4">
                    <?php //include "../Pacientes/infoPaciente.php"; ?>
                </div>

                <div class="col-8">
                    <h3>Evoluciones</h3>
                    <button type="button" class="btn btn-primary mt-3 mb-3" data-bs-toggle="modal"
                        data-bs-target="#nuevaEvolucionModal">
                        Agregar Nueva Evolución
                    </button>
                    <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="evoluciones-tab" data-bs-toggle="tab" href="#tab-evoluciones"
                                role="tab" aria-controls="tab-evoluciones" aria-selected="true">
                                <i class="fas fa-chart-line"></i> Evoluciones
                            </a>
                        </li>
                    </ul>
                    <div class="tab-content mt-3" id="myTabContent">
                        <div class="tab-pane fade show active" id="tab-evoluciones" role="tabpanel"
                            aria-labelledby="evoluciones-tab">
                            <div id="evolution-data-content"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        <div id="evolutionsReact"></div>
    </div>
</div>

<script type="module">
    import {
        PatientEvolutions
    } from './react-dist/patient-evolutions/components/PatientEvolutions.js';
    import { renderApp } from "./services/react/app-renderer.js";

    renderApp(PatientEvolutions, "evolutionsReact");
</script>

<script type="module">
    import {
        patientService
    } from "../services/api/index.js";
    document.addEventListener("DOMContentLoaded", async () => {
        const patientId = new URLSearchParams(window.location.search).get("id") || new URLSearchParams(window.location.search).get("patient_id");
        try {
            if (patientId) {
                const paciente = await patientService.get(patientId);
                displayPatientData(paciente)
            }

        } catch (error) {
            console.error("Error al obtener los datos:", error);
        }
    });

    async function displayPatientData(paciente) {
        if (!paciente) {
            console.log("Paciente no encontrado");
            return;
        }
        const nameBreadcumb = document.getElementById("nameBradcumb");

        if (nameBreadcumb) {
            nameBreadcumb.textContent = paciente.first_name + ' ' + paciente.last_name;
        }
        document.querySelectorAll(".patientName").forEach(element => {
            element.textContent = paciente.first_name + ' ' + paciente.last_name
            if (element.tagName === 'A') {
                element.href = `verPaciente?id=${paciente.id}`
            }
        })
    }
</script>

<?php
include "modalEvoluciones.php";
include "../footer.php";
?>