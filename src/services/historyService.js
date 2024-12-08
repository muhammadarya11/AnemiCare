import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveHistory = async ({ doctorId, patientId, dianosisId }) => {
    await prisma.riwayat.create({
        data: {
            pasien_id: patientId,
            diagnosis_id: dianosisId,
            dokter_id: doctorId
        }
    });
};

export const getReport = async () => {

};