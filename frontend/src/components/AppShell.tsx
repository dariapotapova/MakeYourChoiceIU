import type { ReactNode } from 'react';
import type { AuthUser } from '../types/auth';
import { AppHeader } from './AppHeader';
import styles from '../styles/appShell.module.css';

interface AppShellProps {
    user: AuthUser;
    searchValue: string;
    onSearchChange: (value: string) => void;
    onLogout: () => void;
    onSwitchToStudent?: () => void;
    children: ReactNode;
}

export function AppShell({
                             user,
                             searchValue,
                             onSearchChange,
                             onLogout,
                             onSwitchToStudent,
                             children,
                         }: AppShellProps) {
    return (
        <div className={styles.shell}>
            <AppHeader
                user={user}
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                onLogout={onLogout}
                onSwitchToStudent={onSwitchToStudent}
            />

            <main className={styles.content}>{children}</main>
        </div>
    );
}