// src/pages/Album/AlbumPage.tsx
import { AutoHideScroll, ButtonNavigation, PageWrapper } from 'shared/ui';
import { Album } from 'widgets/Album';

export const AlbumPage = () => {
    return (
        <PageWrapper notCenter>
            <ButtonNavigation back />

            <AutoHideScroll className="px-4">
                <Album />
            </AutoHideScroll>
        </PageWrapper>
    );
};
