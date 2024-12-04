import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const predictAnemia = async (input) => {

    try {
        const { data } = await axios.post('http://localhost:5000/predict', {
            input: input
        });

        return data.data;
    } catch (error) {
        return null;
    }
};

export const savePatient = async ({ nama, usia, no_telp, gender }) => {

    const patient = await prisma.pasien.create({
        data: {
            nama,
            usia,
            no_telp,
            gender
        },
        select: { id: true }
    });

    return patient;

};

export const saveDiagnosis = async (doctorId, idPatient, {
    WBC,
    LYMp,
    NEUTp,
    LYMn,
    NEUTn,
    RBC,
    HGB,
    HCT,
    MCV,
    MCH,
    MCHC,
    PLT,
    PDW,
    PCT,
}, diagnosis) => {

    const diagnosisResult = await prisma.hasil_diagnosis.create({
        data: {
            pasien_id: idPatient,
            dokter_id: doctorId,
            wbc: WBC,
            lymp: LYMp,
            neutp: NEUTp,
            lymn: LYMn,
            neutn: NEUTn,
            rbc: RBC,
            hgb: HGB,
            hct: HCT,
            mcv: MCV,
            mch: MCH,
            mchc: MCHC,
            plt: PLT,
            pdw: PDW,
            pct: PCT,
            diagnosis: diagnosis
        },
        select: {
            id: true,
            diagnosis: true
        }
    });

    return diagnosisResult;
};