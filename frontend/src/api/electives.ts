import type { Elective, ElectiveDto } from '../types/elective';
import { getCsrfToken } from '../utils/csrf';

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

async function readErrorBody(response: Response): Promise<string> {
    try {
        const text = await response.text();
        return text || `HTTP error: ${response.status}`;
    } catch {
        return `HTTP error: ${response.status}`;
    }
}

async function handleJsonResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorBody = await readErrorBody(response);
        console.error('API error body:', errorBody);
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json() as Promise<T>;
}

function buildJsonHeaders(includeContentType = false): HeadersInit {
    const csrfToken = getCsrfToken();

    return {
        Accept: 'application/json',
        ...(includeContentType ? { 'Content-Type': 'application/json' } : {}),
        ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
    };
}

export interface UpdateElectivePayload {
    name?: string;
    instructor?: string;
    description?: string;
    elective_language?: string;
    status?: 0 | 1;
    prerequisite?: string;
    elective_type?: string;
    program_language?: string;
    degree_year?: string[];
}

export async function getElectiveById(id: number): Promise<Elective> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'GET',
        credentials: 'include',
        headers: buildJsonHeaders(false),
    });

    const data = await handleJsonResponse<ElectiveDto>(response);
    return mapElectiveDto(data);
}

export async function getElectives(): Promise<Elective[]> {
    const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        credentials: 'include',
        headers: buildJsonHeaders(false),
    });

    const data = await handleJsonResponse<ElectiveDto[]>(response);
    return data.map(mapElectiveDto);
}

export async function createElective(
    payload: UpdateElectivePayload
): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        credentials: 'include',
        headers: buildJsonHeaders(true),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await readErrorBody(response);
        console.error('createElective error body:', errorBody);
        throw new Error(`HTTP error: ${response.status}`);
    }
}

export async function updateElective(
    id: number,
    payload: UpdateElectivePayload
): Promise<Elective> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: buildJsonHeaders(true),
        body: JSON.stringify(payload),
    });

    const data = await handleJsonResponse<ElectiveDto>(response);
    return mapElectiveDto(data);
}

export async function archiveElective(id: number): Promise<Elective> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'PATCH',
        credentials: 'include',
        headers: buildJsonHeaders(true),
        body: JSON.stringify({ status: 1 }),
    });

    const data = await handleJsonResponse<ElectiveDto>(response);
    return mapElectiveDto(data);
}

export async function deleteElective(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: buildJsonHeaders(false),
    });

    if (!response.ok) {
        const errorBody = await readErrorBody(response);
        console.error('deleteElective error body:', errorBody);
        throw new Error(`HTTP error: ${response.status}`);
    }
}