import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveHistory = async ({ patientId, dianosisId }) => {
    await prisma.riwayat.create({
        data: {
            pasien_id: patientId,
            diagnosis_id: dianosisId
        }
    });
};

export const getReport = async () => {

};