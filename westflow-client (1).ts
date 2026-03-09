
export class WestFlowClient {
  public async call(agent: string, tool: string, params: any = {}): Promise<any> {
    console.warn(`[WestFlow] Blocked call to ${agent}/${tool} (Orchestrator Disabled)`);
    return { success: false, error: 'Orchestrator disabled in Direct Mode' };
  }
}
export const westflow = new WestFlowClient();
export default westflow;
