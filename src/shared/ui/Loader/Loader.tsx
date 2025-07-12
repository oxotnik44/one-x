import { memo } from 'react';
import loaderGif from 'shared/assets/Loader.gif';

const LoaderComponent = () => <img src={loaderGif} alt="Loading..." draggable={false} />;

export const Loader = memo(LoaderComponent);
Loader.displayName = 'Loader';
