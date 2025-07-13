import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Group } from './Group';

export default {
    title: 'Widgets/Group',
    component: Group,
    decorators: [
        (Story: React.FC) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
};

export const Default = {
    render: () => <Group />,
};
