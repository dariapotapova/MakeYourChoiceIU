import type { ElectiveStatus } from './elective';

export interface StudentElectiveTypeTab {
    value: string;
    label: string;
}

export interface AdminElectiveFilters {
    electiveLanguage: string;
    degreeYear: string;
    electiveTypes: string[];
    programLanguage: string;
    statuses: ElectiveStatus[];
}
