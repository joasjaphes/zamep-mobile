import { useCallback, useState } from 'react';

/**
 * Hook to use a toggle state.
 * @param {Boolean} [initialState=false] Initial state.
 * @param {Object} options
 * @param {function(Boolean)} options.onHide Callback when the toggle is hidden.
 * @param {function(Boolean)} options.onShow Callback when the toggle is shown.
 * @returns {[Boolean, function()]} [state, toggle]
 */
export default function useToggle(initialState = false, options = {}) {
  const { onHide, onShow } = options;
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState(!state);
    if (state && onHide && typeof onHide === 'function') {
      onHide(!state);
    }
    if (!state && onShow && typeof onShow === 'function') {
      onShow(!state);
    }
  }, [state, onHide, onShow]);

  return [
    state,
    toggle,
  ];
}
