<?php
include "../menu.php";
include "../header.php";
?>


<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mt-5">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item">
                    <a class="patient-name" href="verPaciente?id=<?= $_GET['patient_id'] ?>">
                        Cargando paciente...
                    </a>
                </li>
                <li class="breadcrumb-item active">Documentos del paciente</li>
            </ol>
        </nav>
        <div id="patient-documents"></div>
    </div>
</div>

<script type="module">
    import React from "react";
    import ReactDOMClient from "react-dom/client";
    import {
        PatientDocumentsApp
    } from './react-dist/patients/patientDocuments/PatientDocumentsApp.js';
        import { patientService } from '../../services/api/index.js';

    class PatientApp {
        constructor() {
            this.patientId = new URLSearchParams(window.location.search).get('patient_id');
            this.init();
        }

        async init() {
            try {
                await this.loadPatientData();
            } catch (error) {
                this.handleError(error);
            }
        }

        async loadPatientData() {
            if (!this.patientId) throw new Error('No patient ID provided');
            
            this.patient = await patientService.get(this.patientId);
            this.updateBreadcrumb();
        }

        updateBreadcrumb() {
            const patientElements = document.querySelectorAll('.patient-name');
            const patientName = `${this.patient.first_name} ${this.patient.last_name}`;

            patientElements.forEach(element => {
                element.textContent = patientName;
                element.href = `verPaciente?id=${this.patient.id}`;
            });
        }

        handleError(error) {
            console.error('App initialization error:', error);
            document.querySelectorAll('.patient-name').forEach(element => {
                element.textContent = 'Paciente no encontrado';
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => new PatientApp());

    const rootElement = document.getElementById('patient-documents');
    if (rootElement) {
        ReactDOMClient.createRoot(rootElement).render(React.createElement(PatientDocumentsApp));
    }
</script>
<?php
include "../footer.php";
?>