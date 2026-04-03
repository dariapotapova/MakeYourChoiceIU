//src/api/electives.ts
import type {Elective, ElectiveDto} from "../types/elective.ts";

const API_BASE_URL = '/api/electives';

function mapElectiveDto(dto: ElectiveDto): Elective {
    return {
        id: dto.id,
        name: dto.name,
        instructor: dto.instructor,
        description: dto.description,
        electiveLanguage: dto.elective_language,
        status: dto.status,
        prerequisite: dto.prerequisite,
        electiveType: dto.elective_type,
        programLanguage: dto.program_language,
        degreeYear: dto.degree_year,
    };
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return await response.json() as Promise<T>;
}

export async function getElectiveById(id: number): Promise<Elective> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    });

    const data = await handleResponse<ElectiveDto>(response);
    return mapElectiveDto(data)

}

export async function getElectives(): Promise<Elective[]> {
    const response = await fetch(`${API_BASE_URL}/`, {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    });

    const data = await handleResponse<ElectiveDto[]>(response);
    return data.map(mapElectiveDto)
}

export interface UpdateElectivePayload {
    name?: string;
    instructor?: string;
    description?: string;
    elective_language?: string;
    status?: Elective['status'];
    prerequisite?: string;
    elective_type?: string;
    program_language?: string;
    degree_year?: string[];
}

/**
 * Обновить электив.
 * Обычно это PATCH, если меняем часть полей.
 */
export async function updateElective(
    id: number,
    payload: UpdateElectivePayload
): Promise<Elective> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    console.log(JSON.stringify(payload));

    return handleResponse<Elective>(response);
}

/**
 * Архивировать электив.
 *
 * Тут возможны 2 варианта:
 * 1. отдельный endpoint /archive/
 * 2. обычный PATCH status=1
 *
 * Ниже дан простой вариант через PATCH.
 * Если у вашего бэка другой endpoint, поменяешь только эту функцию.
 */
export async function archiveElective(id: number): Promise<Elective> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 1 }),
    });

    return handleResponse<Elective>(response);
}

/**
 * Удалить электив.
 *
 * Обычно DELETE возвращает либо пустой body,
 * либо 204 No Content.
 */
export async function deleteElective(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }
}
