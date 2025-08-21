import {useContext, useEffect} from 'react';
import {UNSAFE_NavigationContext as NavigationContext} from 'react-router';

const useConditionalBlocker = (onBlock: () => void, when: boolean) => {
    const {navigator} = useContext(NavigationContext);

    useEffect(() => {
        if (!when) return;

        const originalPush = navigator.push;
        navigator.push = () => {
            onBlock();
            return false;
        };

        return () => {
            navigator.push = originalPush;
        };
    }, [navigator, onBlock, when]);
};

export default useConditionalBlocker;