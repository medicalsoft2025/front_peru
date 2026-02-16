import { clinicalRecordTypeService, userService } from "../../../services/api"

export const sources = {
    "doctors": async (params: any) => {
        const doctors = await userService.getAllUsers()

        return doctors.map((doctor: any) => ({
            label: doctor.full_name,
            value: doctor.id
        }))
    },
    "clinicalRecordType": async (params: any) => {
        const clinicalRecordType = await clinicalRecordTypeService.getAll()

        return clinicalRecordType.map((clinicalRecordType: any) => ({
            label: clinicalRecordType.name,
            value: clinicalRecordType.id
        }))
    }
}