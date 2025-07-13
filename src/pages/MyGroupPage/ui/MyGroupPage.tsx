import { useGroupStore } from 'entities/Group/model/slice/useGroupStore';
import { CreateGroupForm } from 'features/CreateGroup';
import type { FC } from 'react';
import { PageWrapper } from 'shared/ui/PageWrapper/PageWrapper';
import { Group } from 'widgets/Group';

export const MyGroupPage: FC = () => {
    const currentGroup = useGroupStore((state) => state.currentGroup);

    return <PageWrapper>{!currentGroup ? <CreateGroupForm /> : <Group />}</PageWrapper>;
};
