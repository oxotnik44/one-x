import React, { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
    children: ReactNode;
    navigate: (to: string) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundaryBase extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch() {
        this.props.navigate('/error'); // <- навигация
    }

    render() {
        if (this.state.hasError) {
            return null; // UI не показываем — будет редирект
        }

        return this.props.children;
    }
}

// HOC to inject `navigate`
export function ErrorBoundaryWithRouter({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    return (
        <ErrorBoundaryBase
            navigate={(to) => {
                void navigate(to);
            }}
        >
            {children}
        </ErrorBoundaryBase>
    );
}
