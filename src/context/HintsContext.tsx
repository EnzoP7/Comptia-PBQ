import { createContext, useContext } from 'react';

/**
 * Whether the simulators may show live feedback (compliance meters, "approved" badges,
 * per-option explanations, traffic simulation). Always false in exam mode: the real
 * CompTIA PBQs give no feedback until the exam is scored.
 */
export const HintsContext = createContext<boolean>(false);

export const useHints = () => useContext(HintsContext);
