<?php
include "../menu.php";
include "../header.php";
?>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item"><a
                        href="verOrdenesExamenes?patient_id=<?php echo $_GET['patient_id']; ?>">Laboratorio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Cargar resultados de examen</li>
            </ol>
        </nav>

        <div id="examDetailAppReact"></div>

    </div>
    <?php include "../footer.php"; ?>
</div>

<script type="module">
    import {
        ExamResultsDetail
    } from './react-dist/exams/components/ExamResultsDetail.js';
    import {
        patientService
    } from "./services/api/index.js";
    import AlertManager from "./services/alertManager.js";
    import UserManager from "./services/userManager.js";
    import { renderApp } from "./services/react/app-renderer.js";

    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const examId = new URLSearchParams(window.location.search).get('exam_id');

    const patient = await patientService.get(patientId);

    document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`
        }
    })

    renderApp(ExamResultsDetail, "examDetailAppReact", {
        examId
    });
</script>