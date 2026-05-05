import type { Elective, ElectiveStatus } from '../types/elective';
import type { StudentDataResponse } from '../types/auth';

type AdminElectiveResponse = {
    id: number;
    name: string;
    instructor: string;
    description: string;
    elective_language: string;
    status: ElectiveStatus;
    prerequisite: string;
    elective_type: string;
    program_language: string;
    degree_year: string[];
};

export function mapAdminElectiveToElective(
    elective: AdminElectiveResponse
): Elective {
    return {
        id: elective.id,
        name: elective.name,
        instructor: elective.instructor,
        description: elective.description,
        electiveLanguage: elective.elective_language,
        status: elective.status,
        prerequisite: elective.prerequisite,
        electiveType: elective.elective_type,
        programLanguage: elective.program_language,
        degreeYear: elective.degree_year ?? [],
    };
}

export function mapAdminElectivesToElectives(
    electives: AdminElectiveResponse[]
): Elective[] {
    return electives.map(mapAdminElectiveToElective);
}

export function mapStudentDataToElectives(studentData: StudentDataResponse): Elective[] {
    return studentData.available_electives.flatMap((group) =>
        group.electives.map((elective) => ({
            id: elective.id,
            name: elective.name,
            instructor: elective.instructor,
            description: elective.description,
            electiveLanguage: elective.elective_language,
            status: 0,
            prerequisite: elective.prerequisite,
            electiveType: group.elective_type,
            programLanguage: '',
            degreeYear: [],
        }))
    );
}