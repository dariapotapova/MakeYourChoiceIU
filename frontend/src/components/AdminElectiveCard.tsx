import type { Elective } from '../types/elective';
import { ElectiveCardBase } from './ElectiveCardBase';
import { ElectiveModal } from './ElectiveModal';
import { AdminElectiveActionsMenu } from './AdminElectiveActionsMenu';
import { useDisclosure } from '../hooks/useDisclosure';
import { useElectiveSearch } from '../hooks/useElectiveSearch';
import { ELECTIVE_TEXT, type Locale } from '../utils/electiveText';
import { highlight } from '../utils/electiveSearch';
import buttonStyles from '../styles/button.module.css';

interface AdminElectiveCardProps {
    elective: Elective;
    locale: Locale;
    query?: string;
    onEdit?: (elective: Elective) => void;
    onArchive?: (elective: Elective) => void;
    onDelete?: (elective: Elective) => void;
}

export function AdminElectiveCard({
                                      elective,
                                      locale,
                                      query = '',
                                      onEdit,
                                      onArchive,
                                      onDelete,
                                  }: AdminElectiveCardProps) {
    const { isOpen, open, close } = useDisclosure(false);
    const text = ELECTIVE_TEXT[locale];

    const { normalizedQuery, previewRaw, longOnly, snippet } = useElectiveSearch(
        elective,
        query
    );

    const descriptionPreview =
        longOnly && snippet
            ? highlight(snippet, normalizedQuery)
            : highlight(
                elective.description.length > 240 ? `${previewRaw}…` : previewRaw,
                normalizedQuery
            );

    return (
        <>
            <ElectiveCardBase
                elective={elective}
                titleContent={highlight(elective.name, normalizedQuery)}
                instructorContent={highlight(elective.instructor, normalizedQuery)}
                languageContent={highlight(elective.electiveLanguage, normalizedQuery)}
                prerequisiteContent={highlight(elective.prerequisite, normalizedQuery)}
                headerAction={
                    <AdminElectiveActionsMenu
                        elective={elective}
                        openMenuLabel={text.actions.openMenu}
                        editLabel={text.actions.edit}
                        archiveLabel={text.actions.archive}
                        deleteLabel={text.actions.delete}
                        onEdit={onEdit}
                        onArchive={onArchive}
                        onDelete={onDelete}
                    />
                }
                descriptionContent={
                    <div>
                        <p>{descriptionPreview}</p>

                        {longOnly ? (
                            <div>{text.hints.matchInFullDescription}</div>
                        ) : null}
                    </div>
                }
                extraInfo={
                    <div>
                        <p>
                            {text.meta.status}: {highlight(String(elective.status), normalizedQuery)}
                        </p>
                        <p>
                            {text.meta.type}: {highlight(elective.electiveType, normalizedQuery)}
                        </p>
                        <p>
                            {text.meta.program}: {highlight(elective.programLanguage, normalizedQuery)}
                        </p>
                        <p>
                            {text.meta.degreeYears}:{' '}
                            {highlight(elective.degreeYear.join(', '), normalizedQuery)}
                        </p>
                    </div>
                }
                footer={
                    <button
                        type="button"
                        onClick={open}
                        className={`${buttonStyles.button} ${buttonStyles.sizeMd} ${buttonStyles.variantGhost}`}
                    >
                        {text.actions.seeMore}
                    </button>
                }
            />

            <ElectiveModal
                open={isOpen}
                title={elective.name}
                onClose={close}
                footer={
                    <div>
                        <button
                            type="button"
                            onClick={() => {
                                close();
                                onEdit?.(elective);
                            }}
                            className={`${buttonStyles.button} ${buttonStyles.sizeMd} ${buttonStyles.variantGhost}`}
                        >
                            {text.actions.edit}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                close();
                                onArchive?.(elective);
                            }}
                            className={`${buttonStyles.button} ${buttonStyles.sizeMd} ${buttonStyles.variantGhost}`}
                        >
                            {text.actions.archive}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                close();
                                onDelete?.(elective);
                            }}
                            className={`${buttonStyles.button} ${buttonStyles.sizeMd} ${buttonStyles.variantGhost}`}
                        >
                            {text.actions.delete}
                        </button>
                    </div>
                }
            >
                <div>
                    <p>
                        {text.meta.teacher}: {highlight(elective.instructor, normalizedQuery)}
                    </p>
                    <p>
                        {text.meta.language}: {highlight(elective.electiveLanguage, normalizedQuery)}
                    </p>
                    <p>
                        {text.meta.prerequisite}: {highlight(elective.prerequisite, normalizedQuery)}
                    </p>
                    <p>
                        {text.meta.status}: {highlight(String(elective.status), normalizedQuery)}
                    </p>
                    <p>
                        {text.meta.type}: {highlight(elective.electiveType, normalizedQuery)}
                    </p>
                    <p>
                        {text.meta.program}: {highlight(elective.programLanguage, normalizedQuery)}
                    </p>
                    <p>
                        {text.meta.degreeYears}:{' '}
                        {highlight(elective.degreeYear.join(', '), normalizedQuery)}
                    </p>

                    <div>{highlight(elective.description, normalizedQuery)}</div>
                </div>
            </ElectiveModal>
        </>
    );
}