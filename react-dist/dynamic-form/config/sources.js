import { clinicalRecordTypeService, userService } from "../../../services/api/index.js";
export const sources = {
  "doctors": async params => {
    const doctors = await userService.getAllUsers();
    return doctors.map(doctor => ({
      label: doctor.full_name,
      value: doctor.id
    }));
  },
  "clinicalRecordType": async params => {
    const clinicalRecordType = await clinicalRecordTypeService.getAll();
    return clinicalRecordType.map(clinicalRecordType => ({
      label: clinicalRecordType.name,
      value: clinicalRecordType.id
    }));
  }
};