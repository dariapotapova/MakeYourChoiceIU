import type { Elective } from '../types/elective';
import { ElectiveCardBase } from './ElectiveCardBase';
import { ElectiveModal } from './ElectiveModal';
import { FavouriteButton } from './FavouriteButton';
import { useDisclosure } from '../hooks/useDisclosure';
import { useElectiveSearch } from '../hooks/useElectiveSearch';
import { ELECTIVE_TEXT, type Locale } from '../utils/electiveText';
import { highlight } from '../utils/electiveSearch';
import buttonStyles from '../styles/button.module.css';

interface StudentElectiveCardProps {
    elective: Elective;
    locale: Locale;
    query?: string;
    isFavourite?: boolean;
    onToggleFavourite?: (elective: Elective) => void;
}

export function StudentElectiveCard({
                                        elective,
                                        locale,
                                        query = '',
                                        isFavourite = false,
                                        onToggleFavourite,
                                    }: StudentElectiveCardProps) {
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
                    <FavouriteButton
                        active={isFavourite}
                        addLabel={text.actions.addFav}
                        removeLabel={text.actions.removeFav}
                        onClick={() => onToggleFavourite?.(elective)}
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
                    <FavouriteButton
                        active={isFavourite}
                        addLabel={text.actions.addFav}
                        removeLabel={text.actions.removeFav}
                        onClick={() => onToggleFavourite?.(elective)}
                    />
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
                    <div>{highlight(elective.description, normalizedQuery)}</div>
                </div>
            </ElectiveModal>
        </>
    );
}