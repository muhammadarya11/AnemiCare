import { PrismaClient } from '@prisma/client';
import formatDate from '../utils/formatDate.js';

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

export const getSummary = async (doctorId) => {

    const data = await prisma.riwayat.findMany({
        select: {
            id: true,
            pasien: {
                select: {
                    nama: true,
                    usia: true,
                    gender: true
                }
            },
            hasil_diagnosis: {
                select: {
                    diagnosis: true
                }
            }
        },
        where: {
            dokter_id: doctorId
        }
    });

    if (!data) {
        return null;
    }

    // Olah data
    const totalPasien = data.length;
    // Berdasarkan usia
    const klasifikasiUsia = {
        anak_anak: data.filter((item) => item.pasien.usia >= 0 && item.pasien.usia <= 12),
        remaja: data.filter((item) => item.pasien.usia >= 13 && item.pasien.usia <= 18),
        dewasa: data.filter((item) => item.pasien.usia >= 19 && item.pasien.usia <= 59),
        lansia: data.filter((item) => item.pasien.usia >= 60),
    };

    const klasifikasiGender = {
        laki_laki: data.filter((item) => item.pasien.gender === 'LAKI_LAKI'),
        perempuan: data.filter((item) => item.pasien.gender === 'PEREMPUAN')
    };
    const riwayat = data.map((item) => {
        return {
            nama: item.pasien.nama,
            usia: item.pasien.usia,
            gender: item.pasien.gender,
            diagnosis: item.hasil_diagnosis.diagnosis
        };
    });

    // Hitung Persentase
    const persentase = {
        usia: {
            anak_anak: ((klasifikasiUsia.anak_anak.length / totalPasien) * 100).toFixed(2),
            remaja: ((klasifikasiUsia.remaja.length / totalPasien) * 100).toFixed(2),
            dewasa: ((klasifikasiUsia.dewasa.length / totalPasien) * 100).toFixed(2),
            lansia: ((klasifikasiUsia.lansia.length / totalPasien) * 100).toFixed(2),
        },
        gender: {
            laki_laki: ((klasifikasiGender.laki_laki.length / totalPasien) * 100).toFixed(2),
            perempuan: ((klasifikasiGender.perempuan.length / totalPasien) * 100).toFixed(2),
        },
        riwayat: riwayat
    };

    return { data, persentase };

};

export const getReport = async (from, to) => {

    let data = [];

    if (from && to) {
        // Format Date
        const fromDate = formatDate(from);
        const toDate = formatDate(to);
        data = await prisma.riwayat.findMany({
            select: {
                id: true,
                dokter: {
                    select: {
                        name: true
                    }
                },
                hasil_diagnosis: true,
                pasien: {
                    select: {
                        nama: true,
                        gender: true,
                        usia: true
                    }
                },
                created_at: true
            },
            where: {
                created_at: {
                    gte: fromDate,
                    lte: toDate
                }
            }
        });
    } else {
        // Join Hasil diagnosis, Pasien dan Dokter
        data = await prisma.riwayat.findMany({
            select: {
                id: true,
                dokter: {
                    select: {
                        name: true
                    }
                },
                hasil_diagnosis: true,
                pasien: {
                    select: {
                        nama: true,
                        gender: true,
                        usia: true
                    }
                },
                created_at: true
            }
        });
    }

    return data;
};