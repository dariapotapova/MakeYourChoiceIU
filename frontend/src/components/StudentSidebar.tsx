import type { StudentSidebarSection } from '../types/studentSidebar';
import buttonStyles from '../styles/button.module.css';
import styles from './StudentSidebar.module.css';

interface StudentSidebarProps {
    sections: StudentSidebarSection[];
    activeSectionKey: string;
    onChange: (key: string) => void;
}

export function StudentSidebar({
                                   sections,
                                   activeSectionKey,
                                   onChange,
                               }: StudentSidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav} aria-label="Student sections">
                {sections.map((section) => {
                    const isActive = activeSectionKey === section.key;

                    return (
                        <button
                            key={section.key}
                            type="button"
                            onClick={() => onChange(section.key)}
                            aria-pressed={isActive}
                            className={[
                                buttonStyles.button,
                                buttonStyles.sizeMd,
                                isActive ? buttonStyles.variantPrimary : buttonStyles.variantGhost,
                                styles.sectionButton,
                            ].join(' ')}
                        >
                            <span className={styles.label}>{section.label}</span>

                            {section.kind === 'elective-type' && section.requiredCount ? (
                                <span className={styles.meta}>Choose {section.requiredCount}</span>
                            ) : null}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}