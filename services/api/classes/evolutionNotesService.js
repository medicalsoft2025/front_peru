import BaseApiService from './baseApiService.js';

export class EvolutionNotesService extends BaseApiService {
    async getEvolutionsByClinicalRecord(id) {
        return await this.httpClient.get(`${this.microservice}/clinical-records/${id}/evolution-notes`);
    }
    async getEvolutionsByParams(startDate, endDate, user_id, patient_id) {
        return await this.httpClient.get(`${this.microservice}/evolution-notes/by-params/${startDate}/${endDate}/${user_id}/${patient_id}`);
    }
    async filterEvolutionNotes({per_page, page, search, startDate, endDate, user_id, patient_id, clinicalRecordId, clinicalRecordTypeId}) {
        return await this.httpClient.get(`${this.microservice}/evolution-notes/filter`, {
                per_page,
                page,
                search,
                createdAt: `${startDate},${endDate}`,
                doctorId: user_id,
                patientId: patient_id,
                clinicalRecordTypeId,
                clinicalRecordId
        });
    }
    async createEvolutionNotes(data, id) {
        return await this.httpClient.post(`${this.microservice}/clinical-records/${id}/evolution-notes`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

export default EvolutionNotesService;