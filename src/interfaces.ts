export interface KernelConfig {
  shell_port: number;
  iopub_port: number;
  stdin_port: number;
  control_port: number;
  hb_port: number;
  ip: string;
  key: string;
  transport: string;
  signature_scheme: string;
  kernel_name: string;
}

export interface KernealHeader {
  msg_id: string;
  username: string;
  session: string;
  msg_type: string;
  date: string;
  version: string;
}
