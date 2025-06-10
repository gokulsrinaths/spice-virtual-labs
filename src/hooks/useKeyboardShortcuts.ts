import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
        const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
        const altMatch = !!shortcut.altKey === event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Return a function to get all registered shortcuts
  const getShortcuts = useCallback(() => {
    return shortcuts.map((shortcut) => ({
      ...shortcut,
      combination: [
        shortcut.ctrlKey && 'Ctrl',
        shortcut.altKey && 'Alt',
        shortcut.shiftKey && 'Shift',
        shortcut.key.toUpperCase(),
      ]
        .filter(Boolean)
        .join(' + '),
    }));
  }, [shortcuts]);

  return { getShortcuts };
} 