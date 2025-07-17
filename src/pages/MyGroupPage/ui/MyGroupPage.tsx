import { useGroupStore } from 'entities/Group';
import { CreateGroupForm } from 'features/CreateGroupForm';
import type { FC } from 'react';
import { PageWrapper } from 'shared/ui';
import { Group } from 'widgets/Group';

export const MyGroupPage: FC = () => {
    const currentGroup = useGroupStore((state) => state.currentGroup);

    return <PageWrapper>{!currentGroup ? <CreateGroupForm /> : <Group />}</PageWrapper>;
};
