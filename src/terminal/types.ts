/** Serializable state of a simulated Linux server used by the terminal PBQs. */

export interface VNode {
  type: 'file' | 'dir';
  content?: string;
  mode: number;
  owner: string;
  group: string;
}

export interface VProcess {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  command: string;
}

export interface VSocket {
  proto: 'tcp' | 'udp';
  local: string;
  remote: string;
  state: 'LISTEN' | 'ESTABLISHED' | '';
  pid: number;
  program: string;
}

export interface VService {
  description: string;
  active: boolean;
  enabled: boolean;
  pid?: number;
}

export interface VUser {
  uid: number;
  locked: boolean;
}

export interface VFirewallRule {
  /** ufw rules only apply while ufw is enabled. */
  via?: 'ufw' | 'iptables';
  chain: string;
  target: 'DROP' | 'REJECT' | 'ACCEPT';
  source: string;
  proto?: string;
  dport?: string;
}

export interface TerminalLine {
  kind: 'in' | 'out' | 'err';
  text: string;
}

export interface TerminalState {
  host: string;
  cwd: string;
  fs: Record<string, VNode>;
  processes: VProcess[];
  sockets: VSocket[];
  services: Record<string, VService>;
  crontabs: Record<string, string[]>;
  users: Record<string, VUser>;
  firewall: VFirewallRule[];
  ufwActive: boolean;
  lines: TerminalLine[];
  history: string[];
  /** Free-text answers to the questions of the PBQ (question id -> text). */
  answers: Record<string, string>;
}

export interface TerminalQuestion {
  id: string;
  label: string;
  placeholder: string;
}
