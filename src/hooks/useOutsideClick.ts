import React, {useEffect} from 'react';

type UseOutsideClickProps = {
    refs: React.RefObject<HTMLElement | null>[];
    enabled: boolean;
    onOutsideClick: () => void;
};

export function useOutsideClick({refs, enabled, onOutsideClick}: UseOutsideClickProps) {
    useEffect(() => {
        if (!enabled) return;

        const handleClick = (e: MouseEvent) => {
            const isClickInside = refs.some((ref) => ref.current?.contains(e.target as Node));
            if (!isClickInside) {
                onOutsideClick();
            }
        };

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [enabled, refs, onOutsideClick]);
}
