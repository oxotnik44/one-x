import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageWrapper } from './PageWrapper';

const meta: Meta<typeof PageWrapper> = {
    title: 'shared/PageWrapper',
    component: PageWrapper,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageWrapper>;

export const Default: Story = {
    render: () => (
        <PageWrapper>
            <div
                style={{
                    width: 300,
                    height: 200,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    fontWeight: 'bold',
                }}
            ></div>
        </PageWrapper>
    ),
};
